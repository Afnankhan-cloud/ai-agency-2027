import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  getPublicEnv,
  getServerEnv,
  isSupabaseAdminConfigured,
  isSupabasePublicConfigured
} from "@/lib/env";

export function createSupabaseServerClient(): SupabaseClient | null {
  if (!isSupabasePublicConfigured()) {
    return null;
  }

  const publicEnv = getPublicEnv();
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  const cookieStore = cookies();

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Setting cookies inside a Server Component render is ignored;
            // middleware handles session token refresh cookies.
          }
        }
      }
    }
  );
}

/**
 * Server-only privileged Supabase client using the service role key.
 * Never import or invoke this in client components or expose its key.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("createSupabaseAdminClient() cannot run in a browser context.");
  }

  if (!isSupabaseAdminConfigured()) {
    return null;
  }

  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
