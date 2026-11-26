"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#whats-inside", label: "What’s Inside" },
  { href: "#why-2027", label: "Why 2027" },
  { href: "#proof", label: "Proof" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" }
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleCtaClick = () => {
    trackCtaClick("header");
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.08] bg-[#06080f]/80 backdrop-blur-xl shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Vertex Digitals home"
        >
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#pricing"
            onClick={handleCtaClick}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_25px_-6px_rgba(139,92,246,0.75)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_32px_-4px_rgba(34,211,238,0.65)]"
          >
            <span>Get Instant Access</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:bg-white/[0.08] md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-white/[0.08] bg-[#080b14]/95 px-4 pb-5 pt-4 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={handleCtaClick}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              <span>Get Instant Access</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
