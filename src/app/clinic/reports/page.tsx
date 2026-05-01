import Link from "next/link";
import { FileText } from "lucide-react";
import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

export default async function ClinicReportsPage() {
  const { patients } = await getClinicAppState();

  return (
    <ClinicLayout
      eyebrow="Clinic Reports"
      title="Clinic-ready patient summaries."
      description="Reports are available only for patients with active PatientAccess. Use them for review, not diagnosis or prescribing."
      activePath="/clinic/reports"
    >
      <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Patient reports</h2>
            <p className="mt-1 text-sm text-slate-500">Fast access to generated summaries.</p>
          </div>
          <StatusBadge tone="mint">{patients.length} visible patients</StatusBadge>
        </div>
        <div className="mt-5 grid gap-3">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/clinic/patients/${patient.id}`} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-white text-[#0F766E] ring-1 ring-slate-200">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{patientName(patient)}</p>
                  <p className="text-sm text-slate-500">{patient.medicationPlans[0]?.medication ?? "No active plan"}</p>
                </div>
              </div>
              <StatusBadge tone={patient.riskFlags.length ? "amber" : "green"}>{patient.riskFlags.length ? "Review" : "Stable"}</StatusBadge>
              <span className="text-sm font-semibold text-slate-700">Open patient</span>
            </Link>
          ))}
          {!patients.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-600">
              No reports are visible until patients grant access.
            </div>
          ) : null}
        </div>
      </section>
    </ClinicLayout>
  );
}
