import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Agency 2027 — Vertex Digitals";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#06080F",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.28), transparent 45%), radial-gradient(circle at 20% 85%, rgba(34, 211, 238, 0.18), transparent 45%)",
          padding: "64px",
          color: "#F8FAFC",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              color: "#06080F"
            }}
          >
            V
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#E2E8F0"
            }}
          >
            Vertex Digitals
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div
            style={{
              fontSize: "18px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#22D3EE",
              fontWeight: 600
            }}
          >
            2027 AGENCY STARTER BUNDLE
          </div>
          <div
            style={{
              fontSize: "66px",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              color: "#FFFFFF"
            }}
          >
            Start Your AI Agency in 2027.
          </div>
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#94A3B8"
            }}
          >
            Complete Ebook • Practical Workbooks • 10 n8n Workflows • First Client Guide
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#CBD5E1"
          }}
        >
          <span>Instant ZIP Bundle Delivery</span>
          <span style={{ color: "#A78BFA", fontWeight: 600 }}>
            India ₹999 • International $80 (First 50 Buyers)
          </span>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
