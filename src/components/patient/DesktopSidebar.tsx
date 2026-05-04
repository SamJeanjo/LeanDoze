import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Apple, BookOpen, CalendarDays, FileText, HeartPulse, Home, LineChart, Settings } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ClinicConnectionCard } from "@/components/patient/ClinicConnectionCard";
import type { PatientNavKey } from "@/components/patient/MobileBottomNav";

const nav = [
  { href: "/app", label: "Today", key: "today", icon: Home },
  { href: "/app/insights", label: "Dose", key: "dose", icon: CalendarDays },
  { href: "/app/insights#symptoms", label: "Symptoms", key: "symptoms", icon: HeartPulse },
  { href: "/app#quick-check-in", label: "Nutrition", key: "nutrition", icon: Apple },
  { href: "/app/progress", label: "Progress", key: "progress", icon: LineChart },
  { href: "/app/reports", label: "Reports", key: "report", icon: FileText },
  { href: "/app/insights#resources", label: "Resources", key: "resources", icon: BookOpen },
  { href: "/app/settings", label: "Settings", key: "profile", icon: Settings },
] as const;

export function DesktopSidebar({ active }: { active: PatientNavKey }) {
  const activeLabel = active === "today" ? "Today" : active === "log" ? "Nutrition" : active === "progress" ? "Progress" : active === "report" ? "Reports" : "Settings";

  return (
    <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] w-[280px] rounded-[34px] border border-slate-200/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <Link href="/app" className="flex items-center gap-3 rounded-[28px] border border-slate-200/70 bg-white p-3 shadow-[0_16px_42px_rgba(15,23,42,0.045)]">
          <Logo variant="mark" theme="light" size="md" priority />
          <div>
            <p className="font-semibold tracking-[-0.02em] text-[#07111F]">LeanDoze</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">Patient OS</p>
          </div>
        </Link>

        <nav className="mt-6 grid gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = activeLabel === item.label;
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={
                  isActive
                    ? "flex min-h-11 items-center gap-3 rounded-2xl border border-[#99F6E4] bg-[#ECFDF5] px-3 text-sm font-semibold text-[#0F766E]"
                    : "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-slate-500 transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-900"
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
          <div className="relative z-0 flex items-center justify-between rounded-[28px] border border-slate-200/70 bg-white px-4 py-3 shadow-[0_16px_42px_rgba(15,23,42,0.045)]">
            <p className="text-sm font-semibold text-[#07111F]">Account</p>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </aside>
  );
}
