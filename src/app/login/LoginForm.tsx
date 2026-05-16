"use client";

import { useActionState } from "react";
import { sendMagicLinkAction, type SendMagicLinkResult } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<
    SendMagicLinkResult | null,
    FormData
  >(sendMagicLinkAction, null);

  if (state?.ok) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
        Magic link sent to <span className="font-medium">{state.email}</span>.
        Open the email on this device and click the link to finish signing in.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {pending ? "Sending..." : "Send magic link"}
      </button>
      {state && !state.ok && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}
      <p className="text-xs text-neutral-500">
        We&rsquo;ll email you a one-time sign-in link. No passwords.
      </p>
    </form>
  );
}
