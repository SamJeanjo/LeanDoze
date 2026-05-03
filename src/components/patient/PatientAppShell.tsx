import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Activity, Apple, CalendarDays, FileText, HeartPulse, Home, LineChart, Settings, Sparkles, UserCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type PatientAppShellProps = {
  active: "today" | "log" | "progress" | "report" | "profile";
  children: React.ReactNode;
};

const desktopNav = [
  { href: "/app", label: "Today", key: "today", icon: Home },
  { href: "/app#dose", label: "Dose", key: "today", icon: CalendarDays },
  { href: "/app#symptoms", label: "Symptoms", key: "log", icon: HeartPulse },
  { href: "/app#nutrition", label: "Nutrition", key: "log", icon: Apple },
  { href: "/app/progress", label: "Progress", key: "progress", icon: LineChart },
  { href: "/app/report", label: "Reports", key: "report", icon: FileText },
  { href: "/app#resources", label: "Resources", key: "today", icon: Sparkles },
  { href: "/app/settings", label: "Settings", key: "profile", icon: Settings },
];

const mobileNav = [
  { href: "/app", label: "Today", key: "today", icon: Home },
  { href: "/app#quick-log", label: "Log", key: "log", icon: Activity },
  { href: "/app/progress", label: "Progress", key: "progress", icon: LineChart },
  { href: "/app/report", label: "Report", key: "report", icon: FileText },
  { href: "/app/settings", label: "Profile", key: "profile", icon: UserCircle },
];

export function PatientAppShell({ active, children }: PatientAppShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0]/80 bg-white/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
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

      <div className="mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-5 pb-28 sm:px-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:px-8 lg:py-8 lg:pb-10">
        <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] rounded-[32px] border border-[#E2E8F0]/80 bg-white/88 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
          <div className="flex h-full flex-col">
            <Link href="/app" className="flex items-center gap-3 rounded-[24px] bg-[#F8FAFC] p-3 ring-1 ring-[#E2E8F0]">
              <Logo variant="mark" theme="light" size="md" priority />
              <div>
                <p className="font-semibold tracking-[-0.02em] text-[#07111F]">LeanDoze</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">Patient OS</p>
              </div>
            </Link>
            <nav className="mt-6 grid gap-1">
              {desktopNav.map((item) => {
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
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto rounded-[24px] bg-[#07111F] p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7DD3C7]">Clinic connected</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Your reports are ready when you choose to share.</p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E2E8F0]/80 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-[520px] grid-cols-5 gap-1">
          {mobileNav.map((item) => {
            const isActive = active === item.key;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  isActive
                    ? "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl bg-[#ECFEFF] text-[#0F766E]"
                    : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[#64748B]"
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
