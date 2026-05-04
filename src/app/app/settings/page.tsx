import { ShieldCheck } from "lucide-react";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { getPatientAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function PatientSettingsPage() {
  const { patientProfile } = await getPatientAppState();

  return (
    <PatientLayout
      eyebrow="Settings"
      title="Your patient profile."
      description="Manage the basics for your LeanDoze patient app and review who can access your progress."
      activePath="/app/settings"
    >
      <div className="space-y-6">
        <NotificationSettings />
        <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Access control</h2>
              <p className="mt-1 text-sm text-[#64748B]">Patients own their LeanDoze profile.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {(patientProfile?.accessGrants ?? []).map((access) => (
              <div key={access.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{access.clinic.name}</p>
                <StatusBadge tone="green">{access.role}</StatusBadge>
              </div>
            ))}
            {!patientProfile?.accessGrants.length ? <p className="text-sm text-slate-500">No clinics currently have access.</p> : null}
          </div>
        </section>
      </div>
    </PatientLayout>
  );
}
