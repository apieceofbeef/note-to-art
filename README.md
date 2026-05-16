# Note to Art

Paste your raw study notes, pick a vibe (dark academia, minimal, cyberpunk), and get back a clean, aesthetic, styled study sheet — title, summary, key points, and flashcards — all rendered with Tailwind and printable to PDF. Sign in with a magic link to save every generation to your private history.

Built with **Next.js (App Router)**, **TypeScript**, **TailwindCSS**, the **OpenAI API**, and **Supabase** (auth + database).

## Quick start

### 1. Clone & install

```bash
git clone https://github.com/apieceofbeef/note-to-art.git
cd note-to-art
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (free tier is fine).
2. In the Supabase dashboard, open **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates the `generations` table and row-level-security policies.
3. Open **Authentication → URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` for local dev (and your production URL once deployed).
   - Add `http://localhost:3000/auth/callback` (and your production `/auth/callback`) under **Redirect URLs**.
4. Open **Settings → API** and grab the **Project URL** and the **anon public** key.

The generator still works without Supabase configured — login and history are simply hidden in that mode.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

| Variable | Required | What it is |
| --- | --- | --- |
| `OPENAI_API_KEY` | yes | OpenAI key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys). |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. |
| `NEXT_PUBLIC_SUPABASE_URL` | for auth/history | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | for auth/history | Your Supabase **anon public** key. |
| `NEXT_PUBLIC_SITE_URL` | recommended in prod | Base URL used for magic-link redirects (e.g. `https://note-to-art.vercel.app`). |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste some notes, pick a
vibe, and hit **Generate**. Click **Login** in the top right to sign in with a
magic link, then visit **/history** to see your saved sheets.

## How it works

- `src/app/page.tsx` — homepage with the textarea, vibe dropdown, Generate
  button, loading state, error state, and the result view.
- `src/app/api/generate/route.ts` — server route that takes `{ notes, vibe }`,
  calls OpenAI with a short prompt and a 700-token cap, validates the response,
  and (when a user is signed in) inserts the result into the `generations` table.
- `src/app/login/`, `src/app/auth/callback/route.ts`, `src/app/auth/sign-out/` —
  magic-link sign-in flow.
- `src/app/history/` — list and detail views of the signed-in user's saved sheets.
- `src/components/SiteHeader.tsx` — top-right Login / History / Sign-out nav.
- `src/middleware.ts` + `src/lib/supabase/*` — Supabase SSR clients and
  session-refresh middleware (uses `@supabase/ssr`).
- `src/lib/vibes.ts` — per-vibe Tailwind theme tables (serif/warm, minimal B&W, neon mono).
- `supabase/schema.sql` — `generations` table + RLS policies.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click **New Project** and import the repo. The Next.js preset is
   detected automatically.
3. Add the env variables from the table above under **Settings → Environment Variables**.
   - Set `NEXT_PUBLIC_SITE_URL` to your final deploy URL (e.g.
     `https://note-to-art.vercel.app`).
4. In Supabase, add your Vercel preview/production URLs under **Authentication →
   URL Configuration** (both **Site URL** and **Redirect URLs** with
   `/auth/callback` appended).
5. Deploy.

No secrets live in the code — everything is read from `process.env`.

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
