import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.environ["DATABASE_URL"] = "sqlite:///./test_wiki.db"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def fresh_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


client = TestClient(app)


def test_health():
    assert client.get("/api/health").json() == {"status": "ok"}


def test_crud_flow():
    # create
    r = client.post(
        "/api/articles",
        json={"title": "FastAPI 入門", "summary": "notes", "content": "# Hello", "tags": "python,fastapi"},
    )
    assert r.status_code == 201
    slug = r.json()["slug"]
    assert slug  # slugified

    # read
    r = client.get(f"/api/articles/{slug}")
    assert r.status_code == 200
    assert r.json()["content"] == "# Hello"

    # list + search
    assert len(client.get("/api/articles").json()) == 1
    assert len(client.get("/api/articles", params={"q": "Hello"}).json()) == 1
    assert len(client.get("/api/articles", params={"q": "nope"}).json()) == 0
    assert len(client.get("/api/articles", params={"tag": "python"}).json()) == 1

    # update
    r = client.put(f"/api/articles/{slug}", json={"summary": "updated"})
    assert r.json()["summary"] == "updated"

    # delete
    assert client.delete(f"/api/articles/{slug}").status_code == 204
    assert client.get(f"/api/articles/{slug}").status_code == 404


def test_category_filter_and_listing():
    client.post("/api/articles", json={"title": "React Notes", "category": "Frontend"})
    client.post("/api/articles", json={"title": "FastAPI Notes", "category": "Backend"})
    client.post("/api/articles", json={"title": "More React", "category": "Frontend"})
    client.post("/api/articles", json={"title": "No Category"})

    # filter articles by category
    assert len(client.get("/api/articles", params={"category": "Frontend"}).json()) == 2
    assert len(client.get("/api/articles", params={"category": "Backend"}).json()) == 1

    # category counts, empty category excluded
    cats = client.get("/api/categories").json()
    assert cats == [
        {"name": "Backend", "count": 1},
        {"name": "Frontend", "count": 2},
    ]


def test_duplicate_title_gets_unique_slug():
    a = client.post("/api/articles", json={"title": "Same Title"}).json()
    b = client.post("/api/articles", json={"title": "Same Title"}).json()
    assert a["slug"] != b["slug"]
