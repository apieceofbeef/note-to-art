// Supabase supports two public-key var names:
// - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (new, preferred)
// - NEXT_PUBLIC_SUPABASE_ANON_KEY        (legacy, kept for compatibility)
// We accept either; the new one wins if both are set.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_PUBLIC_KEY.length > 0;

export function requireSupabaseEnv() {
  if (!SUPABASE_URL) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL in your environment.",
    );
  }
  if (!SUPABASE_PUBLIC_KEY) {
    throw new Error("Missing Supabase public key");
  }
  return { url: SUPABASE_URL, publicKey: SUPABASE_PUBLIC_KEY };
}
