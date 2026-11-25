import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveCheckoutDestination } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const marketSchema = z.enum(["india", "international"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawMarket = searchParams.get("market");
  const format = searchParams.get("format");

  const parsedMarket = marketSchema.safeParse(rawMarket);
  if (!parsedMarket.success) {
    return NextResponse.json(
      { error: "Invalid market parameter. Expected 'india' or 'international'." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const destination = await resolveCheckoutDestination(parsedMarket.data);

  if (format === "json" || request.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json(destination, {
      status: destination.configured ? 200 : 503,
      headers: { "Cache-Control": "no-store" }
    });
  }

  if (destination.configured && destination.url) {
    return NextResponse.redirect(destination.url, {
      status: 302,
      headers: { "Cache-Control": "no-store" }
    });
  }

  const fallbackUrl = new URL("/", request.url);
  fallbackUrl.searchParams.set("checkout", "pending");
  fallbackUrl.searchParams.set("market", parsedMarket.data);
  fallbackUrl.hash = "pricing";
  return NextResponse.redirect(fallbackUrl, {
    status: 302,
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { market?: unknown };
    const parsedMarket = marketSchema.safeParse(body?.market);
    if (!parsedMarket.success) {
      return NextResponse.json(
        { error: "Invalid market. Expected 'india' or 'international'." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const destination = await resolveCheckoutDestination(parsedMarket.data);
    return NextResponse.json(destination, {
      status: 200,
      headers: { "Cache-Control": "no-store" }
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }
}
