import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Droplet,
  FileText,
  HeartPulse,
  Plus,
  ShieldPlus,
  Utensils,
} from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import { symptomQuickLog, todayPlan } from "@/lib/mock-data";

const taskStyles = {
  Done: {
    icon: CheckCircle2,
    badge: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    iconBox: "bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]",
  },
  Due: {
    icon: ArrowUpRight,
    badge: "bg-[#CCFBF1] text-[#0F766E] border-[#99F6E4]",
    iconBox: "bg-[#CCFBF1] border-[#99F6E4] text-[#0F766E]",
  },
  Planned: {
    icon: Circle,
    badge: "bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]",
    iconBox: "bg-white border-[#CBD5E1] text-[#64748B]",
  },
  Log: {
    icon: Plus,
    badge: "bg-white text-[#334155] border-[#CBD5E1]",
    iconBox: "bg-white border-[#CBD5E1] text-[#475569]",
  },
};

const metrics = [
  {
    label: "Protein",
    value: "92g",
    helper: "of 120g goal",
    progress: 77,
    icon: Utensils,
    color: "#16A34A",
  },
  {
    label: "Hydration",
    value: "68oz",
    helper: "of 90oz goal",
    progress: 76,
    icon: Droplet,
    color: "#17C2B2",
  },
  {
    label: "Muscle score",
    value: "84",
    helper: "stable this week",
    progress: 84,
    icon: ShieldPlus,
    color: "#17C2B2",
  },
  {
    label: "Report",
    value: "Ready",
    helper: "next visit May 14",
    progress: 100,
    icon: FileText,
    color: "#0B1220",
  },
];

export default function PatientDashboard() {
  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="PATIENT DASHBOARD"
        title="Your GLP-1 plan for today."
        description="You’re on track. Stay consistent."
        action={<StatusBadge tone="green">Dose day on schedule</StatusBadge>}
        activePath="/app"
      >
        <div className="ld-page-enter grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)]">
          <main className="space-y-6">
            <section className="ld-card-enter relative overflow-hidden rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:bg-gradient-to-b before:from-white before:to-transparent">
              <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E] ring-1 ring-teal-100">
                    <CalendarCheck className="size-3.5" />
                    Today Plan
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-[#050816]">
                    Dose week day 3
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    Complete the essentials that keep your dose week steady.
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
                  <span className="font-semibold text-[#0B1220]">4</span> actions today
                </div>
              </div>

              <div className="relative z-10 mt-8 grid gap-3">
                {todayPlan.map((item, index) => {
                  const style = taskStyles[item.status as keyof typeof taskStyles];
                  const Icon = style.icon;

                  return (
                    <div
                      key={item.label}
                      className={cn(
                        "ld-task-row group flex items-center justify-between gap-4 rounded-[18px] border px-4 py-4 transition-all duration-300 ease-out hover:-translate-y-px hover:bg-white hover:shadow-[0_14px_32px_rgba(15,23,42,0.07)]",
                        item.status === "Done" && "border-[#BBF7D0]/80 bg-[#F0FDF4]/70",
                        item.status === "Due" && "border-[#99F6E4]/70 bg-[#ECFEFF]/70",
                        item.status === "Planned" && "border-[#E2E8F0]/80 bg-[#F8FAFC]/75",
                        item.status === "Log" && "border-[#E2E8F0]/80 bg-white/80",
                      )}
                      style={{ animationDelay: `${120 + index * 90}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border", style.iconBox)}>
                          <Icon className="h-5 w-5 stroke-[1.75]" />
                        </div>
                        <div>
                          <p className="text-base font-semibold tracking-[-0.015em] text-[#0B1220]">{item.label}</p>
                          <p className="mt-1 text-sm leading-5 text-[#64748B]">{item.value}</p>
                        </div>
                      </div>
                      <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", style.badge)}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className="ld-card-enter relative overflow-hidden rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.055)] transition-all duration-300 ease-out before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.075)]"
                  style={{ animationDelay: `${260 + index * 90}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#64748B]">{metric.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#050816]">{metric.value}</p>
                    </div>
                    <div className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200">
                      <metric.icon className="size-4.5" />
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-[#64748B]">{metric.helper}</p>
                  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]/70">
                    <div
                      className="ld-progress h-full origin-left rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${metric.progress}%`,
                        backgroundColor: metric.color,
                        animationDelay: `${420 + index * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </section>
          </main>

          <aside className="space-y-6">
            <section className="ld-card-enter relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1220] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] after:pointer-events-none after:absolute after:-right-20 after:-top-20 after:h-64 after:w-64 after:rounded-full after:bg-[#17C2B2]/20 after:blur-3xl">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7EE6D6]">
                    Muscle Protection
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Score holding steady</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                    Protein consistency and strength activity are supporting lean mass protection this week.
                  </p>
                </div>
                <div className="grid size-10 place-items-center rounded-2xl bg-white/8 text-[#7EE6D6] ring-1 ring-white/10">
                  <ShieldPlus className="size-5" />
                </div>
              </div>
              <div className="relative z-10 mt-8 flex justify-center">
                <div className="ld-score-ring relative grid size-36 place-items-center rounded-full" style={{ "--score": 84 } as React.CSSProperties}>
                  <div className="grid size-28 place-items-center rounded-full bg-[#0B1220] text-center shadow-[inset_0_0_28px_rgba(126,230,214,0.08)] ring-1 ring-white/10">
                    <div>
                      <p className="text-4xl font-semibold tracking-tight">84</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Score</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="ld-card-enter relative overflow-hidden rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)] before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                  <HeartPulse className="size-5" />
                </div>
                <h2 className="font-semibold tracking-tight text-[#0B1220]">Side effects quick log</h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {symptomQuickLog.map((symptom) => (
                  <button
                    key={symptom}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/70 hover:text-[#0B1220]"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </section>

            <section className="ld-card-enter relative overflow-hidden rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)] before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent" style={{ animationDelay: "260ms" }}>
              <h2 className="font-semibold tracking-tight text-[#0B1220]">Weight trend</h2>
              <div className="mt-6 flex h-32 items-end gap-2 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                {[42, 55, 49, 67, 62, 78, 74].map((height, index) => (
                  <div
                    key={index}
                    className="ld-bar origin-bottom flex-1 rounded-t-lg bg-[#17C2B2]"
                    style={{ height: `${height}%`, animationDelay: `${300 + index * 55}ms` }}
                  />
                ))}
              </div>
            </section>

            <section className="ld-card-enter relative overflow-hidden rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)] before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent" style={{ animationDelay: "340ms" }}>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <FileText className="size-5" />
                </div>
                <h2 className="font-semibold tracking-tight text-[#0B1220]">Next doctor report</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Summary includes dose adherence, side effect notes, protein and hydration averages, and current progress trend.
              </p>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]/70">
                <div className="ld-progress h-full origin-left rounded-full bg-[#0B1220] transition-all duration-700 ease-out" style={{ width: "88%", animationDelay: "520ms" }} />
              </div>
            </section>
          </aside>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
