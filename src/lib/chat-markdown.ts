/** Close dangling ** so ReactMarkdown does not swallow the rest of the message. */
function repairUnclosedMarkdown(text: string): string {
  let out = text.trim();
  const boldMarkers = (out.match(/\*\*/g) || []).length;
  if (boldMarkers % 2 !== 0) out += "**";
  return out;
}

/** Fix common Gemini output where list items run together on one line. */
export function normalizeChatMarkdown(text: string): string {
  return repairUnclosedMarkdown(
    text
      .replace(/(\S)\s+(?=\d+\.\s+\*\*)/g, "$1\n\n")
      .replace(/(\S)\s+(?=\d+\.\s+[A-Za-zА-Яа-я])/g, "$1\n\n")
      .replace(/(\S)\s+(?=-\s+\*\*)/g, "$1\n\n")
      .replace(/(\S)\s+(?=-\s+[A-Za-zА-Яа-я])/g, "$1\n\n")
      .replace(/\n{3,}/g, "\n\n")
  );
}

/** Plain text for one-line previews (favorites subtitle, search). */
export function plainTextFromMarkdown(text: string): string {
  let out = text.trim();
  out = out.replace(/\*\*([^*]+)\*\*/g, "$1");
  out = out.replace(/\*([^*\n]+)\*/g, "$1");
  out = out.replace(/_([^_\n]+)_/g, "$1");
  out = out.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  out = out.replace(/^#{1,6}\s+/gm, "");
  out = out.replace(/^[\s]*[-*+]\s+/gm, "• ");
  out = out.replace(/^\d+\.\s+/gm, "");
  out = out.replace(/\*\*/g, "");
  out = out.replace(/\n{3,}/g, "\n\n");
  return out.trim();
}
