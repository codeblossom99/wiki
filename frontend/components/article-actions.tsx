"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteArticle } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function ArticleActions({ slug }: { slug: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("確定要刪除這篇文章嗎？")) return;
    await deleteArticle(slug);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild={false}>
        <Link href={`/articles/${slug}/edit`} className="flex items-center gap-1">
          <Pencil className="h-3.5 w-3.5" /> 編輯
        </Link>
      </Button>
      <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600">
        <Trash2 className="h-3.5 w-3.5" /> 刪除
      </Button>
    </div>
  );
}
