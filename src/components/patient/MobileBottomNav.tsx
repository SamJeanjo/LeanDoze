import Link from "next/link";
import { Activity, FileText, Home, LineChart, UserCircle } from "lucide-react";

export type PatientNavKey = "today" | "log" | "progress" | "report" | "profile";

const nav = [
  { href: "/app", label: "Today", key: "today", icon: Home },
  { href: "/app#quick-check-in", label: "Log", key: "log", icon: Activity },
  { href: "/app/progress", label: "Progress", key: "progress", icon: LineChart },
  { href: "/app/reports", label: "Report", key: "report", icon: FileText },
  { href: "/app/settings", label: "Profile", key: "profile", icon: UserCircle },
] as const;

export function MobileBottomNav({ active }: { active: PatientNavKey }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-[72px] border-t border-[#E2E8F0]/80 bg-white px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-18px_40px_rgba(15,23,42,0.08)] lg:hidden">
      <div className="mx-auto grid max-w-[520px] grid-cols-5 gap-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={
                isActive
                  ? "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[#0F766E]"
                  : "flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-slate-500 transition-all duration-200 ease-out active:scale-[0.98]"
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
