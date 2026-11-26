"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics";

interface MobileStickyCtaProps {
  onOpenCheckout: () => void;
}

export function MobileStickyCta({ onOpenCheckout }: MobileStickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Appear smoothly after user scrolls past the hero section (~350px)
      // and hide if at the very bottom (footer) to prevent obstructing links
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const nearBottom = scrollY + winHeight > docHeight - 120;

      if (scrollY > 350 && !nearBottom) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    trackCtaClick("mobile_sticky_cta");
    onOpenCheckout();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 block md:hidden border-t border-white/10 bg-[#06080f]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        >
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-300 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                AI Agency Mastery
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg font-bold text-white leading-none">₹999</span>
                <span className="text-xs text-slate-400 line-through leading-none">₹1,499</span>
                <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 font-mono text-[9px] text-emerald-300 ml-1">
                  Save ₹500
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white shadow-glow transition-all active:scale-95"
            >
              <span>Buy Now</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
