import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";
import { ArticleForm } from "@/components/article-form";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">編輯文章</h1>
      <ArticleForm article={article} />
    </div>
  );
}
