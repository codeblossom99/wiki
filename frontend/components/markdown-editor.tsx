"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Code,
  Heading,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  ListTodo,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type Action =
  | { type: "wrap"; before: string; after: string; placeholder: string }
  | { type: "linePrefix"; prefix: string | ((i: number) => string) };

const actions: { icon: React.ElementType; label: string; action: Action }[] = [
  { icon: Heading, label: "標題", action: { type: "linePrefix", prefix: "### " } },
  { icon: Bold, label: "粗體", action: { type: "wrap", before: "**", after: "**", placeholder: "粗體文字" } },
  { icon: Italic, label: "斜體", action: { type: "wrap", before: "_", after: "_", placeholder: "斜體文字" } },
  { icon: Quote, label: "引用", action: { type: "linePrefix", prefix: "> " } },
  { icon: Code, label: "程式碼", action: { type: "wrap", before: "`", after: "`", placeholder: "code" } },
  { icon: LinkIcon, label: "連結", action: { type: "wrap", before: "[", after: "](url)", placeholder: "連結文字" } },
  { icon: ListOrdered, label: "編號清單", action: { type: "linePrefix", prefix: (i) => `${i + 1}. ` } },
  { icon: List, label: "項目清單", action: { type: "linePrefix", prefix: "- " } },
  { icon: ListTodo, label: "任務清單", action: { type: "linePrefix", prefix: "- [ ] " } },
];

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(action: Action) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);
    let next: string;
    let cursorStart: number;
    let cursorEnd: number;

    if (action.type === "wrap") {
      const text = selected || action.placeholder;
      next = value.slice(0, start) + action.before + text + action.after + value.slice(end);
      cursorStart = start + action.before.length;
      cursorEnd = cursorStart + text.length;
    } else {
      // 展開選取範圍到整行
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const lineEndIdx = value.indexOf("\n", end);
      const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
      const lines = value.slice(lineStart, lineEnd).split("\n");
      const prefixed = lines
        .map((line, i) => {
          const p = typeof action.prefix === "function" ? action.prefix(i) : action.prefix;
          return p + line;
        })
        .join("\n");
      next = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
      cursorStart = lineStart;
      cursorEnd = lineStart + prefixed.length;
    }

    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  const tabClass = (active: boolean) =>
    cn(
      "rounded-t-md border border-b-0 px-4 py-2 text-sm",
      active
        ? "border-border bg-background font-medium"
        : "border-transparent text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-2 pt-2">
        <div className="flex">
          <button type="button" className={tabClass(tab === "write")} onClick={() => setTab("write")}>
            Write
          </button>
          <button type="button" className={tabClass(tab === "preview")} onClick={() => setTab("preview")}>
            Preview
          </button>
        </div>
        {tab === "write" && (
          <div className="flex flex-wrap items-center gap-0.5 pb-1">
            {actions.map(({ icon: Icon, label, action }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="sm"
                title={label}
                className="h-7 w-7 p-0 text-muted-foreground"
                onClick={() => apply(action)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </div>

      {tab === "write" ? (
        <Textarea
          ref={ref}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[300px] rounded-none border-0 font-mono shadow-none focus-visible:ring-0"
        />
      ) : (
        <div className="prose prose-neutral min-h-[300px] max-w-none p-4 dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "*（沒有內容）*"}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
