import { Building2 } from "lucide-react";
import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function ClinicSettingsPage() {
  const { clinic, membership } = await getClinicAppState();

  return (
    <ClinicLayout
      eyebrow="Clinic Settings"
      title={clinic ? clinic.name : "Clinic workspace"}
      description="Manage the clinic workspace used for patient access and operational review."
      activePath="/clinic/settings"
    >
      <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_12px_35px_rgba(15,23,42,0.055)]">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-[#0F766E] ring-1 ring-teal-100">
            <Building2 className="size-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Workspace</h2>
            <p className="mt-1 text-sm text-[#64748B]">Clinic staff can only review patients after PatientAccess exists.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-950">Clinic:</span> {clinic?.name ?? "Not created"}
          </p>
          <p>
            <span className="font-semibold text-slate-950">Role:</span> <StatusBadge tone="mint">{membership?.role ?? "None"}</StatusBadge>
          </p>
        </div>
      </section>
    </ClinicLayout>
  );
}
