import Link from "next/link";
import { Activity, AlertTriangle, CalendarCheck, ClipboardList, MessageSquarePlus, UserPlus, UsersRound } from "lucide-react";
import { MetricCard } from "@/components/cards";
import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { addClinicPatientNoteAction, markPatientRiskFlagsReviewedAction } from "@/lib/app-actions";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

type ClinicPatient = Awaited<ReturnType<typeof getClinicAppState>>["patients"][number];

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

function priorityForPatient(patient: ClinicPatient) {
  const levels = patient.riskFlags.map((flag) => flag.level);

  if (levels.includes("URGENT") || levels.includes("HIGH")) {
    return "HIGH";
  }

  if (levels.includes("MEDIUM")) {
    return "MEDIUM";
  }

  if (levels.includes("LOW") || levels.includes("INFO")) {
    return "LOW";
  }

  return "STABLE";
}

function priorityTone(priority: string) {
  if (priority === "HIGH") {
    return "coral";
  }

  if (priority === "MEDIUM") {
    return "amber";
  }

  return "navy";
}

function recentActivityFor(patient: ClinicPatient) {
  const name = patientName(patient);
  const latestCheckIn = patient.dailyCheckIns[0];
  const latestSymptom = patient.symptomLogs[0];
  const missedDose = patient.doseLogs.find((dose) => dose.missed);

  return [
    latestCheckIn
      ? {
          id: `${patient.id}-checkin-${latestCheckIn.id}`,
          label: "Check-in",
          text: `${name} logged energy ${latestCheckIn.energyLevel ?? "-"} / 10`,
          date: latestCheckIn.checkInDate,
          href: `/clinic/patients/${patient.id}`,
        }
      : null,
    latestSymptom
      ? {
          id: `${patient.id}-symptom-${latestSymptom.id}`,
          label: "Symptoms",
          text: `${name}: nausea ${latestSymptom.nausea.toLowerCase()}, reflux ${latestSymptom.reflux.toLowerCase()}`,
          date: latestSymptom.loggedAt,
          href: `/clinic/patients/${patient.id}`,
        }
      : null,
    missedDose
      ? {
          id: `${patient.id}-dose-${missedDose.id}`,
          label: "Missed dose",
          text: `${name} has a missed dose log`,
          date: missedDose.scheduledDate,
          href: `/clinic/patients/${patient.id}`,
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; label: string; text: string; date: Date; href: string }>;
}

function PatientQueueRow({ patient, priority }: { patient: ClinicPatient; priority: "HIGH" | "MEDIUM" | "LOW" }) {
  const plan = patient.medicationPlans[0];
  const flag = patient.riskFlags[0];
  const latestCheckIn = patient.dailyCheckIns[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.8fr_0.8fr_1.35fr] xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/clinic/patients/${patient.id}`} className="font-semibold text-slate-950 transition hover:text-[#0F766E]">
              {patientName(patient)}
            </Link>
            <StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{flag?.title ?? "Open review item"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Plan</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{plan ? `${plan.medication} ${plan.doseMg}mg` : "No plan"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Last check-in</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{latestCheckIn ? latestCheckIn.checkInDate.toLocaleDateString() : "No check-in"}</p>
        </div>
        <div className="flex flex-wrap gap-2 xl:justify-end">
          <Link href={`/clinic/patients/${patient.id}`} className="inline-flex h-9 items-center rounded-full bg-slate-950 px-3 text-xs font-semibold text-white transition hover:bg-slate-800">
            View patient
          </Link>
          <Link href="/clinic/reports" className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            View report
          </Link>
          <form action={markPatientRiskFlagsReviewedAction}>
            <input type="hidden" name="patientId" value={patient.id} />
            <button className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
              Mark reviewed
            </button>
          </form>
          <details className="w-full xl:w-auto">
            <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
              <MessageSquarePlus className="size-3.5" />
              Add note
            </summary>
            <form action={addClinicPatientNoteAction} className="mt-3 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 xl:min-w-72">
              <input type="hidden" name="patientId" value={patient.id} />
              <textarea name="note" required placeholder="Add a clinic note..." className="min-h-20 rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-300 focus:ring-4 focus:ring-teal-100" />
              <button className="h-9 rounded-full bg-[#0B1220] px-3 text-xs font-semibold text-white">Save note</button>
            </form>
          </details>
        </div>
      </div>
    </div>
  );
}

export default async function ClinicDashboard() {
  const { clinic, patients } = await getClinicAppState();
  const alerts = patients.reduce((sum, patient) => sum + patient.riskFlags.length, 0);
  const missedDosePatients = patients.filter((patient) => patient.doseLogs.some((dose) => dose.missed) || patient.riskFlags.some((flag) => flag.source === "missed-dose")).length;
  const severityCounts = {
    urgent: patients.reduce((sum, patient) => sum + patient.riskFlags.filter((flag) => flag.level === "URGENT").length, 0),
    high: patients.reduce((sum, patient) => sum + patient.riskFlags.filter((flag) => flag.level === "HIGH").length, 0),
    medium: patients.reduce((sum, patient) => sum + patient.riskFlags.filter((flag) => flag.level === "MEDIUM").length, 0),
    low: patients.reduce((sum, patient) => sum + patient.riskFlags.filter((flag) => flag.level === "LOW" || flag.level === "INFO").length, 0),
  };
  const priorityGroups = {
    HIGH: patients.filter((patient) => priorityForPatient(patient) === "HIGH"),
    MEDIUM: patients.filter((patient) => priorityForPatient(patient) === "MEDIUM"),
    LOW: patients.filter((patient) => priorityForPatient(patient) === "LOW"),
  };
  const stablePatients = patients.filter((patient) => priorityForPatient(patient) === "STABLE");
  const recentActivity = patients.flatMap(recentActivityFor).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 8);

  return (
    <ClinicLayout
      eyebrow="Clinic Dashboard"
      title={clinic ? `${clinic.name} attention queue.` : "Create your clinic workspace."}
      description="Scan connected patients by priority, review recent logs, and document follow-up without changing patient-owned access."
      action={
        <Link href="/clinic/invite-patient" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800">
          <UserPlus className="size-4" />
          Invite patient
        </Link>
      }
      activePath="/clinic/dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Connected patients" value={`${patients.length}`} helper="active PatientAccess grants" progress={Math.min(100, patients.length * 10)} icon={UsersRound} />
        <MetricCard label="Risk flags" value={`${alerts}`} helper={`Open flags: ${severityCounts.urgent} urgent, ${severityCounts.high} high, ${severityCounts.medium} medium, ${severityCounts.low} low.`} progress={Math.min(100, alerts * 12)} icon={AlertTriangle} tone={alerts ? "coral" : "mint"} />
        <MetricCard label="Missed doses" value={`${missedDosePatients}`} helper="Detected from patient dose logs or dose-related risk flags." progress={Math.min(100, missedDosePatients * 18)} icon={CalendarCheck} tone={missedDosePatients ? "coral" : "green"} />
        <MetricCard label="Recent activity" value={`${recentActivity.length}`} helper="latest check-ins, symptom changes, and missed dose logs" progress={Math.min(100, recentActivity.length * 12)} icon={Activity} tone="navy" />
      </div>

      {!patients.length ? (
        <section className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">No patients connected yet.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Invite a patient to create PatientAccess. Patients stay hidden until they accept.
          </p>
          <Link href="/clinic/invite-patient" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800">
            <UserPlus className="size-4" />
            Invite patient
          </Link>
        </section>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
          <section id="risk-flags" className="space-y-4">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((priority) => (
              <div key={priority} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">{priority} priority</h2>
                    <p className="mt-1 text-sm text-slate-500">{priorityGroups[priority].length} patient{priorityGroups[priority].length === 1 ? "" : "s"} in this queue</p>
                  </div>
                  <StatusBadge tone={priorityTone(priority)}>{priority}</StatusBadge>
                </div>
                <div className="mt-4 grid gap-3">
                  {priorityGroups[priority].map((patient) => (
                    <PatientQueueRow key={patient.id} patient={patient} priority={priority} />
                  ))}
                  {!priorityGroups[priority].length ? (
                    <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No patients in this priority.</p>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Stable patients</h2>
                  <p className="mt-1 text-sm text-slate-500">Connected patients without open flags.</p>
                </div>
                <StatusBadge tone="green">{stablePatients.length} stable</StatusBadge>
              </div>
              <div className="mt-4 grid gap-2">
                {stablePatients.slice(0, 8).map((patient) => (
                  <Link key={patient.id} href={`/clinic/patients/${patient.id}`} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
                    <div>
                      <p className="font-semibold text-slate-950">{patientName(patient)}</p>
                      <p className="mt-1 text-sm text-slate-500">{patient.medicationPlans[0] ? `${patient.medicationPlans[0].medication} ${patient.medicationPlans[0].doseMg}mg` : "No medication plan yet"}</p>
                    </div>
                    <StatusBadge tone="green">Stable</StatusBadge>
                    <span className="text-sm font-semibold text-slate-700">Open</span>
                  </Link>
                ))}
                {!stablePatients.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No stable patients to show yet.</p> : null}
              </div>
            </div>
          </section>

          <aside className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
                <ClipboardList className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-950">Recent activity</h2>
                <p className="text-sm text-slate-500">Latest connected patient signals</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              {recentActivity.map((item) => (
                <Link key={item.id} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0F766E]">{item.label}</p>
                    <p className="text-xs font-semibold text-slate-400">{item.date.toLocaleDateString()}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.text}</p>
                </Link>
              ))}
              {!recentActivity.length ? <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No recent activity yet.</p> : null}
            </div>
          </aside>
        </div>
      )}
    </ClinicLayout>
  );
}
