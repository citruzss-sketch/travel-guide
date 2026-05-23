"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { normalizeChatMarkdown } from "@/lib/chat-markdown";

type ChatMarkdownVariant = "assistant" | "user";

interface ChatMarkdownProps {
  content: string;
  variant?: ChatMarkdownVariant;
}

export function ChatMarkdown({
  content,
  variant = "assistant",
}: ChatMarkdownProps) {
  const isUser = variant === "user";

  const components: Components = {
    p: ({ children }) => (
      <p className={`mb-2.5 last:mb-0 leading-relaxed ${isUser ? "text-white" : ""}`}>
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
        className={`my-2.5 ml-1 space-y-2 pl-4 ${
          isUser ? "list-disc marker:text-white/70" : "list-disc marker:text-accent"
        }`}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        className={`my-2.5 ml-1 space-y-3 pl-4 ${
          isUser
            ? "list-decimal marker:text-white/80"
            : "list-decimal marker:font-semibold marker:text-accent"
        }`}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className={`leading-relaxed ${isUser ? "text-white/95" : "text-foreground/95"}`}>
        {children}
      </li>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline underline-offset-2 transition-opacity hover:opacity-80 ${
          isUser ? "text-white" : "text-accent"
        }`}
      >
        {children}
      </a>
    ),
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
    <div className="chat-markdown text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
