import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Footer, Navbar } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { acceptInviteAction } from "@/lib/app-actions";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function InviteAcceptPage({ params }: { params: { token: string } }) {
  const invite = await getDb().patientInvite.findUnique({
    where: { token: params.token },
    include: { clinic: true, patient: { include: { user: true } } },
  });
  const isClinicInvite = invite?.type === "CLINIC_TO_PATIENT";
  const unavailable = !invite || invite.status !== "PENDING" || invite.expiresAt < new Date();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220]">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-16rem)] max-w-4xl items-center px-6 py-16">
        <section className="w-full rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#0F766E]">Secure Invite</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#050816]">
                {unavailable ? "Invite link unavailable." : "Review access before accepting."}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                {unavailable
                  ? "This token may be expired, revoked, accepted, or invalid. Request a new invite from the patient or clinic."
                  : "Accepting creates PatientAccess. Patients own their LeanDoze profile and can revoke clinic access later."}
              </p>
            </div>
            <div className="grid size-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <ShieldCheck className="size-6" />
            </div>
          </div>

          {invite ? (
            <div className="mt-8 grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Invite type</p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {isClinicInvite ? `Clinic invited ${invite.email}` : `Patient invited ${invite.email}`}
                  </p>
                </div>
                <StatusBadge tone={invite.status === "PENDING" ? "amber" : "green"}>{invite.status}</StatusBadge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Workspace</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {invite.clinic?.name ?? invite.patient?.user.email ?? "LeanDoze access"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Safety note</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  LeanDoze shares tracking context and reports only. It does not diagnose, treat, prescribe, or
                  recommend dose changes. Review this with your clinician.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <form action={acceptInviteAction}>
              <input type="hidden" name="token" value={params.token} />
              <button disabled={unavailable} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
                <CheckCircle2 className="size-4" />
                Accept invite
              </button>
            </form>
            <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50">
              Back to LeanDoze
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
