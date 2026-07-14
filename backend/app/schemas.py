from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ArticleBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(default="", max_length=500)
    category: str = Field(default="", max_length=50)  # e.g. "Frontend", "Backend", "Integration"
    content: str = ""
    tags: str = ""  # comma-separated, e.g. "python,fastapi"


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    summary: str | None = None
    category: str | None = None
    content: str | None = None
    tags: str | None = None


class ArticleOut(ArticleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    created_at: datetime
    updated_at: datetime


class ArticleListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    summary: str
    category: str
    tags: str
    updated_at: datetime


class CategoryCount(BaseModel):
    name: str
    count: int
