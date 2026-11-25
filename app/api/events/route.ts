import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const eventSchema = z.object({
  event_name: z.enum(["page_view", "cta_click", "checkout_start"]),
  session_id: z
    .string()
    .min(8)
    .max(128)
    .regex(/^[a-zA-Z0-9_-]+$/),
  path: z.string().min(1).max(200).default("/"),
  market: z.enum(["india", "international"]).optional(),
  cta_location: z.string().min(1).max(64).optional(),
  referrer_domain: z.string().min(1).max(120).optional()
});

export async function POST(request: Request) {
  try {
    const rawText = await request.text();
    if (!rawText || rawText.length > 4096) {
      return NextResponse.json({ error: "Invalid event payload size" }, { status: 400 });
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validated = eventSchema.safeParse(parsedJson);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid analytics event schema" },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdminClient();
    if (!admin) {
      return NextResponse.json(
        { ok: true, persisted: false },
        { status: 202, headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = validated.data;

    // Never read or persist IP addresses or fingerprinting headers.
    const { error } = await admin.from("analytics_events").insert({
      event_name: data.event_name,
      session_id: data.session_id,
      path: data.path,
      market: data.market ?? null,
      cta_location: data.cta_location ?? null,
      referrer_domain: data.referrer_domain ?? null
    });

    if (error) {
      // Unique partial index prevents duplicate page_view rows for the same session.
      if (error.code === "23505" && data.event_name === "page_view") {
        return NextResponse.json(
          { ok: true, deduplicated: true },
          { status: 200, headers: { "Cache-Control": "no-store" } }
        );
      }

      console.error("Failed to store analytics event:", error.message);
      return NextResponse.json({ error: "Failed to persist event" }, { status: 500 });
    }

    return NextResponse.json(
      { ok: true, persisted: true },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Unexpected analytics route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
