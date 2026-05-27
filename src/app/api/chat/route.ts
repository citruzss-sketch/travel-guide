import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCity, buildCitySystemPrompt } from "@/lib/content";
import type { AIMode, PlaceContext, TravelProfile } from "@/lib/ai-modes";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    messages,
    countrySlug,
    citySlug,
    locale,
    mode,
    profile,
    placeContext,
  } = body as {
    messages: ChatMessage[];
    countrySlug: string;
    citySlug: string;
    locale: string;
    mode?: AIMode;
    profile?: TravelProfile;
    placeContext?: PlaceContext;
  };

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

  let streamResult: Awaited<ReturnType<ReturnType<typeof model.startChat>["sendMessageStream"]>>;
  try {
    const chat = model.startChat({ history });
    streamResult = await chat.sendMessageStream(lastMessage.content);
  } catch {
    return new Response(
      JSON.stringify({ error: "model_unavailable" }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of streamResult.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch {
        controller.enqueue(
          encoder.encode("Sorry, something went wrong. Please try again.")
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
