import { ShieldCheck } from "lucide-react";
import { InvitePanel } from "@/components/invites/invite-panel";
import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { revokePatientAccessAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";
import { toInviteDto } from "@/lib/invite-service";

export const dynamic = "force-dynamic";

export default async function InviteDoctorPage() {
  const { db, patientProfile } = await getPatientAppState();
  const invites = patientProfile
    ? await db.patientInvite.findMany({
        where: { patientId: patientProfile.id },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
    : [];

  return (
    <div>
      <PatientLayout
        eyebrow="Invite Doctor"
        title="Share your LeanDoze progress securely."
        description="Invite a clinician or clinic by email. You stay in control and can revoke access at any time."
        action={<StatusBadge tone="mint">Patient-owned profile</StatusBadge>}
        activePath="/app/invite-doctor"
      >
        <div className="grid gap-6">
          <InvitePanel
            type="PATIENT_TO_CLINIC"
            title="Invite a doctor or clinic"
            eyebrow="Secure invite"
            emailLabel="Clinician or clinic email"
            emailPlaceholder="doctor@clinic.com"
            buttonLabel="Create secure invite"
            emptyState="No invites sent yet."
            education="Accepting this invite creates PatientAccess for the clinic. LeanDoze does not provide diagnosis, treatment, or prescribing advice."
            patientId={patientProfile?.id}
            initialInvites={invites.map(toInviteDto)}
          />

          <aside className="space-y-5">
            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-teal-700" />
                <h2 className="font-semibold text-slate-950">Access you control</h2>
              </div>
              <div className="mt-5 space-y-3">
                {(patientProfile?.accessGrants ?? []).map((access) => (
                  <div key={access.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-950">{access.clinic.name}</p>
                      <StatusBadge tone="green">{access.role}</StatusBadge>
                    </div>
                    <form action={revokePatientAccessAction}>
                      <input type="hidden" name="clinicId" value={access.clinicId} />
                      <button className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">
                        Revoke access
                      </button>
                    </form>
                  </div>
                ))}
                {!patientProfile?.accessGrants.length ? <p className="text-sm text-slate-500">No active clinic access yet.</p> : null}
              </div>
            </section>
          </aside>
        </div>
      </PatientLayout>
    </div>
  );
}
