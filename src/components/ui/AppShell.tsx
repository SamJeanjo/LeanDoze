import type { ReactNode } from "react";

export function AppShell({ sidebar, mobileNav, children }: { sidebar: ReactNode; mobileNav: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,rgba(125,211,199,0.18),transparent_28%),#F8FAFC] text-[#0F172A]">
      <div className="mx-auto grid w-full max-w-[1480px] gap-6 px-4 py-5 pb-28 sm:px-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:px-8 lg:py-8 lg:pb-10">
        {sidebar}
        <main className="min-w-0">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}
