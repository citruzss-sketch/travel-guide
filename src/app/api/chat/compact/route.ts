import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildCompactSystemPrompt } from "@/lib/chat-compact";
import { normalizeChatMarkdown } from "@/lib/chat-markdown";

export async function POST(request: Request) {
  const body = await request.json();
  const { text, locale = "ru" }: { text?: string; locale?: string } = body;

  if (!text?.trim()) {
    return Response.json({ error: "missing_text" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  const lang = locale === "en" ? "en" : "ru";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildCompactSystemPrompt(lang),
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048,
    },
  });

  try {
    const userPrompt =
      lang === "ru"
        ? `Сожми этот текст:\n\n${text.trim()}`
        : `Compress this text:\n\n${text.trim()}`;

    const result = await model.generateContent(userPrompt);
    const compact = result.response.text()?.trim();

    if (!compact) {
      return Response.json({ error: "empty_response" }, { status: 502 });
    }

    return Response.json({ text: normalizeChatMarkdown(compact) });
  } catch {
    return Response.json({ error: "generation_failed" }, { status: 500 });
  }
}
