import type { ReactNode } from "react";

export function AppShell({ sidebar, mobileNav, children }: { sidebar: ReactNode; mobileNav: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto grid w-full max-w-[1480px] grid-cols-12 gap-6 px-4 py-5 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-10">
        {sidebar}
        <main className="relative z-0 col-span-12 min-w-0 lg:col-span-9 xl:col-span-10">{children}</main>
      </div>
      {mobileNav}
    </div>
  );
}
