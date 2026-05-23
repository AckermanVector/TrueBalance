"use client";

import { Sidebar } from "./sidebar";
import { AnimatedBackground } from "./animated-background";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen relative z-10">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
