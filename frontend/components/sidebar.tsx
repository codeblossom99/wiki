"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Folder, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryCount } from "@/lib/api";

export function Sidebar({ categories }: { categories: CategoryCount[] }) {
  const active = useSearchParams().get("category");

  const linkClass = (isActive: boolean) =>
    cn(
      "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
      isActive
        ? "bg-secondary font-medium text-secondary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  return (
    <nav className="space-y-1">
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        分類
      </p>
      <Link href="/" className={linkClass(!active)}>
        <span className="flex items-center gap-2">
          <Layers className="h-4 w-4" /> 全部文章
        </span>
      </Link>
      {categories.map((c) => (
        <Link
          key={c.name}
          href={`/?category=${encodeURIComponent(c.name)}`}
          className={linkClass(active === c.name)}
        >
          <span className="flex items-center gap-2">
            <Folder className="h-4 w-4" /> {c.name}
          </span>
          <span className="text-xs text-muted-foreground">{c.count}</span>
        </Link>
      ))}
    </nav>
  );
}
