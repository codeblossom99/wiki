import { Suspense } from "react";
import Link from "next/link";
import { listArticles } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search-bar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;

  let articles: Awaited<ReturnType<typeof listArticles>> = [];
  let apiError = false;
  try {
    articles = await listArticles({ q, tag });
  } catch {
    apiError = true;
  }

  return (
    <div className="space-y-6">
      <Suspense>
        <SearchBar />
      </Suspense>

      {apiError && (
        <p className="text-sm text-muted-foreground">
          無法連線到 API，請確認後端已啟動（uvicorn app.main:app --reload）。
        </p>
      )}

      {!apiError && articles.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {q || tag ? "找不到符合的文章。" : "還沒有文章，用 API 新增第一篇吧。"}
        </p>
      )}

      <div className="grid gap-4">
        {articles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                {a.summary && <CardDescription>{a.summary}</CardDescription>}
              </CardHeader>
              {a.tags && (
                <CardContent className="flex flex-wrap gap-2">
                  {a.tags.split(",").filter(Boolean).map((t) => (
                    <Badge key={t}>{t.trim()}</Badge>
                  ))}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
