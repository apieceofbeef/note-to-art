-- Note to Art — Supabase schema
--
-- Run this once in your Supabase project's SQL editor (or via `supabase db push`).
-- It creates the `generations` table used by /api/generate and /history,
-- plus row-level security policies so each user can only see their own rows.

create extension if not exists "pgcrypto";

create table if not exists public.generations (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  input_text    text        not null,
  vibe          text        not null,
  title         text        not null default '',
  summary       text        not null default '',
  bullet_points jsonb       not null default '[]'::jsonb,
  flashcards    jsonb       not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists generations_user_id_created_at_idx
  on public.generations (user_id, created_at desc);

alter table public.generations enable row level security;

drop policy if exists "Users read own generations" on public.generations;
create policy "Users read own generations"
  on public.generations
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own generations" on public.generations;
create policy "Users insert own generations"
  on public.generations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own generations" on public.generations;
create policy "Users delete own generations"
  on public.generations
  for delete
  to authenticated
  using (auth.uid() = user_id);
