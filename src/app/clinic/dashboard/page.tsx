import Link from "next/link";
import { Activity, AlertTriangle, CalendarCheck, UserPlus, UsersRound } from "lucide-react";
import { MetricCard } from "@/components/cards";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

export default async function ClinicDashboard() {
  const { clinic, patients } = await getClinicAppState();
  const alerts = patients.reduce((sum, patient) => sum + patient.riskFlags.length, 0);
  const missedDosePatients = patients.filter((patient) => patient.riskFlags.some((flag) => flag.source === "dose-log")).length;

  return (
    <div>
      <DashboardShell
        eyebrow="Clinic Dashboard"
        title={clinic ? `${clinic.name} patient monitoring.` : "Create your clinic workspace."}
        description="Only patients who have granted access through LeanDoze PatientAccess appear here."
        action={
          <Link href="/clinic/invite-patient" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800">
            <UserPlus className="size-4" />
            Invite patient
          </Link>
        }
        activePath="/clinic/dashboard"
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Connected patients" value={`${patients.length}`} helper="active access grants" progress={Math.min(100, patients.length * 10)} icon={UsersRound} />
          <MetricCard label="Risk flags" value={`${alerts}`} helper="open clinician review" progress={Math.min(100, alerts * 12)} icon={AlertTriangle} tone={alerts ? "coral" : "mint"} />
          <MetricCard label="Missed doses" value={`${missedDosePatients}`} helper="patients with dose flags" progress={Math.min(100, missedDosePatients * 18)} icon={CalendarCheck} tone={missedDosePatients ? "coral" : "green"} />
          <MetricCard label="Visibility" value="Access" helper="PatientAccess enforced" progress={100} icon={Activity} tone="navy" />
        </div>

        <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Connected patient list</h2>
              <p className="mt-1 text-sm text-slate-500">
                Filtered by active PatientAccess. Revoked or unaccepted patients stay hidden.
              </p>
            </div>
            <Link href="/clinic/patients" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {patients.slice(0, 4).map((patient) => {
              const plan = patient.medicationPlans[0];
              const latestWeight = patient.weightLogs[0];
              return (
                <Link key={patient.id} href={`/clinic/patients/${patient.id}`} className="grid gap-5 rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-[1.3fr_0.8fr_0.8fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-950">{patientName(patient)}</h3>
                      <StatusBadge tone={patient.riskFlags.length ? "amber" : "green"}>{patient.riskFlags.length ? "Review" : "On track"}</StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{plan ? `${plan.medication} ${plan.doseMg}mg` : "No medication plan yet"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Weight</p>
                    <p className="mt-1 font-semibold text-slate-900">{latestWeight ? `${latestWeight.weightLb} lb` : "No log"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Flags</p>
                    <p className="mt-1 font-semibold text-slate-900">{patient.riskFlags.length}</p>
                  </div>
                  <span className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white">View Patient</span>
                </Link>
              );
            })}
            {!patients.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
                No connected patients yet. Invite a patient to create PatientAccess.
              </div>
            ) : null}
          </div>
        </section>
      </DashboardShell>
      <Footer />
    </div>
  );
}
