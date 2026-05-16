import { NextResponse } from "next/server";
import OpenAI from "openai";
import { isVibe, type Vibe } from "@/lib/vibes";
import type { StudySheet } from "@/lib/types";

export const runtime = "nodejs";

const MAX_NOTES_LENGTH = 8000;

const vibeFlavor: Record<Vibe, string> = {
  "dark-academia":
    "Use a thoughtful, slightly literary tone reminiscent of an Oxford humanities professor.",
  minimal:
    "Use a crisp, precise tone. Short sentences. Zero filler.",
  cyberpunk:
    "Use a punchy, futuristic tone with subtle tech slang. Keep it readable.",
};

function buildPrompt(notes: string, vibe: Vibe) {
  return [
    "You turn raw study notes into a structured study sheet.",
    vibeFlavor[vibe],
    "Return ONLY valid JSON matching exactly this shape:",
    '{"title": string, "summary": string, "bullet_points": string[], "flashcards": [{"question": string, "answer": string}]}',
    "Constraints:",
    "- title: <= 8 words",
    "- summary: 1-3 sentences",
    "- bullet_points: 4-8 concise, high-signal points",
    "- flashcards: 4-6 useful Q/A pairs grounded in the notes",
    "- No markdown, no code fences, no extra keys.",
    "",
    "Notes:",
    notes,
  ].join("\n");
}

function coerceStudySheet(raw: unknown): StudySheet | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const title = typeof obj.title === "string" ? obj.title : "";
  const summary = typeof obj.summary === "string" ? obj.summary : "";
  const bullets = Array.isArray(obj.bullet_points)
    ? obj.bullet_points.filter((b): b is string => typeof b === "string")
    : [];
  const flashRaw = Array.isArray(obj.flashcards) ? obj.flashcards : [];
  const flashcards = flashRaw
    .map((f) => {
      if (!f || typeof f !== "object") return null;
      const fo = f as Record<string, unknown>;
      const question = typeof fo.question === "string" ? fo.question : "";
      const answer = typeof fo.answer === "string" ? fo.answer : "";
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((f): f is { question: string; answer: string } => f !== null);

  if (!title && !summary && bullets.length === 0 && flashcards.length === 0) {
    return null;
  }

  return { title, summary, bullet_points: bullets, flashcards };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { notes, vibe } = (body ?? {}) as { notes?: unknown; vibe?: unknown };

  if (typeof notes !== "string" || notes.trim().length < 20) {
    return NextResponse.json(
      { error: "Please provide at least ~20 characters of notes." },
      { status: 400 },
    );
  }
  if (!isVibe(vibe)) {
    return NextResponse.json(
      { error: "Unknown vibe." },
      { status: 400 },
    );
  }

  const trimmedNotes = notes.slice(0, MAX_NOTES_LENGTH);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENAI_API_KEY is not configured on the server. See .env.example.",
      },
      { status: 500 },
    );
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.5,
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a study assistant that outputs strictly valid JSON.",
        },
        {
          role: "user",
          content: buildPrompt(trimmedNotes, vibe),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON. Try again." },
        { status: 502 },
      );
    }

    const sheet = coerceStudySheet(parsed);
    if (!sheet) {
      return NextResponse.json(
        { error: "Model response was missing required fields." },
        { status: 502 },
      );
    }

    return NextResponse.json({ sheet, vibe });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error calling OpenAI.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
