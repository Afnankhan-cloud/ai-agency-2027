"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Lock, LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface AdminLoginFormProps {
  supabaseConfigured: boolean;
  initialError?: string;
}

export function AdminLoginForm({
  supabaseConfigured,
  initialError
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    if (initialError === "unauthorized") {
      return "Your signed-in account does not match the configured ADMIN_EMAIL.";
    }
    if (initialError === "config") {
      return "Supabase authentication environment variables are not configured yet.";
    }
    return null;
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!supabaseConfigured) {
      setErrorMessage(
        "Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first."
      );
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage("Supabase browser client is unavailable.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        setErrorMessage(error.message);
        setSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Unable to sign in right now. Please try again.");
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setErrorMessage(null);
    router.refresh();
  };

  return (
    <div className="glass-panel w-full max-w-md rounded-3xl p-7 shadow-glass sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/15 text-violet-300">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Admin Sign In
          </h1>
          <p className="text-xs text-slate-400">
            Authorized Vertex Digitals administrator access only
          </p>
        </div>
      </div>

      {!supabaseConfigured ? (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-200"
        >
          Supabase credentials are not configured yet. Add{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          ,{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          ,{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">
            SUPABASE_SERVICE_ROLE_KEY
          </code>
          , and{" "}
          <code className="rounded bg-black/40 px-1 py-0.5 font-mono">
            ADMIN_EMAIL
          </code>{" "}
          to <code className="rounded bg-black/40 px-1 py-0.5 font-mono">.env.local</code>.
        </div>
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3.5 text-xs leading-relaxed text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden="true" />
          <div className="flex-1">
            <p>{errorMessage}</p>
            {initialError === "unauthorized" ? (
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="mt-2 inline-flex items-center gap-1.5 font-medium text-white underline underline-offset-2 hover:text-cyan-200"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Sign out current session
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="block text-xs font-medium uppercase tracking-wider text-slate-300"
          >
            Admin Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@domain.com"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070b14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="block text-xs font-medium uppercase tracking-wider text-slate-300"
          >
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Supabase Auth password"
            className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#070b14] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !supabaseConfigured}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Verifying Session...</span>
            </>
          ) : (
            <span>Sign In to Dashboard</span>
          )}
        </button>
      </form>
    </div>
  );
}
