"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input name="q" placeholder="搜尋文章…" defaultValue={searchParams.get("q") ?? ""} />
      <Button type="submit" variant="secondary">
        <Search className="h-4 w-4" />
        搜尋
      </Button>
    </form>
  );
}
