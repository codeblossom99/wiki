const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string;
  updated_at: string;
}

export interface Article extends ArticleListItem {
  content: string;
  created_at: string;
}

export async function listArticles(params?: { q?: string; tag?: string }): Promise<ArticleListItem[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.tag) qs.set("tag", params.tag);
  const res = await fetch(`${API_BASE}/api/articles?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to list articles: ${res.status}`);
  return res.json();
}

export async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${API_BASE}/api/articles/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to get article: ${res.status}`);
  return res.json();
}
