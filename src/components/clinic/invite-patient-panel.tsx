"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Clipboard, Mail, RotateCw, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import {
  invitePatientAction,
  type InvitePatientState,
  resendPatientInviteAction,
  revokePatientInviteAction,
} from "@/lib/app-actions";

type InviteRow = {
  id: string;
  email: string;
  status: string;
  expiresAt: string;
  token: string;
};

const initialState: InvitePatientState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      <Mail className="size-4" />
      {pending ? "Sending invite..." : "Send patient invite"}
    </button>
  );
}

function statusTone(status: string) {
  if (status === "ACCEPTED") {
    return "green";
  }

  if (status === "REVOKED" || status === "EXPIRED") {
    return "navy";
  }

  return "amber";
}

export function InvitePatientPanel({
  invites,
  baseUrl,
}: {
  invites: InviteRow[];
  baseUrl: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useFormState(invitePatientAction, initialState);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedInviteId, setHighlightedInviteId] = useState<string | null>(null);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      formRef.current?.reset();
    } else if (state.email) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(state.email.length, state.email.length);
    }

    if (state.inviteId) {
      setHighlightedInviteId(state.inviteId);
      const timeout = window.setTimeout(() => setHighlightedInviteId(null), 1800);
      return () => window.clearTimeout(timeout);
    }
  }, [state]);

  const messageTone = state.success ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-800";
  const latestInviteId = useMemo(() => invites[0]?.id, [invites]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Mail className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Patient access</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">Invite a patient</h2>
          </div>
        </div>

        <form ref={formRef} action={formAction} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            Patient email
            <input
              ref={inputRef}
              name="email"
              type="email"
              required
              placeholder="patient@example.com"
              defaultValue={!state.success ? state.email : ""}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <SubmitButton />
        </form>

        {state.message ? (
          <div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${messageTone}`}>
            {state.message}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-6 text-slate-700">
          Patients must accept before your clinic can see their dashboard, reports, or risk flags.
        </div>
      </section>

      <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">Recent patient invites</h2>
        <div className="mt-4 space-y-3">
          {invites.map((invite) => {
            const inviteLink = `${baseUrl}/invite/${invite.token}`;
            const highlighted = highlightedInviteId === invite.id || (state.success && latestInviteId === invite.id);

            return (
              <div
                key={invite.id}
                className={`rounded-2xl border bg-slate-50 p-4 transition duration-500 ${
                  highlighted ? "border-teal-300 shadow-[0_0_0_4px_rgba(20,184,166,0.12)]" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{invite.email}</p>
                  <StatusBadge tone={statusTone(invite.status)}>{invite.status}</StatusBadge>
                </div>
                <p className="mt-1 text-sm text-slate-500">Expires {invite.expiresAt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteLink);
                      setCopiedId(invite.id);
                      window.setTimeout(() => setCopiedId(null), 1400);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    <Clipboard className="size-3.5" />
                    {copiedId === invite.id ? "Copied" : "Copy link"}
                  </button>
                  {invite.status === "PENDING" ? (
                    <>
                      <form action={resendPatientInviteAction}>
                        <input type="hidden" name="inviteId" value={invite.id} />
                        <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50">
                          <RotateCw className="size-3.5" />
                          Resend
                        </button>
                      </form>
                      <form action={revokePatientInviteAction}>
                        <input type="hidden" name="inviteId" value={invite.id} />
                        <button className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50">
                          <XCircle className="size-3.5" />
                          Revoke
                        </button>
                      </form>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
          {!invites.length ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              No patient invites yet. Send your first invite to connect a patient.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
