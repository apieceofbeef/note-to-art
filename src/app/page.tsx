"use client";

import { useState } from "react";
import { VIBES, VIBE_THEMES, type Vibe } from "@/lib/vibes";
import type { StudySheet } from "@/lib/types";
import { StudySheetView } from "@/components/StudySheetView";

const SAMPLE_NOTES = `Photosynthesis happens in chloroplasts. Light reactions occur in the thylakoid membrane and produce ATP and NADPH. The Calvin cycle takes place in the stroma and fixes CO2 into glucose using those products. Pigments like chlorophyll a and b absorb mainly red and blue light. Net equation: 6 CO2 + 6 H2O + light -> C6H12O6 + 6 O2.`;

export default function Home() {
  const [notes, setNotes] = useState("");
  const [vibe, setVibe] = useState<Vibe>("dark-academia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheet, setSheet] = useState<StudySheet | null>(null);
  const [resultVibe, setResultVibe] = useState<Vibe>("dark-academia");

  const theme = VIBE_THEMES[resultVibe];

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setSheet(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, vibe }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Generation failed.");
      }
      setSheet(data.sheet as StudySheet);
      setResultVibe(data.vibe as Vibe);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        sheet ? theme.page : "bg-neutral-50 text-neutral-900"
      }`}
    >
      <main className="mx-auto w-full max-w-3xl px-6 py-16 md:py-20">
        <section className="no-print">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Note to Art
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">
              Turn your notes into a study sheet.
            </h1>
            <p className="mt-4 text-neutral-600">
              Paste raw notes, pick a vibe, get a clean styled study sheet.
            </p>
          </div>

          <div className="rounded-2xl bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] border border-black/5 p-6 md:p-8 space-y-5">
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Your notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste lecture notes, a chapter summary, anything..."
                rows={10}
                className="w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition"
              />
              <div className="mt-1 flex justify-between text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={() => setNotes(SAMPLE_NOTES)}
                  className="underline hover:text-neutral-800 transition"
                >
                  Use sample notes
                </button>
                <span>{notes.length} chars</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label
                  htmlFor="vibe"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Vibe
                </label>
                <select
                  id="vibe"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value as Vibe)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition"
                >
                  {VIBES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} &mdash; {v.description}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || notes.trim().length < 20}
                className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            )}
          </div>
        </section>

        {loading && (
          <div className="no-print mt-12 flex flex-col items-center gap-3 text-neutral-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
            <p className="text-sm">Composing your study sheet&hellip;</p>
          </div>
        )}

        {sheet && (
          <div className="mt-12">
            <div className="no-print mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                Vibe: {VIBES.find((v) => v.id === resultVibe)?.label}
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50"
              >
                Download as PDF
              </button>
            </div>
            <StudySheetView sheet={sheet} vibe={resultVibe} />
          </div>
        )}

        <footer className="no-print mt-20 text-center text-xs text-neutral-400">
          Built with Next.js, Tailwind, and OpenAI.
        </footer>
      </main>
    </div>
  );
}
