import Link from "next/link";
import {
  AlertTriangle,
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
import { selectRoleAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const taskStyles = {
  Done: {
    icon: CheckCircle2,
    badge: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
    iconBox: "bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]",
  },
  Due: {
    icon: AlertTriangle,
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

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function RoleSelection() {
  return (
    <DashboardShell
      eyebrow="Welcome"
      title="Choose your LeanDoze workspace."
      description="Set up a patient profile or create a clinic/provider workspace. You can connect them later through secure invites."
      activePath="/app/dashboard"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <form action={selectRoleAction} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <input type="hidden" name="role" value="patient" />
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Patient</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">I am a patient</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Track medication details, check-ins, reports, and controlled clinic access.
          </p>
          <button className="mt-8 h-12 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5">
            Continue as patient
          </button>
        </form>

        <form action={selectRoleAction} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <input type="hidden" name="role" value="clinic" />
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Clinic</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">I am a clinic/provider</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Invite patients and review progress only after PatientAccess exists.
          </p>
          <label className="mt-6 block text-sm font-semibold text-slate-800">
            Clinic name
            <input
              name="clinicName"
              placeholder="Restore Health"
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <button className="mt-6 h-12 rounded-full bg-white px-6 text-sm font-semibold text-[#0B1220] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-50">
            Continue as clinic
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

export default async function PatientDashboard() {
  const { user, patientProfile } = await getPatientAppState();

  if (!patientProfile && user.memberships.length === 0) {
    return (
      <div className="bg-[#F8FAFC] text-[#0B1220]">
        <RoleSelection />
        <Footer />
      </div>
    );
  }

  if (!patientProfile) {
    return (
      <div className="bg-[#F8FAFC] text-[#0B1220]">
        <DashboardShell
          eyebrow="Clinic Workspace"
          title="Your provider workspace is ready."
          description="Use the clinic app to invite patients and review connected patient progress."
          action={<Link href="/clinic/dashboard" className="rounded-full bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white">Open clinic</Link>}
          activePath="/clinic/dashboard"
        >
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-600">Clinics cannot see patients until an accepted invite creates PatientAccess.</p>
          </div>
        </DashboardShell>
        <Footer />
      </div>
    );
  }

  const plan = patientProfile.medicationPlans[0];
  const latestWeight = patientProfile.weightLogs[0]?.weightLb ?? patientProfile.startWeightLb ?? 0;
  const proteinAvg = average(patientProfile.nutritionLogs.map((log) => log.proteinGrams ?? 0));
  const hydrationAvg = average(patientProfile.hydrationLogs.map((log) => log.ounces));
  const reportReady = patientProfile.doctorReports[0] ? "Ready" : "Generate";
  const todayPlan = [
    { label: "Medication plan", value: plan ? `${plan.medication} ${plan.doseMg}mg` : "Set up your GLP-1 plan", status: plan ? "Done" : "Due", href: "/app/medication" },
    { label: "Daily check-in", value: "Weight, protein, hydration, symptoms", status: "Log", href: "/app/check-in" },
    { label: "Doctor report", value: "7 or 30 day clinic-ready summary", status: reportReady === "Ready" ? "Done" : "Planned", href: "/app/reports" },
    { label: "Invite doctor", value: "Share access by secure email invite", status: patientProfile.accessGrants.length ? "Done" : "Planned", href: "/app/invite-doctor" },
  ];
  const metrics = [
    { label: "Weight", value: latestWeight ? `${latestWeight} lb` : "Start", helper: "latest logged", progress: 80, icon: CalendarCheck, color: "#0B1220" },
    { label: "Protein", value: `${proteinAvg}g`, helper: `goal ${patientProfile.proteinGoalGrams}g`, progress: Math.min(100, Math.round((proteinAvg / patientProfile.proteinGoalGrams) * 100)), icon: Utensils, color: "#16A34A" },
    { label: "Hydration", value: `${hydrationAvg}oz`, helper: `goal ${patientProfile.hydrationGoalOz}oz`, progress: Math.min(100, Math.round((hydrationAvg / patientProfile.hydrationGoalOz) * 100)), icon: Droplet, color: "#17C2B2" },
    { label: "Report", value: reportReady, helper: "clinic-ready", progress: reportReady === "Ready" ? 100 : 35, icon: FileText, color: "#0B1220" },
  ];

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <DashboardShell
        eyebrow="PATIENT DASHBOARD"
        title="Your GLP-1 plan for today."
        description="You’re on track. Stay consistent."
        action={<StatusBadge tone={patientProfile.riskFlags.length ? "amber" : "green"}>{patientProfile.riskFlags.length ? "Review flags" : "On track"}</StatusBadge>}
        activePath="/app/dashboard"
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.95fr)]">
          <main className="space-y-6">
            <section className="relative overflow-hidden rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:bg-gradient-to-b before:from-white before:to-transparent">
              <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E] ring-1 ring-teal-100">
                    <CalendarCheck className="size-3.5" />
                    Today Plan
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-[#050816]">Dose week day 3</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">Complete the essentials that keep your dose week steady.</p>
                </div>
              </div>
              <div className="relative z-10 mt-8 grid gap-3">
                {todayPlan.map((item) => {
                  const style = taskStyles[item.status as keyof typeof taskStyles];
                  const Icon = style.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between gap-4 rounded-[18px] border px-4 py-4 transition-all duration-300 ease-out hover:-translate-y-px hover:bg-white hover:shadow-[0_14px_32px_rgba(15,23,42,0.07)]",
                        item.status === "Done" && "border-[#BBF7D0]/80 bg-[#F0FDF4]/70",
                        item.status === "Due" && "border-[#99F6E4]/70 bg-[#ECFEFF]/70",
                        item.status === "Planned" && "border-[#E2E8F0]/80 bg-[#F8FAFC]/75",
                        item.status === "Log" && "border-[#E2E8F0]/80 bg-white/80",
                      )}
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
                      <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", style.badge)}>{item.status}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="relative overflow-hidden rounded-[22px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.055)] transition-all duration-300 ease-out hover:-translate-y-0.5">
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
                    <div className="h-full rounded-full" style={{ width: `${metric.progress}%`, backgroundColor: metric.color }} />
                  </div>
                </div>
              ))}
            </section>
          </main>

          <aside className="space-y-6">
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1220] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7EE6D6]">Risk review</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{patientProfile.riskFlags.length ? "Flags need review" : "No active flags"}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">LeanDoze surfaces patterns only. Review this with your clinician.</p>
              <div className="mt-6 space-y-3">
                {(patientProfile.riskFlags.length ? patientProfile.riskFlags : []).map((flag) => (
                  <div key={flag.id} className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{flag.title}</p>
                      <span className="text-xs font-bold uppercase text-[#7EE6D6]">{flag.level}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{flag.description}</p>
                  </div>
                ))}
                {!patientProfile.riskFlags.length ? <ShieldPlus className="size-12 text-[#7EE6D6]" /> : null}
              </div>
            </section>

            <section className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                  <HeartPulse className="size-5" />
                </div>
                <h2 className="font-semibold tracking-tight text-[#0B1220]">Recent symptoms</h2>
              </div>
              <div className="mt-5 space-y-3">
                {patientProfile.symptomLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Nausea {log.nausea.toLowerCase()}, constipation {log.constipation.toLowerCase()}, reflux {log.reflux.toLowerCase()}
                  </div>
                ))}
                {!patientProfile.symptomLogs.length ? <p className="text-sm text-slate-500">No symptoms logged yet.</p> : null}
              </div>
            </section>
          </aside>
        </div>
      </DashboardShell>
      <Footer />
    </div>
  );
}
