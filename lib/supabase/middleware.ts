import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv, getServerEnv, isSupabasePublicConfigured } from "@/lib/env";

export async function updateAdminSession(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  let response = NextResponse.next({
    request
  });

  if (!isSupabasePublicConfigured()) {
    if (!isLoginRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "config");
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const configuredAdminEmail = serverEnv.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  const isAuthorizedAdmin = Boolean(
    configuredAdminEmail && userEmail && userEmail === configuredAdminEmail
  );

  if (isLoginRoute) {
    if (isAuthorizedAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (!configuredAdminEmail || !isAuthorizedAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
