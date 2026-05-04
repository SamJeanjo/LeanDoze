import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";

export type ClinicConnectionStatus = "not_connected" | "pending" | "connected";

export type ClinicConnection = {
  status: ClinicConnectionStatus;
  clinicName?: string;
  clinicianName?: string;
  connectionDate?: string;
};

const defaultConnection: ClinicConnection = {
  status: "connected",
  clinicName: "Montreal Wellness Clinic",
  clinicianName: "Dr. Sarah Patel",
  connectionDate: "2026-04-18",
};

export function ClinicConnectionCard({
  connection = defaultConnection,
  variant = "compact",
}: {
  connection?: ClinicConnection;
  variant?: "compact" | "report";
}) {
  if (variant === "report") {
    return <ClinicConnectionReport connection={connection} />;
  }

  const connected = connection.status === "connected";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-[0_12px_34px_rgba(15,23,42,0.045)]">
      {connected ? (
        <div className="flex min-w-0 items-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22C55E]" />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[-0.015em] text-[#07111F]">Connected</p>
            <p className="truncate text-xs leading-5 text-slate-500">{connection.clinicName ?? "Clinic"}</p>
          </div>
        </div>
      ) : (
        <Link href="/app/reports" className="flex min-h-10 items-center gap-3 text-sm font-semibold text-slate-700 transition hover:text-[#0F766E]">
          <Building2 className="h-4 w-4 text-slate-400" />
          Connect with your clinic
        </Link>
      )}
    </div>
  );
}

function ClinicConnectionReport({ connection }: { connection: ClinicConnection }) {
  const connected = connection.status === "connected";
  const date = connection.connectionDate ? new Date(connection.connectionDate).toLocaleDateString() : "Not connected";

  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">Clinic connection</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#07111F]">
            {connected ? connection.clinicName : "Connect with your doctor or clinic"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {connected ? connection.clinicianName : "Share reports when you choose."}
          </p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]/70">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <InfoTile label="Clinic" value={connected ? (connection.clinicName ?? "Clinic") : "Not connected"} />
        <InfoTile label="Clinician" value={connected ? (connection.clinicianName ?? "Not assigned") : "Not assigned"} />
        <InfoTile label="Connection date" value={date} />
      </div>

      <div className="mt-6 rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-slate-600 ring-1 ring-slate-200/70">
        You choose when to share your reports. LeanDoze does not automatically send report data to a clinic.
      </div>

      <Link
        href="/app/invite-doctor"
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        Manage connection
      </Link>
    </section>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#07111F]">{value}</p>
    </div>
  );
}
