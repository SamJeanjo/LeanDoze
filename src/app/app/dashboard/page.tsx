import Link from "next/link";
import { SymptomSeverity } from "@prisma/client";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Droplet,
  FileText,
  HeartPulse,
  Plus,
  Utensils,
  Dumbbell,
  Activity,
} from "lucide-react";
import { ClinicLayout, Footer, PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { selectRoleAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";
import { calculateDoseRhythmStatus, calculateMuscleProtectionScore } from "@/lib/scores";
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

function trendLabel(values: number[], goal?: number) {
  const latest = values[0] ?? 0;
  const oldest = values[Math.min(values.length - 1, 2)] ?? latest;
  const direction = latest > oldest ? "Improving" : latest < oldest ? "Lower" : "Steady";
  const goalText = goal ? `${Math.round((latest / goal) * 100)}% of target today` : "last 3 days";

  return { direction, goalText };
}

function guidancePreview(message: string) {
  const firstSentence = message.split(".")[0]?.trim();
  return firstSentence ? `${firstSentence}.` : message;
}

function RoleSelection() {
  return (
    <PatientLayout
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
    </PatientLayout>
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
        <ClinicLayout
          eyebrow="Clinic Workspace"
          title="Your provider workspace is ready."
          description="Use the clinic app to invite patients and review connected patient progress."
          action={<Link href="/clinic/dashboard" className="rounded-full bg-[#0B1220] px-5 py-3 text-sm font-semibold text-white">Open clinic</Link>}
          activePath="/clinic/dashboard"
        >
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm text-slate-600">Clinics cannot see patients until an accepted invite creates PatientAccess.</p>
          </div>
        </ClinicLayout>
        <Footer />
      </div>
    );
  }

  const plan = patientProfile.medicationPlans[0];
  const today = new Date(new Date().toDateString());
  const latestWeight = patientProfile.weightLogs[0]?.weightLb ?? patientProfile.startWeightLb ?? 0;
  const todayProtein = patientProfile.nutritionLogs.find((log) => log.loggedAt >= today)?.proteinGrams ?? 0;
  const todayHydration = patientProfile.hydrationLogs.find((log) => log.loggedAt >= today)?.ounces ?? 0;
  const todaySymptoms = patientProfile.symptomLogs.find((log) => log.loggedAt >= today);
  const todayCheckIn = patientProfile.dailyCheckIns.find((log) => log.checkInDate >= today);
  const proteinValues = patientProfile.nutritionLogs.map((log) => log.proteinGrams ?? 0);
  const hydrationValues = patientProfile.hydrationLogs.map((log) => log.ounces);
  const reportReady = patientProfile.doctorReports[0] ? "Ready" : "Generate";
  const isDoseDay = plan?.nextDoseDate ? new Date(plan.nextDoseDate.toDateString()).getTime() === today.getTime() : false;
  const muscleScore = calculateMuscleProtectionScore({
    proteinGoal: patientProfile.proteinGoalGrams,
    hydrationGoal: patientProfile.hydrationGoalOz,
    proteinLast7: proteinValues,
    hydrationLast7: hydrationValues,
    movementMinutesLast7: patientProfile.dailyCheckIns.map((checkIn) => checkIn.movementMinutes ?? 0),
    strengthTrainingDaysLast7: patientProfile.dailyCheckIns.filter((checkIn) => checkIn.strengthTraining).length,
    weightChangePercentPerWeek:
      patientProfile.weightLogs[0]?.weightLb && patientProfile.weightLogs[6]?.weightLb
        ? ((patientProfile.weightLogs[6].weightLb - patientProfile.weightLogs[0].weightLb) / patientProfile.weightLogs[6].weightLb) * 100
        : undefined,
    energyLast7: patientProfile.dailyCheckIns.map((checkIn) => checkIn.energyLevel ?? 0),
  });
  const doseRhythm = calculateDoseRhythmStatus({
    nextDoseDate: plan?.nextDoseDate,
    symptomsLast3: patientProfile.symptomLogs.slice(0, 3).map((log) => ({
      nausea: log.nausea,
      vomiting: log.vomiting,
      abdominalPain: log.abdominalPain,
    })),
    hydrationLast3: hydrationValues.slice(0, 3),
    proteinLast3: proteinValues.slice(0, 3),
    hydrationGoal: patientProfile.hydrationGoalOz,
    proteinGoal: patientProfile.proteinGoalGrams,
  });
  const highestFlag = patientProfile.riskFlags[0];
  const needsDoseAwareness = doseRhythm.status !== "On schedule";
  const primaryStatus = highestFlag
    ? {
        label: highestFlag.level === "URGENT" ? "Contact clinician" : "Review flag",
        tone: highestFlag.level === "URGENT" ? "coral" : "amber",
        title: highestFlag.title,
        explanation: highestFlag.recommendation ?? "Review this with your clinician.",
      }
    : needsDoseAwareness
      ? {
          label: doseRhythm.status,
          tone: doseRhythm.status === "Needs review" ? "coral" : "amber",
          title: "Dose rhythm needs a check-in",
          explanation: doseRhythm.explanation,
        }
      : {
          label: "On track",
          tone: "green",
          title: "You are on track today",
          explanation: "No active safety flags. Keep logging protein, hydration, symptoms, and movement.",
        };
  const scoreDrivers = [
    "protein consistency",
    "hydration consistency",
    "movement or strength activity",
    "energy trend",
    "pace of weight change",
  ];
  const whyScore =
    muscleScore.score >= 84
      ? "Strong protein and activity signals are carrying the score."
      : muscleScore.score >= 68
        ? "The score is stable, with the most room to improve in protein, hydration, or movement consistency."
        : "The score is lower because one or more core habits have not been logged consistently this week.";
  const hydrationPattern = trendLabel(hydrationValues.slice(0, 3), patientProfile.hydrationGoalOz);
  const proteinPattern = trendLabel(proteinValues.slice(0, 3), patientProfile.proteinGoalGrams);
  const symptomBurden = patientProfile.symptomLogs.slice(0, 3).filter((log) =>
    [log.nausea, log.vomiting, log.constipation, log.diarrhea, log.reflux, log.fatigue, log.abdominalPain].some(
      (severity) => severity === SymptomSeverity.MODERATE || severity === SymptomSeverity.SEVERE,
    ),
  ).length;
  const symptomPattern = symptomBurden === 0 ? "Quiet" : symptomBurden === 1 ? "Watch" : "Review";
  const consistencyDays = patientProfile.dailyCheckIns.filter((checkIn) => {
    const nutrition = patientProfile.nutritionLogs.find((log) => log.loggedAt.toDateString() === checkIn.checkInDate.toDateString());
    const hydration = patientProfile.hydrationLogs.find((log) => log.loggedAt.toDateString() === checkIn.checkInDate.toDateString());
    return (nutrition?.proteinGrams ?? 0) >= patientProfile.proteinGoalGrams * 0.6 && (hydration?.ounces ?? 0) >= patientProfile.hydrationGoalOz * 0.6;
  }).length;
  const consistencySignal =
    consistencyDays >= 5
      ? { label: "You're consistent this week", helper: `${consistencyDays} steady check-in days logged`, tone: "green" as const }
      : { label: "Consistency dropped", helper: `${consistencyDays} steady check-in days this week`, tone: "amber" as const };
  const generatedPlan = [
    ...(todayProtein < patientProfile.proteinGoalGrams
      ? [{ label: "Protein anchor", value: `${todayProtein}g of ${patientProfile.proteinGoalGrams}g logged`, status: "Due", href: "/app/check-in", action: "Log protein" }]
      : []),
    ...(todayHydration < patientProfile.hydrationGoalOz
      ? [{ label: "Hydration target", value: `${todayHydration}oz of ${patientProfile.hydrationGoalOz}oz logged`, status: "Due", href: "/app/check-in", action: "Add water" }]
      : []),
    ...(!todaySymptoms
      ? [{ label: "Symptom check", value: "Nausea, reflux, fatigue, abdominal pain", status: "Log", href: "/app/check-in", action: "Log symptoms" }]
      : []),
    ...(isDoseDay
      ? [{ label: "Dose reminder", value: `${plan?.medication} ${plan?.doseMg}mg scheduled today`, status: "Planned", href: "/app/medication", action: "Review dose" }]
      : []),
    ...(!todayCheckIn?.movementMinutes && !todayCheckIn?.strengthTraining
      ? [{ label: "Movement / strength", value: "Log movement or strength activity", status: "Planned", href: "/app/check-in", action: "Log movement" }]
      : []),
  ];
  const todayPlan = (
    generatedPlan.length
      ? generatedPlan
      : [{ label: "Keep rhythm", value: "Protein, hydration, symptoms, and movement are logged today", status: "Done", href: "/app/check-in", action: "Open check-in" }]
  ).slice(0, 5);
  const metrics = [
    { label: "Weight", value: latestWeight ? `${latestWeight} lb` : "Start", helper: "latest logged", progress: 80, icon: CalendarCheck, color: "#0B1220" },
    { label: "Protein", value: `${todayProtein}g`, helper: `of ${patientProfile.proteinGoalGrams}g today`, progress: Math.min(100, Math.round((todayProtein / patientProfile.proteinGoalGrams) * 100)), icon: Utensils, color: "#16A34A" },
    { label: "Hydration", value: `${todayHydration}oz`, helper: `of ${patientProfile.hydrationGoalOz}oz today`, progress: Math.min(100, Math.round((todayHydration / patientProfile.hydrationGoalOz) * 100)), icon: Droplet, color: "#17C2B2" },
    { label: "Energy", value: `${todayCheckIn?.energyLevel ?? "-"}`, helper: "latest 1-10 trend", progress: (todayCheckIn?.energyLevel ?? 0) * 10, icon: HeartPulse, color: "#17C2B2" },
    { label: "Report", value: reportReady, helper: "clinic-ready", progress: reportReady === "Ready" ? 100 : 35, icon: FileText, color: "#0B1220" },
  ];

  return (
    <div className="bg-[#F8FAFC] text-[#0B1220]">
      <PatientLayout
        eyebrow="PATIENT DASHBOARD"
        title="Your GLP-1 plan for today."
        description="You're on track. Stay consistent."
        action={<StatusBadge tone={primaryStatus.tone as "green" | "amber" | "coral"}>{primaryStatus.label}</StatusBadge>}
        activePath="/app/dashboard"
      >
        <div className="grid gap-5 sm:gap-6">
          <main className="space-y-5 sm:space-y-6">
            {needsDoseAwareness ? (
              <section className="rounded-[22px] border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-[0_12px_35px_rgba(146,64,14,0.08)]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">Dose timing needs a check-in</p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">{doseRhythm.explanation}</p>
                  </div>
                </div>
              </section>
            ) : null}

            <section className="relative overflow-hidden rounded-[28px] border border-[#E2E8F0]/80 bg-white p-5 shadow-[0_28px_80px_rgba(15,23,42,0.08)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:bg-gradient-to-b before:from-white before:to-transparent sm:p-8">
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
                    <div
                      key={item.label}
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
                      <div className="flex shrink-0 items-center gap-2">
                        <span className={cn("hidden items-center rounded-full border px-3 py-1 text-xs font-semibold sm:inline-flex", style.badge)}>{item.status}</span>
                        <Link href={item.href} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#0B1220] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(11,18,32,0.18)]">
                          {item.action}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
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

          <aside className="space-y-5 sm:space-y-6">
            <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1220] p-5 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7EE6D6]">Primary status</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{primaryStatus.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{primaryStatus.explanation}</p>
              <div className="mt-8 flex items-center gap-5">
                <div className="grid size-28 place-items-center rounded-full bg-white/8 text-center ring-1 ring-white/10">
                  <div>
                    <p className="text-4xl font-semibold">{muscleScore.score}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7EE6D6]">Score</p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">{muscleScore.score} / 100</p>
                  <p className="mt-2 text-sm text-slate-300">{muscleScore.label}</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-white/7 p-4 ring-1 ring-white/10">
                <p className="text-sm font-semibold text-white">Why this score</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{whyScore}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7EE6D6]">Affected by</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{scoreDrivers.join(", ")}.</p>
              </div>
            </section>

            <section className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
                    <Activity className="size-5" />
                  </div>
                  <h2 className="font-semibold tracking-tight text-[#0B1220]">3-day pattern</h2>
                </div>
                <StatusBadge tone={consistencySignal.tone}>{consistencySignal.label}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">{consistencySignal.helper}</p>
              <div className="mt-5 grid gap-3">
                {[
                  { label: "Hydration", value: hydrationPattern.direction, helper: hydrationPattern.goalText },
                  { label: "Protein", value: proteinPattern.direction, helper: proteinPattern.goalText },
                  { label: "Symptoms", value: symptomPattern, helper: symptomBurden ? `${symptomBurden} day${symptomBurden === 1 ? "" : "s"} with moderate or severe symptoms` : "no moderate or severe symptoms logged" },
                ].map((pattern) => (
                  <div key={pattern.label} className="rounded-2xl border border-[#E2E8F0]/80 bg-[#F8FAFC]/75 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#0B1220]">{pattern.label}</p>
                      <p className="text-sm font-semibold text-[#0F766E]">{pattern.value}</p>
                    </div>
                    <p className="mt-1 text-sm text-[#64748B]">{pattern.helper}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[22px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-100">
                  <Dumbbell className="size-5" />
                </div>
                <h2 className="font-semibold tracking-tight text-[#0B1220]">Daily guidance</h2>
              </div>
              <div className="mt-5 space-y-3">
                {patientProfile.guidanceMessages.slice(0, 3).map((message) => (
                  <details key={message.id} className="group rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <summary className="cursor-pointer list-none">
                      <p className="font-semibold text-[#0B1220]">{message.title}</p>
                      <p className="mt-1 leading-6">{guidancePreview(message.message)}</p>
                    </summary>
                    <p className="mt-3 border-t border-slate-200 pt-3 leading-6">{message.message}</p>
                  </details>
                ))}
                {!patientProfile.guidanceMessages.length ? <p className="text-sm text-slate-500">Complete a check-in to generate daily guidance.</p> : null}
              </div>
            </section>
          </aside>
        </div>
      </PatientLayout>
    </div>
  );
}
