"use client";

/**
 * Testimonials Component (Inactive)
 * ----------------------------------------------------------------------------
 * Fake and placeholder testimonials have been removed from the live page.
 * When authentic post-launch reviews from verified buyers are collected,
 * populate REAL_TESTIMONIALS below and re-enable this section in app/page.tsx.
 */

export interface VerifiedTestimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  verifiedOrder: boolean;
}

export const VERIFIED_TESTIMONIALS: VerifiedTestimonial[] = [];

export function Testimonials() {
  if (VERIFIED_TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            Customer Feedback
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Verified Builder Reviews
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VERIFIED_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="glass-panel flex flex-col justify-between rounded-2xl p-6"
            >
              <p className="text-sm leading-relaxed text-slate-300">“{t.feedback}”</p>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <div className="text-xs font-semibold text-white">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
