import { ArticleForm } from "@/components/article-form";

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">新增文章</h1>
      <ArticleForm />
    </div>
  );
}
