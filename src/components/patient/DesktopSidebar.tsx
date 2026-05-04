import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Apple, BookOpen, CalendarDays, FileText, HeartPulse, Home, LineChart, Settings } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ClinicConnectionCard } from "@/components/patient/ClinicConnectionCard";
import type { PatientNavKey } from "@/components/patient/MobileBottomNav";

const nav = [
  { href: "/app", label: "Today", key: "today", icon: Home },
  { href: "/app/insights", label: "Dose", key: "today", icon: CalendarDays },
  { href: "/app/insights#symptoms", label: "Symptoms", key: "log", icon: HeartPulse },
  { href: "/app#quick-check-in", label: "Nutrition", key: "log", icon: Apple },
  { href: "/app/progress", label: "Progress", key: "progress", icon: LineChart },
  { href: "/app/reports", label: "Reports", key: "report", icon: FileText },
  { href: "/app/insights#resources", label: "Resources", key: "today", icon: BookOpen },
  { href: "/app/settings", label: "Settings", key: "profile", icon: Settings },
] as const;

export function DesktopSidebar({ active }: { active: PatientNavKey }) {
  return (
    <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] rounded-[34px] border border-[#E2E8F0]/80 bg-white/90 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <Link href="/app" className="flex items-center gap-3 rounded-[26px] bg-[#F8FAFC] p-3 ring-1 ring-[#E2E8F0]/80">
          <Logo variant="mark" theme="light" size="md" priority />
          <div>
            <p className="font-semibold tracking-[-0.02em] text-[#07111F]">LeanDoze</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">Patient OS</p>
          </div>
        </Link>

        <nav className="mt-6 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={
                  isActive
                    ? "flex min-h-11 items-center gap-3 rounded-2xl bg-[#ECFEFF] px-3 text-sm font-semibold text-[#0F766E] shadow-[0_0_0_1px_rgba(20,184,166,0.14),0_12px_24px_rgba(20,184,166,0.14)]"
                    : "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#07111F]"
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <ClinicConnectionCard />
          <div className="flex items-center justify-between rounded-[22px] bg-[#F8FAFC] p-3 ring-1 ring-[#E2E8F0]">
            <p className="text-sm font-semibold text-[#07111F]">Account</p>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </aside>
  );
}
