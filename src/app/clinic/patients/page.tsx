import Link from "next/link";
import { UserPlus } from "lucide-react";
import { DashboardShell, Footer } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

export default async function ClinicPatientsPage() {
  const { patients } = await getClinicAppState();

  return (
    <div>
      <DashboardShell
        eyebrow="Clinic Patients"
        title="Patients who granted access."
        description="Clinics only see patient records after an accepted invite creates PatientAccess."
        action={
          <Link href="/clinic/invite-patient" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#0B1220] px-5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800">
            <UserPlus className="size-4" />
            Invite patient
          </Link>
        }
        activePath="/clinic/patients"
      >
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Patient list</h2>
              <p className="mt-1 text-sm text-slate-500">Active access, adherence, symptom alerts, and reports.</p>
            </div>
            <StatusBadge tone="mint">{patients.length} active access grants</StatusBadge>
          </div>
          <div className="mt-5 grid gap-3">
            {patients.map((patient) => {
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
                No patients are visible until PatientAccess exists.
              </div>
            ) : null}
          </div>
        </section>
      </DashboardShell>
      <Footer />
    </div>
  );
}
