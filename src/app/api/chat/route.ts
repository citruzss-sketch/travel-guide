import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCity, buildCitySystemPrompt } from "@/lib/content";
import type { AIMode, PlaceContext, TravelProfile } from "@/lib/ai-modes";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    messages,
    countrySlug,
    citySlug,
    locale,
    mode,
    profile,
    placeContext,
  }: {
    messages: ChatMessage[];
    countrySlug: string;
    citySlug: string;
    locale: string;
    mode?: AIMode;
    profile?: TravelProfile;
    placeContext?: PlaceContext;
  } = body;

  const city = getCity(countrySlug, citySlug);
  if (!city) {
    return new Response("City not found", { status: 404 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "no_api_key" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!messages?.length) {
    return new Response("No messages", { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== "user") {
    return new Response("Last message must be from user", { status: 400 });
  }

  let historyMessages = messages.slice(0, -1);
  while (historyMessages.length > 0 && historyMessages[0].role !== "user") {
    historyMessages = historyMessages.slice(1);
  }

  const systemPrompt = buildCitySystemPrompt(city, locale, {
    mode: mode ?? "guide",
    profile: profile ?? "any",
    placeContext,
  });
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.55,
      topP: 0.9,
    },
  });

  const history = historyMessages.map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });

  let result: Awaited<ReturnType<typeof chat.sendMessageStream>>;
  try {
    result = await chat.sendMessageStream(lastMessage.content);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate");
    return new Response(
      JSON.stringify({ error: isRateLimit ? "rate_limited" : "gemini_unavailable" }),
      {
        status: isRateLimit ? 429 : 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch {
        controller.enqueue(
          encoder.encode("\n\n[AI stream interrupted — please try again.]")
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
