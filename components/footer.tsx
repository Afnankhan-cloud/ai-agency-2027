"use client";

import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BRAND, LEGAL_TERMS } from "@/lib/constants";

type ModalTopic = "terms" | "privacy" | "contact" | null;

const ANCHOR_LINKS = [
  { href: "#whats-inside", label: "What’s Inside" },
  { href: "#why-2027", label: "Why 2027" },
  { href: "#proof", label: "Proof" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" }
] as const;

export function Footer({ contactEmail }: { contactEmail: string }) {
  const [modalTopic, setModalTopic] = useState<ModalTopic>(null);

  useEffect(() => {
    if (!modalTopic) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalTopic(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalTopic]);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#05070d]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <BrandMark showSublabel />
            <p className="mt-3 text-sm text-slate-400">{BRAND.tagline}</p>
          </div>

          <nav aria-label="Footer anchor navigation" className="flex flex-wrap gap-6">
            {ANCHOR_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/[0.06] pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {currentYear} {BRAND.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setModalTopic("terms")}
              className="text-xs text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Terms
            </button>
            <button
              type="button"
              onClick={() => setModalTopic("privacy")}
              className="text-xs text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setModalTopic("contact")}
              className="text-xs text-slate-400 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Accessible placeholder policy / contact dialog */}
      {modalTopic ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setModalTopic(null)}
        >
          <div
            className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 id="footer-modal-title" className="text-lg font-semibold text-white">
                {modalTopic === "terms"
                  ? "Terms of Use (Placeholder)"
                  : modalTopic === "privacy"
                    ? "Privacy Policy (Placeholder)"
                    : "Contact Vertex Digitals (Placeholder)"}
              </h3>
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                aria-label="Close modal"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-slate-300">
              {modalTopic === "terms" ? (
                <p>{LEGAL_TERMS.termsSummary}</p>
              ) : modalTopic === "privacy" ? (
                <p>{LEGAL_TERMS.privacySummary}</p>
              ) : (
                <div className="space-y-3">
                  <p>
                    Configure{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">
                      NEXT_PUBLIC_CONTACT_EMAIL
                    </code>{" "}
                    before launch to set your public support address.
                  </p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-2 font-mono text-xs text-cyan-200 hover:bg-cyan-500/20"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
