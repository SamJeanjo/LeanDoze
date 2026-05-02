"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Clipboard, Mail, RotateCw, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

type InviteType = "CLINIC_TO_PATIENT" | "PATIENT_TO_CLINIC";

type InviteRow = {
  id: string;
  type: InviteType;
  email: string;
  status: string;
  expiresAt: string;
  token: string;
  inviteLink: string;
};

type ApiResult =
  | {
      success: true;
      invite: InviteRow;
      inviteLink: string;
      message: string;
    }
  | {
      success: false;
      code: string;
      message: string;
      invite?: InviteRow;
      inviteLink?: string;
    };

function statusTone(status: string) {
  if (status === "ACCEPTED") {
    return "green";
  }

  if (status === "REVOKED" || status === "EXPIRED") {
    return "navy";
  }

  return "amber";
}

function displayDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function InvitePanel({
  type,
  title,
  eyebrow,
  emailLabel,
  emailPlaceholder,
  buttonLabel,
  emptyState,
  education,
  patientId,
  clinicId,
  initialInvites,
}: {
  type: InviteType;
  title: string;
  eyebrow: string;
  emailLabel: string;
  emailPlaceholder: string;
  buttonLabel: string;
  emptyState: string;
  education: string;
  patientId?: string;
  clinicId?: string;
  initialInvites: InviteRow[];
}) {
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState(initialInvites);
  const [message, setMessage] = useState<{ tone: "success" | "warning" | "error"; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedInviteId, setHighlightedInviteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const latestInviteId = useMemo(() => invites[0]?.id, [invites]);

  async function refreshInvites() {
    const response = await fetch(`/api/invites?type=${type}`, { cache: "no-store" });
    const data = await response.json();

    if (data.success) {
      setInvites(data.invites);
    }
  }

  useEffect(() => {
    if (!highlightedInviteId) {
      return;
    }

    const timeout = window.setTimeout(() => setHighlightedInviteId(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [highlightedInviteId]);

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invitedEmail = email.trim().toLowerCase();

    startTransition(async () => {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, invitedEmail, patientId, clinicId }),
      });
      const result = (await response.json()) as ApiResult;

      if (result.success) {
        setEmail("");
        setMessage({ tone: "success", text: `Invite sent to ${result.invite.email}` });
        await refreshInvites();
        setHighlightedInviteId(result.invite.id);
        return;
      }

      setMessage({
        tone: result.code === "INVITE_ALREADY_PENDING" ? "warning" : "error",
        text: result.message,
      });
      if (result.invite) {
        setHighlightedInviteId(result.invite.id);
      }
      inputRef.current?.focus();
    });
  }

  async function copyLink(invite: InviteRow) {
    await navigator.clipboard.writeText(invite.inviteLink);
    setCopiedId(invite.id);
    window.setTimeout(() => setCopiedId(null), 1400);
  }

  function mutateInvite(id: string, action: "resend" | "revoke") {
    startTransition(async () => {
      const response = await fetch(`/api/invites/${id}/${action}`, { method: "POST" });
      const result = await response.json();

      if (result.success) {
        setMessage({ tone: "success", text: result.message });
        await refreshInvites();
        setHighlightedInviteId(id);
      } else {
        setMessage({ tone: "error", text: result.message ?? "Invite action failed." });
      }
    });
  }

  const messageClass =
    message?.tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : message?.tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[28px] border border-[#E2E8F0]/80 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Mail className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#050816]">{title}</h2>
          </div>
        </div>

        <form onSubmit={submitInvite} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-slate-800">
            {emailLabel}
            <input
              ref={inputRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder={emailPlaceholder}
              className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <button
            disabled={isPending}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Mail className="size-4" />
            {isPending ? "Sending..." : buttonLabel}
          </button>
        </form>

        {message ? <div className={`mt-5 rounded-2xl border p-4 text-sm font-semibold ${messageClass}`}>{message.text}</div> : null}

        <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-6 text-slate-700">
          {education}
        </div>
      </section>

      <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-950">Recent invites</h2>
        <div className="mt-4 space-y-3">
          {invites.map((invite) => {
            const highlighted = highlightedInviteId === invite.id || latestInviteId === invite.id;

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
                <p className="mt-1 text-sm text-slate-500">Expires {displayDate(invite.expiresAt)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyLink(invite)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                  >
                    <Clipboard className="size-3.5" />
                    {copiedId === invite.id ? "Copied" : "Copy link"}
                  </button>
                  {invite.status === "PENDING" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => mutateInvite(invite.id, "resend")}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
                      >
                        <RotateCw className="size-3.5" />
                        Resend
                      </button>
                      <button
                        type="button"
                        onClick={() => mutateInvite(invite.id, "revoke")}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-50"
                      >
                        <XCircle className="size-3.5" />
                        Revoke
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
          {!invites.length ? (
            <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              {emptyState}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

