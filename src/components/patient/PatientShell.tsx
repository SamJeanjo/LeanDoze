import Link from "next/link";
import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/brand/Logo";
import { AppShell } from "@/components/ui/AppShell";
import { DesktopSidebar } from "@/components/patient/DesktopSidebar";
import { MobileBottomNav, type PatientNavKey } from "@/components/patient/MobileBottomNav";

export function PatientShell({ active, children }: { active: PatientNavKey; children: ReactNode }) {
  return (
    <AppShell sidebar={<DesktopSidebar active={active} />} mobileNav={<MobileBottomNav active={active} />}>
      <header className="sticky top-0 z-40 -mx-4 mb-5 border-b border-[#E2E8F0]/80 bg-white px-4 sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex h-16 items-center justify-between">
          <Link href="/app" className="flex items-center gap-3">
            <Logo variant="mark" theme="light" size="sm" priority />
            <div>
              <p className="text-sm font-semibold text-[#07111F]">LeanDoze</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748B]">Today</p>
            </div>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      {children}
    </AppShell>
  );
}
