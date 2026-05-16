"use client";

import { VIBE_THEMES, type Vibe } from "@/lib/vibes";
import type { StudySheet } from "@/lib/types";

type Props = {
  sheet: StudySheet;
  vibe: Vibe;
};

export function StudySheetView({ sheet, vibe }: Props) {
  const theme = VIBE_THEMES[vibe];
  return (
    <article
      className={`print-sheet animate-fade-in-up w-full p-8 md:p-12 ${theme.sheet}`}
    >
      <header className="mb-8">
        <div className={`inline-block px-3 py-1 border ${theme.badge}`}>
          Study Sheet
        </div>
        <h2 className={`mt-4 ${theme.title}`}>{sheet.title || "Untitled"}</h2>
        {sheet.summary && (
          <p className={`mt-4 ${theme.summary}`}>{sheet.summary}</p>
        )}
      </header>

      {sheet.bullet_points.length > 0 && (
        <section className="mb-10">
          <h3 className={`mb-4 ${theme.sectionHeading}`}>Key Points</h3>
          <ul className="space-y-3">
            {sheet.bullet_points.map((point, i) => (
              <li key={i} className="flex gap-3">
                <span className={`mt-1 select-none ${theme.bulletMarker}`}>
                  &#9670;
                </span>
                <span className={theme.bullet}>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {sheet.flashcards.length > 0 && (
        <section>
          <h3 className={`mb-4 ${theme.sectionHeading}`}>Flashcards</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {sheet.flashcards.map((card, i) => (
              <div key={i} className={theme.flashcardWrapper}>
                <p className={theme.flashcardQuestion}>Q. {card.question}</p>
                <p className={`mt-2 ${theme.flashcardAnswer}`}>
                  A. {card.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
