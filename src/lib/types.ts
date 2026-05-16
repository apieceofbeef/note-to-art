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
