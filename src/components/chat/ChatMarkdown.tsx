"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MapPin } from "lucide-react";
import type { Components } from "react-markdown";
import { normalizeChatMarkdown } from "@/lib/chat-markdown";

type ChatMarkdownVariant = "assistant" | "user";

interface ChatMarkdownProps {
  content: string;
  variant?: ChatMarkdownVariant;
  compact?: boolean;
}

export function ChatMarkdown({
  content,
  variant = "assistant",
  compact = false,
}: ChatMarkdownProps) {
  const isUser = variant === "user";
  const tight = compact ? "my-1.5 space-y-1" : "my-2.5 space-y-2";

  const components: Components = {
    p: ({ children }) => (
      <p
        className={`last:mb-0 leading-relaxed ${compact ? "mb-1.5 text-xs" : "mb-2.5"} ${isUser ? "text-white" : ""}`}
      >
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className={`font-semibold ${isUser ? "text-white" : "text-foreground"}`}>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className={`italic ${isUser ? "text-white/90" : "text-muted"}`}>{children}</em>
    ),
    ul: ({ children }) => (
      <ul
        className={`ml-1 pl-4 ${tight} ${
          isUser ? "list-disc marker:text-white/70" : "list-disc marker:text-accent"
        }`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={`ml-1 pl-4 ${compact ? "my-1.5 space-y-1.5" : "my-2.5 space-y-3"} ${
          isUser
            ? "list-decimal marker:text-white/80"
            : "list-decimal marker:font-semibold marker:text-accent"
        }`}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li
        className={`leading-relaxed ${compact ? "text-xs" : ""} ${isUser ? "text-white/95" : "text-muted"}`}
      >
        {children}
      </li>
    ),
    a: ({ href, children }) => {
      const isMaps =
        href?.includes("google.com/maps/place") ||
        href?.includes("google.com/maps/@");
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 underline underline-offset-2 transition-opacity hover:opacity-80 ${
            isMaps
              ? isUser
                ? "rounded-md bg-white/15 px-2 py-0.5 font-semibold text-white no-underline"
                : "rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-semibold text-accent no-underline hover:bg-accent/15"
              : isUser
                ? "text-white"
                : "text-accent"
          }`}
        >
          {isMaps && <MapPin className="h-3.5 w-3.5 shrink-0" />}
          {children}
        </a>
      );
    },
    h3: ({ children }) => (
      <h3
        className={`mb-2 mt-3 font-display text-sm font-bold first:mt-0 ${
          isUser ? "text-white" : "text-foreground"
        }`}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={`mb-1.5 mt-2.5 text-sm font-semibold first:mt-0 ${
          isUser ? "text-white" : "text-foreground"
        }`}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={`my-2.5 border-l-2 py-0.5 pl-3 italic ${
          isUser ? "border-white/40 text-white/85" : "border-accent/50 text-muted"
        }`}
      >
        {children}
      </blockquote>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <code
            className={`my-2 block overflow-x-auto rounded-lg px-3 py-2 text-xs ${
              isUser ? "bg-white/15 text-white" : "bg-background text-foreground"
            }`}
          >
            {children}
          </code>
        );
      }
      return (
        <code
          className={`rounded px-1.5 py-0.5 text-[0.85em] ${
            isUser ? "bg-white/20 text-white" : "bg-background text-accent"
          }`}
        >
          {children}
        </code>
      );
    },
    hr: () => (
      <hr className={`my-3 border-t ${isUser ? "border-white/20" : "border-border"}`} />
    ),
  };

  const normalized = normalizeChatMarkdown(content);

  return (
    <div className={`chat-markdown ${compact ? "text-xs" : "text-sm"}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
