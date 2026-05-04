import type { ReactNode } from "react";

export function AppShell({ sidebar, mobileNav, children }: { sidebar: ReactNode; mobileNav: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-6 px-4 py-5 pb-28 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8 lg:py-8 lg:pb-10">
        {sidebar}
        <main className="relative z-0 min-w-0">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}
