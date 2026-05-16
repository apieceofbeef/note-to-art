export type Vibe = "dark-academia" | "minimal" | "cyberpunk";

export const VIBES: { id: Vibe; label: string; description: string }[] = [
  {
    id: "dark-academia",
    label: "Dark academia",
    description: "Warm parchment, serif type, library energy.",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean black & white, generous whitespace.",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    description: "Neon accents on black, monospaced edges.",
  },
];

export const isVibe = (v: unknown): v is Vibe =>
  typeof v === "string" && VIBES.some((vibe) => vibe.id === v);

export type VibeTheme = {
  page: string;
  sheet: string;
  title: string;
  subtitle: string;
  sectionHeading: string;
  summary: string;
  bullet: string;
  bulletMarker: string;
  flashcardWrapper: string;
  flashcardQuestion: string;
  flashcardAnswer: string;
  divider: string;
  badge: string;
};

export const VIBE_THEMES: Record<Vibe, VibeTheme> = {
  "dark-academia": {
    page: "bg-[#f3ead8] text-[#2a1d10]",
    sheet:
      "font-serif bg-[#f8f1df] border border-[#3a2a18]/20 shadow-[0_15px_40px_-20px_rgba(58,42,24,0.45)] rounded-md",
    title: "font-serif text-4xl md:text-5xl tracking-tight text-[#2a1d10]",
    subtitle: "font-serif italic text-[#5a3f25]",
    sectionHeading:
      "font-serif uppercase tracking-[0.25em] text-xs text-[#5a3f25]",
    summary: "font-serif text-lg leading-relaxed text-[#2a1d10]",
    bullet: "font-serif text-[#2a1d10] leading-relaxed",
    bulletMarker: "text-[#7a4a20]",
    flashcardWrapper:
      "border border-[#3a2a18]/25 bg-[#fdf6e3] rounded-md p-5",
    flashcardQuestion: "font-serif font-semibold text-[#2a1d10]",
    flashcardAnswer: "font-serif italic text-[#5a3f25] leading-relaxed",
    divider: "border-[#3a2a18]/20",
    badge:
      "border-[#3a2a18]/30 text-[#5a3f25] bg-[#f3ead8] font-serif tracking-widest uppercase text-xs",
  },
  minimal: {
    page: "bg-white text-black",
    sheet:
      "font-sans bg-white border border-black/10 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] rounded-xl",
    title:
      "font-sans text-4xl md:text-5xl font-semibold tracking-tight text-black",
    subtitle: "font-sans text-neutral-500",
    sectionHeading:
      "font-sans uppercase tracking-[0.2em] text-[10px] text-neutral-500",
    summary: "font-sans text-lg leading-relaxed text-neutral-800",
    bullet: "font-sans text-neutral-800 leading-relaxed",
    bulletMarker: "text-black",
    flashcardWrapper: "border border-black/10 bg-neutral-50 rounded-xl p-5",
    flashcardQuestion: "font-sans font-semibold text-black",
    flashcardAnswer: "font-sans text-neutral-600 leading-relaxed",
    divider: "border-black/10",
    badge:
      "border-black/20 text-black bg-white font-sans tracking-widest uppercase text-[10px]",
  },
  cyberpunk: {
    page: "bg-black text-fuchsia-100",
    sheet:
      "font-mono bg-[#0a0014] border border-fuchsia-500/40 shadow-[0_0_30px_-5px_rgba(217,70,239,0.45)] rounded-md",
    title:
      "font-mono text-3xl md:text-4xl font-bold tracking-tight text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]",
    subtitle: "font-mono text-fuchsia-300",
    sectionHeading:
      "font-mono uppercase tracking-[0.3em] text-xs text-fuchsia-400",
    summary: "font-mono text-sm leading-relaxed text-fuchsia-100",
    bullet: "font-mono text-sm text-fuchsia-100 leading-relaxed",
    bulletMarker: "text-cyan-300",
    flashcardWrapper:
      "border border-cyan-400/40 bg-black/40 rounded-md p-5 shadow-[0_0_15px_-5px_rgba(34,211,238,0.5)]",
    flashcardQuestion: "font-mono font-bold text-cyan-300",
    flashcardAnswer: "font-mono text-fuchsia-200 leading-relaxed",
    divider: "border-fuchsia-500/30",
    badge:
      "border-cyan-400/50 text-cyan-300 bg-black font-mono tracking-widest uppercase text-[10px]",
  },
};
