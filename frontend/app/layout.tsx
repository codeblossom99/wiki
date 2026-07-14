import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookOpen, PenLine } from "lucide-react";
import { listCategories, type CategoryCount } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tera's Tech Wiki",
  description: "個人技術文章與筆記",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories: CategoryCount[] = [];
  try {
    categories = await listCategories();
  } catch {
    // API 未啟動時仍可渲染頁面
  }

  return (
    <html lang="zh-Hant">
      <body className="min-h-screen antialiased">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <Link href="/" className="font-semibold">
              Tera&apos;s Tech Wiki
            </Link>
            <Link
              href="/new"
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <PenLine className="h-4 w-4" /> 新增文章
            </Link>
          </div>
        </header>
        <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
          <aside className="hidden w-56 shrink-0 md:block">
            <Suspense>
              <Sidebar categories={categories} />
            </Suspense>
          </aside>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
