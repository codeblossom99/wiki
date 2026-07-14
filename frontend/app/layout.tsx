import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tera's Tech Wiki",
  description: "個人技術文章與筆記",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen antialiased">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 max-w-4xl items-center gap-2 px-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <Link href="/" className="font-semibold">
              Tera&apos;s Tech Wiki
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
