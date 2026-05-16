"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  const { url, publicKey } = requireSupabaseEnv();
  return createBrowserClient(url, publicKey);
}
