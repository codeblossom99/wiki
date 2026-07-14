# My Tech Wiki

**English** | [繁體中文](./README.zh-TW.md)

A personal tech wiki for articles, notes, and technical documentation.

![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_2.0-D71F00?logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?logo=markdown&logoColor=white)

## Development

### Quick start (root)

```bash
pnpm install          # install concurrently
pnpm install:web      # install frontend deps
pnpm install:api      # create venv + install backend deps
pnpm dev              # run FastAPI (8000) + Next.js (3000) together
```

### Backend only (port 8000)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### Frontend only (port 3000)

```bash
cd frontend
pnpm install
pnpm dev
```

### Tests

```bash
pnpm test   # or: cd backend && pytest
```

## API

| Method | Path | Description |
|---|---|---|
| GET | /api/articles?q=&tag=&category= | List / search articles |
| GET | /api/articles/{slug} | Get one article |
| POST | /api/articles | Create article |
| PUT | /api/articles/{slug} | Update article |
| DELETE | /api/articles/{slug} | Delete article |
| GET | /api/categories | Category counts |

## Environment variables

- `DATABASE_URL` (backend): defaults to `sqlite:///./wiki.db`; use `postgresql+psycopg://...` in production
- `CORS_ORIGINS` (backend): defaults to `http://localhost:3000`
- `NEXT_PUBLIC_API_BASE` (frontend): defaults to `http://localhost:8000`
