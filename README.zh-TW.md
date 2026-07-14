# My Tech Wiki

[English](./README.md) | **繁體中文**

個人技術 wiki：存放文章、筆記與技術文件

![Next.js](https://img.shields.io/badge/Next.js_15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?logo=shadcnui&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy_2.0-D71F00?logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?logo=markdown&logoColor=white)

## 開發

### 快速啟動（根目錄）

```bash
pnpm install          # 安裝 concurrently
pnpm install:web      # 安裝前端相依
pnpm install:api      # 建 venv + 安裝後端相依
pnpm dev              # 同時啟動 FastAPI (8000) + Next.js (3000)
```

### 只跑後端（port 8000）

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API 文件：http://localhost:8000/docs

### 只跑前端（port 3000）

```bash
cd frontend
pnpm install
pnpm dev
```

### 測試

```bash
pnpm test   # 或 cd backend && pytest
```

## API

| Method | Path | 說明 |
|---|---|---|
| GET | /api/articles?q=&tag=&category= | 文章列表 / 搜尋 |
| GET | /api/articles/{slug} | 單篇文章 |
| POST | /api/articles | 新增文章 |
| PUT | /api/articles/{slug} | 更新文章 |
| DELETE | /api/articles/{slug} | 刪除文章 |
| GET | /api/categories | 各分類文章數 |

## 環境變數

- `DATABASE_URL`（後端）：預設 `sqlite:///./wiki.db`，正式環境用 `postgresql+psycopg://...`
- `CORS_ORIGINS`（後端）：預設 `http://localhost:3000`
- `NEXT_PUBLIC_API_BASE`（前端）：預設 `http://localhost:8000`
