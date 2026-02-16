"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/features/auth/components/shared/auth-guard";
import { DashboardSidebar } from "../../features/shared/components/dashboard-sidebar";
import { DashboardHeader } from "../../features/shared/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-100 dark:bg-slate-950" />;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <DashboardSidebar />
        <div className="pl-64 flex min-h-screen flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
