import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/auth/sign-out/actions";

export async function SiteHeader() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="no-print w-full border-b border-black/5 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-sm font-medium tracking-tight text-neutral-900 hover:text-neutral-700 transition"
        >
          Note to Art
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/history"
                className="text-neutral-700 hover:text-neutral-900 transition"
              >
                History
              </Link>
              <span className="hidden sm:inline text-neutral-400">
                {user.email}
              </span>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-neutral-800 shadow-sm transition hover:bg-neutral-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-white shadow-sm transition hover:bg-neutral-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
