const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string;
  updated_at: string;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface Article extends ArticleListItem {
  content: string;
  created_at: string;
}

export async function listCategories(): Promise<CategoryCount[]> {
  const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list categories: ${res.status}`);
  return res.json();
}

export async function listArticles(params?: {
  q?: string;
  tag?: string;
  category?: string;
}): Promise<ArticleListItem[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.category) qs.set("category", params.category);
  const res = await fetch(`${API_BASE}/api/articles?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list articles: ${res.status}`);
  return res.json();
}

export interface ArticleInput {
  title: string;
  summary: string;
  category: string;
  tags: string;
  content: string;
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create article: ${res.status}`);
  return res.json();
}

export async function updateArticle(slug: string, input: Partial<ArticleInput>): Promise<Article> {
  const res = await fetch(`${API_BASE}/api/articles/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to update article: ${res.status}`);
  return res.json();
}

export async function deleteArticle(slug: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/articles/${slug}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Failed to delete article: ${res.status}`);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${API_BASE}/api/articles/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to get article: ${res.status}`);
  return res.json();
}
