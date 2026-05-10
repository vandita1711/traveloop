import { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export async function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eef4ff]">
      <div className="pointer-events-none fixed inset-0 bg-hero-grid opacity-90" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6 pb-8 pt-16 lg:pt-0">
          <Topbar />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
