from fastapi import APIRouter, Depends, HTTPException, Query
from slugify import slugify
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Article
from ..schemas import ArticleCreate, ArticleListItem, ArticleOut, ArticleUpdate, CategoryCount

router = APIRouter(prefix="/api/articles", tags=["articles"])
categories_router = APIRouter(prefix="/api/categories", tags=["categories"])


@categories_router.get("", response_model=list[CategoryCount])
def list_categories(db: Session = Depends(get_db)):
    rows = db.execute(
        select(Article.category, func.count(Article.id))
        .where(Article.category != "")
        .group_by(Article.category)
        .order_by(Article.category)
    ).all()
    return [CategoryCount(name=name, count=count) for name, count in rows]


def _unique_slug(db: Session, title: str, exclude_id: int | None = None) -> str:
    base = slugify(title) or "article"
    slug, n = base, 2
    while True:
        q = select(Article).where(Article.slug == slug)
        if exclude_id is not None:
            q = q.where(Article.id != exclude_id)
        if db.scalar(q) is None:
            return slug
        slug = f"{base}-{n}"
        n += 1


@router.get("", response_model=list[ArticleListItem])
def list_articles(
    q: str | None = Query(default=None, description="search in title/summary/content"),
    tag: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    stmt = select(Article).order_by(Article.updated_at.desc())
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(Article.title.ilike(like), Article.summary.ilike(like), Article.content.ilike(like))
        )
    if tag:
        stmt = stmt.where(Article.tags.ilike(f"%{tag}%"))
    if category:
        stmt = stmt.where(Article.category == category)
    return db.scalars(stmt).all()


@router.get("/{slug}", response_model=ArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.scalar(select(Article).where(Article.slug == slug))
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.post("", response_model=ArticleOut, status_code=201)
def create_article(payload: ArticleCreate, db: Session = Depends(get_db)):
    article = Article(slug=_unique_slug(db, payload.title), **payload.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article


@router.put("/{slug}", response_model=ArticleOut)
def update_article(slug: str, payload: ArticleUpdate, db: Session = Depends(get_db)):
    article = db.scalar(select(Article).where(Article.slug == slug))
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    data = payload.model_dump(exclude_unset=True)
    if "title" in data and data["title"] != article.title:
        article.slug = _unique_slug(db, data["title"], exclude_id=article.id)
    for k, v in data.items():
        setattr(article, k, v)
    db.commit()
    db.refresh(article)
    return article


@router.delete("/{slug}", status_code=204)
def delete_article(slug: str, db: Session = Depends(get_db)):
    article = db.scalar(select(Article).where(Article.slug == slug))
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(article)
    db.commit()
