import type { Vibe } from "./vibes";

export type Flashcard = {
  question: string;
  answer: string;
};

export type StudySheet = {
  title: string;
  summary: string;
  bullet_points: string[];
  flashcards: Flashcard[];
};

export type GenerationRow = {
  id: string;
  user_id: string;
  input_text: string;
  vibe: Vibe;
  title: string;
  summary: string;
  bullet_points: string[];
  flashcards: Flashcard[];
  created_at: string;
};

export type GenerationListItem = Pick<
  GenerationRow,
  "id" | "title" | "vibe" | "created_at"
>;
