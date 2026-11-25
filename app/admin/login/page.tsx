import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin-login-form";
import { BrandMark } from "@/components/brand-mark";
import { isSupabasePublicConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

interface AdminLoginPageProps {
  searchParams?: {
    error?: string;
  };
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const supabaseConfigured = isSupabasePublicConfigured();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#06080f] px-4 py-12">
      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none fixed inset-0 -z-20 opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-glow-radial"
      />

      <div className="mb-8 flex flex-col items-center gap-4">
        <Link href="/" aria-label="Return to Vertex Digitals storefront">
          <BrandMark showSublabel />
        </Link>
      </div>

      <AdminLoginForm
        supabaseConfigured={supabaseConfigured}
        initialError={searchParams?.error}
      />

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to AI Agency 2027 sales page
      </Link>
    </div>
  );
}
