# Note to Art

Paste your raw study notes, pick a vibe (dark academia, minimal, cyberpunk), and get back a clean, aesthetic, styled study sheet — title, summary, key points, and flashcards — all rendered with Tailwind and printable to PDF.

Built with **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, and the **OpenAI API**. No database, no auth.

## Quick start

### 1. Clone & install

```bash
git clone https://github.com/apieceofbeef/note-to-art.git
cd note-to-art
npm install
```

### 2. Add your OpenAI API key

Copy the example env file and fill in your key from
[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys):

```bash
cp .env.example .env.local
# then edit .env.local and set OPENAI_API_KEY=sk-...
```

By default the app uses `gpt-4o-mini` (cheap and fast). You can override with
`OPENAI_MODEL` in `.env.local`.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste some notes, pick a
vibe, and hit **Generate**. Use the **Download as PDF** button on the result
to print/save the sheet.

## How it works

- `src/app/page.tsx` — homepage with the textarea, vibe dropdown, Generate
  button, loading state, error state, and the result view.
- `src/app/api/generate/route.ts` — server route that takes
  `{ notes, vibe }`, calls OpenAI with a short prompt and a 700-token cap,
  asks for `response_format: json_object`, validates the response, and
  returns `{ title, summary, bullet_points, flashcards }`.
- `src/components/StudySheetView.tsx` — renders the structured response.
- `src/lib/vibes.ts` — per-vibe Tailwind theme tables (serif/warm,
  minimal black & white, neon mono).

## Scripts

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the Next.js dev server       |
| `npm run build` | Production build                   |
| `npm run start` | Serve the production build         |
| `npm run lint`  | ESLint                             |

## Cost notes

- Model defaults to `gpt-4o-mini`.
- `max_tokens = 700`, notes truncated to ~8k chars server-side.
- Prompt is short and JSON-only — no images, no chain-of-thought.
