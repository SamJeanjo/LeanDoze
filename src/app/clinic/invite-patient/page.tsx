import { Mail, UsersRound } from "lucide-react";
import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { invitePatientAction } from "@/lib/app-actions";
import { getClinicAppState } from "@/lib/app-data";

export const dynamic = "force-dynamic";

export default async function InvitePatientPage() {
  const { db, membership } = await getClinicAppState();
  const invites = membership
    ? await db.patientInvite.findMany({
        where: { clinicId: membership.clinicId },
        orderBy: { createdAt: "desc" },
        take: 8,
      })
    : [];

  return (
    <div>
      <ClinicLayout
        eyebrow="Invite Patient"
        title="Connect a patient to your clinic."
        description="Patients must accept the invite before their dashboard, reports, or risk flags become visible."
        action={<StatusBadge tone="mint">Access required</StatusBadge>}
        activePath="/clinic/invite-patient"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                <UsersRound className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Patient access</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Invite a patient</h2>
              </div>
            </div>

            <form action={invitePatientAction} className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Patient email
                <input name="email" type="email" required placeholder="patient@example.com" className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" />
              </label>
              <button className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                <Mail className="size-4" />
                Send patient invite
              </button>
            </form>
          </section>

          <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-950">Recent patient invites</h2>
            <div className="mt-4 space-y-3">
              {invites.map((invite) => (
                <div key={invite.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{invite.email}</p>
                    <StatusBadge tone={invite.status === "ACCEPTED" ? "green" : "amber"}>{invite.status}</StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Expires {invite.expiresAt.toLocaleDateString()}</p>
                </div>
              ))}
              {!invites.length ? <p className="text-sm text-slate-500">No patient invites yet.</p> : null}
            </div>
          </aside>
        </div>
      </ClinicLayout>
    </div>
  );
}
