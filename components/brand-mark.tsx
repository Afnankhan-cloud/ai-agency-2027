import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  showSublabel?: boolean;
}

export function BrandMark({ className, showSublabel = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-cyan-400/20 shadow-[0_0_20px_-6px_rgba(139,92,246,0.7)]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="text-white"
        >
          <path
            d="M4.5 5.5L12 19.5L19.5 5.5H15.6L12 12.6L8.4 5.5H4.5Z"
            fill="url(#vertexLogoGrad)"
          />
          <circle cx="12" cy="5.5" r="1.8" fill="#22D3EE" />
          <defs>
            <linearGradient
              id="vertexLogoGrad"
              x1="4.5"
              y1="5.5"
              x2="19.5"
              y2="19.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C4B5FD" />
              <stop offset="0.55" stopColor="#818CF8" />
              <stop offset="1" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-white">
          {BRAND.name}
        </span>
        {showSublabel ? (
          <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">
            AI Agency 2027
          </span>
        ) : null}
      </span>
    </span>
  );
}
