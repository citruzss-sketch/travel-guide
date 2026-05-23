/** Fix common Gemini output where list items run together on one line. */
export function normalizeChatMarkdown(text: string): string {
  return text
    .replace(/(\S)\s+(?=\d+\.\s+\*\*)/g, "$1\n\n")
    .replace(/(\S)\s+(?=\d+\.\s+[A-Za-zА-Яа-я])/g, "$1\n\n")
    .replace(/(\S)\s+(?=-\s+\*\*)/g, "$1\n\n")
    .replace(/(\S)\s+(?=-\s+[A-Za-zА-Яа-я])/g, "$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
