"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, updateArticle, type Article, type ArticleInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/markdown-editor";

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleInput>({
    title: article?.title ?? "",
    summary: article?.summary ?? "",
    category: article?.category ?? "",
    tags: article?.tags ?? "",
    content: article?.content ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof ArticleInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const saved = article
        ? await updateArticle(article.slug, form)
        : await createArticle(form);
      router.push(`/articles/${saved.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input required placeholder="標題" value={form.title} onChange={set("title")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          placeholder="分類（如 Frontend、Backend、Integration）"
          value={form.category}
          onChange={set("category")}
        />
        <Input placeholder="標籤（逗號分隔，如 python,fastapi）" value={form.tags} onChange={set("tags")} />
      </div>

      <Input placeholder="摘要" value={form.summary} onChange={set("summary")} />

      <MarkdownEditor
        value={form.content}
        onChange={(content) => setForm((f) => ({ ...f, content }))}
        placeholder="# 開始寫作…"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "儲存中…" : article ? "更新文章" : "發佈文章"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          取消
        </Button>
      </div>
    </form>
  );
}
