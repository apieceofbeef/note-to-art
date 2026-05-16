import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VIBES, isVibe, type Vibe } from "@/lib/vibes";
import type { GenerationListItem } from "@/lib/types";

export const metadata = {
  title: "History — Note to Art",
};

export const dynamic = "force-dynamic";

function vibeLabel(vibe: Vibe): string {
  return VIBES.find((v) => v.id === vibe)?.label ?? vibe;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  if (!isSupabaseConfigured) {
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rows, error } = await supabase
    .from("generations")
    .select("id,title,vibe,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const items: GenerationListItem[] = (rows ?? []).map((r) => ({
    id: String(r.id),
    title: typeof r.title === "string" ? r.title : "",
    vibe: isVibe(r.vibe) ? r.vibe : "minimal",
    created_at:
      typeof r.created_at === "string"
        ? r.created_at
        : new Date().toISOString(),
  }));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Your history
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            Saved study sheets
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
        >
          New sheet
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load history: {error.message}
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
          <p className="text-neutral-600">No saved sheets yet.</p>
          <p className="mt-1 text-sm text-neutral-500">
            Generate a study sheet on the home page and it will appear here.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <ul className="divide-y divide-neutral-200 rounded-2xl border border-black/5 bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/history/${item.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-neutral-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-900">
                    {item.title || "Untitled"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {vibeLabel(item.vibe)} &middot; {formatDate(item.created_at)}
                  </p>
                </div>
                <span className="text-neutral-400">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
