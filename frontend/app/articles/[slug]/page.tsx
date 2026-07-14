import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getArticle } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ArticleActions } from "@/components/article-actions";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> 回文章列表
        </Link>
        <ArticleActions slug={article.slug} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
        <p className="text-sm text-muted-foreground">
          最後更新：{new Date(article.updated_at).toLocaleDateString("zh-TW")}
        </p>
        {article.tags && (
          <div className="flex flex-wrap gap-2">
            {article.tags.split(",").filter(Boolean).map((t) => (
              <Badge key={t}>{t.trim()}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
