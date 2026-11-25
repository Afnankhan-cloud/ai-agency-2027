import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin-data";
import { getServerEnv } from "@/lib/env";
import { getLiveOfferState } from "@/lib/pricing";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const serverEnv = getServerEnv();
  const configuredAdminEmail = serverEnv.ADMIN_EMAIL?.toLowerCase();
  const currentUserEmail = user.email?.toLowerCase();

  if (!configuredAdminEmail || !currentUserEmail || currentUserEmail !== configuredAdminEmail) {
    redirect("/admin/login?error=unauthorized");
  }

  const [dashboardData, offerState] = await Promise.all([
    getAdminDashboardData(user.email ?? configuredAdminEmail),
    getLiveOfferState()
  ]);

  return <AdminDashboard data={dashboardData} offerState={offerState} />;
}
