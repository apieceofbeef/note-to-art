import Link from "next/link";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Sign in — Note to Art",
};

export default async function LoginPage() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/history");
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-16 md:py-24">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Note to Art
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          Sign in
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          Save your generated study sheets to your history.
        </p>
      </div>

      <div className="mt-10 rounded-2xl bg-white shadow-[0_10px_40px_-20px_rgba(0,0,0,0.2)] border border-black/5 p-6 md:p-8">
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Supabase is not configured. Set{" "}
            <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and
            either{" "}
            <code className="font-mono">
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            </code>{" "}
            or <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            in your environment to enable login.
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900">
          &larr; Back to generator
        </Link>
      </p>
    </main>
  );
}
