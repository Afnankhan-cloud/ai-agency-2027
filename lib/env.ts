import { z } from "zod";

const emptyToUndefined = (val: unknown): unknown => {
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }
  return val;
};

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://localhost:3000")
  ),
  NEXT_PUBLIC_CONTACT_EMAIL: z.preprocess(
    emptyToUndefined,
    z.string().email().default("support@vertexdigitals.example")
  ),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: optionalString
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  ADMIN_EMAIL: optionalEmail,
  LAUNCH_BUYER_LIMIT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().max(10000).default(50)
  ),
  LAUNCH_END_AT: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .refine((val) => !Number.isNaN(Date.parse(val)), {
        message: "LAUNCH_END_AT must be a valid ISO-8601 date string"
      })
      .default("2026-12-20T23:59:59+05:30")
  ),
  USD_TO_INR_RATE: z.preprocess(
    emptyToUndefined,
    z.coerce.number().positive().max(1000).default(85)
  ),
  RAZORPAY_KEY_ID: optionalString,
  RAZORPAY_KEY_SECRET: optionalString,
  RAZORPAY_LAUNCH_CHECKOUT_URL: optionalUrl,
  RAZORPAY_STANDARD_CHECKOUT_URL: optionalUrl,
  RAZORPAY_WEBHOOK_SECRET: optionalString,
  GUMROAD_LAUNCH_CHECKOUT_URL: optionalUrl,
  GUMROAD_STANDARD_CHECKOUT_URL: optionalUrl,
  GUMROAD_WEBHOOK_SECRET: optionalString,
  GUMROAD_SELLER_ID: optionalString,
  DOWNLOAD_SIGNING_SECRET: optionalString,
  ALLOW_TEST_WEBHOOKS: z.preprocess(
    emptyToUndefined,
    z.enum(["true", "false"]).default("false")
  )
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedPublicEnv: PublicEnv | null = null;

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  });

  if (!parsed.success) {
    console.warn("Invalid public environment configuration:", parsed.error.flatten().fieldErrors);
    return {
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_CONTACT_EMAIL: "support@vertexdigitals.example",
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      NEXT_PUBLIC_RAZORPAY_KEY_ID: undefined
    };
  }

  cachedPublicEnv = parsed.data;
  return cachedPublicEnv;
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must never be executed in the browser.");
  }

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    LAUNCH_BUYER_LIMIT: process.env.LAUNCH_BUYER_LIMIT,
    LAUNCH_END_AT: process.env.LAUNCH_END_AT,
    USD_TO_INR_RATE: process.env.USD_TO_INR_RATE,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_LAUNCH_CHECKOUT_URL: process.env.RAZORPAY_LAUNCH_CHECKOUT_URL,
    RAZORPAY_STANDARD_CHECKOUT_URL: process.env.RAZORPAY_STANDARD_CHECKOUT_URL,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    GUMROAD_LAUNCH_CHECKOUT_URL: process.env.GUMROAD_LAUNCH_CHECKOUT_URL,
    GUMROAD_STANDARD_CHECKOUT_URL: process.env.GUMROAD_STANDARD_CHECKOUT_URL,
    GUMROAD_WEBHOOK_SECRET: process.env.GUMROAD_WEBHOOK_SECRET,
    GUMROAD_SELLER_ID: process.env.GUMROAD_SELLER_ID,
    DOWNLOAD_SIGNING_SECRET: process.env.DOWNLOAD_SIGNING_SECRET,
    ALLOW_TEST_WEBHOOKS: process.env.ALLOW_TEST_WEBHOOKS
  });

  if (!parsed.success) {
    console.warn("Invalid server environment configuration:", parsed.error.flatten().fieldErrors);
    return {
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      ADMIN_EMAIL: undefined,
      LAUNCH_BUYER_LIMIT: 50,
      LAUNCH_END_AT: "2026-12-20T23:59:59+05:30",
      USD_TO_INR_RATE: 85,
      RAZORPAY_KEY_ID: undefined,
      RAZORPAY_KEY_SECRET: undefined,
      RAZORPAY_LAUNCH_CHECKOUT_URL: undefined,
      RAZORPAY_STANDARD_CHECKOUT_URL: undefined,
      RAZORPAY_WEBHOOK_SECRET: undefined,
      GUMROAD_LAUNCH_CHECKOUT_URL: undefined,
      GUMROAD_STANDARD_CHECKOUT_URL: undefined,
      GUMROAD_WEBHOOK_SECRET: undefined,
      GUMROAD_SELLER_ID: undefined,
      DOWNLOAD_SIGNING_SECRET: undefined,
      ALLOW_TEST_WEBHOOKS: "false"
    };
  }

  return parsed.data;
}

export function isPlaceholderValue(value: string | undefined | null): boolean {
  if (!value) return true;
  const lower = value.toLowerCase();
  return (
    lower.includes("placeholder") ||
    lower.includes("your-project-id") ||
    lower.includes("your-supabase") ||
    lower.includes("your-razorpay") ||
    lower.includes("your-gumroad")
  );
}

export function isSupabasePublicConfigured(): boolean {
  const env = getPublicEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !isPlaceholderValue(env.NEXT_PUBLIC_SUPABASE_URL) &&
      !isPlaceholderValue(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function isSupabaseAdminConfigured(): boolean {
  const server = getServerEnv();
  return Boolean(
    isSupabasePublicConfigured() &&
      server.SUPABASE_SERVICE_ROLE_KEY &&
      !isPlaceholderValue(server.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export function isConfiguredCheckoutUrl(url: string | undefined): url is string {
  return Boolean(url && !isPlaceholderValue(url));
}

export function isConfiguredSecret(secret: string | undefined): secret is string {
  return Boolean(secret && !isPlaceholderValue(secret));
}
