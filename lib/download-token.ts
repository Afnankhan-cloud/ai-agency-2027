import crypto from "crypto";

const FALLBACK_SECRET =
  process.env.DOWNLOAD_SIGNING_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.RAZORPAY_WEBHOOK_SECRET ||
  "vertex-digitals-secure-zip-delivery-key-2027";

export interface DownloadTokenPayload {
  orderId: string;
  email?: string;
  expiresAt: number;
  sig: string;
}

export function generateDownloadToken(
  orderId: string,
  email?: string,
  expiresInSeconds = 86400 // 24 hours
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payloadToSign = `${orderId}:${email || "anonymous"}:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", FALLBACK_SECRET)
    .update(payloadToSign)
    .digest("hex");

  const data: DownloadTokenPayload = {
    orderId,
    email,
    expiresAt,
    sig
  };

  return Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
}

export function verifyDownloadToken(
  token: string
): { valid: boolean; orderId?: string; email?: string; error?: string } {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Missing download token" };
  }

  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(jsonStr) as Partial<DownloadTokenPayload>;

    if (!data.orderId || !data.expiresAt || !data.sig) {
      return { valid: false, error: "Malformed download token" };
    }

    const now = Math.floor(Date.now() / 1000);
    if (now > data.expiresAt) {
      return { valid: false, error: "Download link has expired. Please contact support with your order ID." };
    }

    const payloadToSign = `${data.orderId}:${data.email || "anonymous"}:${data.expiresAt}`;
    const expectedSig = crypto
      .createHmac("sha256", FALLBACK_SECRET)
      .update(payloadToSign)
      .digest("hex");

    const sigBuf = Buffer.from(data.sig, "utf8");
    const expectedBuf = Buffer.from(expectedSig, "utf8");

    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false, error: "Invalid cryptographic signature" };
    }

    return { valid: true, orderId: data.orderId, email: data.email };
  } catch {
    return { valid: false, error: "Failed to decode download token" };
  }
}
