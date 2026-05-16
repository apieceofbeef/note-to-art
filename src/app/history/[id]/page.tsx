import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VIBES, VIBE_THEMES, isVibe, type Vibe } from "@/lib/vibes";
import type { Flashcard, StudySheet } from "@/lib/types";
import { StudySheetView } from "@/components/StudySheetView";

export const dynamic = "force-dynamic";

function coerceStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

function coerceFlashcards(v: unknown): Flashcard[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((f) => {
      if (!f || typeof f !== "object") return null;
      const fo = f as Record<string, unknown>;
      const q = typeof fo.question === "string" ? fo.question : "";
      const a = typeof fo.answer === "string" ? fo.answer : "";
      if (!q || !a) return null;
      return { question: q, answer: a };
    })
    .filter((f): f is Flashcard => f !== null);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type Params = Promise<{ id: string }>;

export default async function HistoryDetailPage({ params }: { params: Params }) {
  if (!isSupabaseConfigured) {
    redirect("/login");
  }

  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("generations")
    .select("id,title,summary,bullet_points,flashcards,vibe,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const vibe: Vibe = isVibe(data.vibe) ? data.vibe : "minimal";
  const sheet: StudySheet = {
    title: typeof data.title === "string" ? data.title : "",
    summary: typeof data.summary === "string" ? data.summary : "",
    bullet_points: coerceStringArray(data.bullet_points),
    flashcards: coerceFlashcards(data.flashcards),
  };

  const theme = VIBE_THEMES[vibe];
  const vibeLabel = VIBES.find((v) => v.id === vibe)?.label ?? vibe;
  const createdAt =
    typeof data.created_at === "string"
      ? formatDate(data.created_at)
      : "";

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${theme.page}`}
    >
      <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
        <div className="no-print mb-6 flex items-center justify-between">
          <Link
            href="/history"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition"
          >
            &larr; History
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              {vibeLabel}
              {createdAt && <> &middot; {createdAt}</>}
            </p>
          </div>
        </div>

        <StudySheetView sheet={sheet} vibe={vibe} />
      </main>
    </div>
  );
}
