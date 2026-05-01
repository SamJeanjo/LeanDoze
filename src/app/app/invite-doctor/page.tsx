import { Mail, ShieldCheck } from "lucide-react";
import { PatientLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { inviteDoctorAction, revokePatientAccessAction } from "@/lib/app-actions";
import { getPatientAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function InviteDoctorPage() {
  const { db, patientProfile } = await getPatientAppState();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3010");
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
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Secure invite</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Invite a doctor or clinic</h2>
              </div>
            </div>

            <form action={inviteDoctorAction} className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Clinician or clinic email
                <input name="email" type="email" required placeholder="doctor@clinic.com" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <button className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                Create secure invite
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-6 text-slate-700">
              Accepting this invite creates PatientAccess for the clinic. LeanDoze does not provide diagnosis,
              treatment, or prescribing advice.
            </div>
          </section>

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

            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-950">Recent invites</h2>
              <div className="mt-4 space-y-3">
                {invites.map((invite) => (
                  <div key={invite.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{invite.email}</p>
                      <StatusBadge tone={invite.status === "ACCEPTED" ? "green" : "amber"}>{invite.status}</StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Expires {invite.expiresAt.toLocaleDateString()}</p>
                    <code className="mt-3 block overflow-hidden rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                      {baseUrl}/invite/{invite.token}
                    </code>
                  </div>
                ))}
                {!invites.length ? <p className="text-sm text-slate-500">No invites sent yet.</p> : null}
              </div>
            </section>
          </aside>
        </div>
      </PatientLayout>
    </div>
  );
}
