# Tera's Tech Wiki

個人技術 wiki：存放文章、筆記與技術文件。

## 技術棧

- **前端**：Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui 風格元件
- **後端**：FastAPI + SQLAlchemy 2.0（開發用 SQLite，可切換 PostgreSQL）
- **內容格式**：Markdown（react-markdown + remark-gfm 渲染）

## 開發

### 後端（port 8000）

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API 文件：http://localhost:8000/docs

### 前端（port 3000）

```bash
cd frontend
npm install
npm run dev
```

### 測試

```bash
cd backend && pytest
```

## API

| Method | Path | 說明 |
|---|---|---|
| GET | /api/articles?q=&tag= | 文章列表 / 搜尋 |
| GET | /api/articles/{slug} | 單篇文章 |
| POST | /api/articles | 新增文章 |
| PUT | /api/articles/{slug} | 更新文章 |
| DELETE | /api/articles/{slug} | 刪除文章 |

## 環境變數

- `DATABASE_URL`（後端）：預設 `sqlite:///./wiki.db`，正式環境用 `postgresql+psycopg://...`
- `CORS_ORIGINS`（後端）：預設 `http://localhost:3000`
- `NEXT_PUBLIC_API_BASE`（前端）：預設 `http://localhost:8000`
