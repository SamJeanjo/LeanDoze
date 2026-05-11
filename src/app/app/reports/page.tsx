import { CalendarDays, Download, HeartPulse, LineChart, LockKeyhole, Share2, ShieldCheck } from "lucide-react";
import { PatientUpgradeCard } from "@/components/billing/PatientUpgradeCard";
import { ClinicConnectionCard } from "@/components/patient/ClinicConnectionCard";
import { ClinicianReportPreview } from "@/components/patient/ClinicianReportPreview";
import { PatientShell } from "@/components/patient/PatientShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientReportsPage() {
  const reportSections = [
    { label: "Dose timeline", value: "14 / 30 day view", icon: CalendarDays },
    { label: "Symptoms by dose day", value: "Timing + severity", icon: HeartPulse },
    { label: "Adherence and trends", value: "Dose, weight, protein, hydration", icon: LineChart },
    { label: "Consent-first sharing", value: "Export, share, revoke", icon: LockKeyhole },
  ];

  return (
    <PatientShell active="report">
      <div className="ld-page-enter space-y-6">
        <PageHeader
          eyebrow="Reports"
          title="Clinician-ready PDF, polished for the visit."
          description="Preview a branded report with dose timeline, symptoms by dose day, adherence, weight, protein, hydration, and questions for your clinician."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#14B8A6] px-5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#0F9F95]">
                <Share2 className="h-4 w-4" />
                Share with clinic
              </button>
            </div>
          }
        />

        <section className="grid gap-4 md:grid-cols-2">
          {reportSections.map((section) => {
            const Icon = section.icon;

            return (
              <PremiumCard key={section.label} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#07111F]">{section.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#64748B]">{section.value}</p>
                  </div>
                </div>
              </PremiumCard>
            );
          })}
        </section>

        <ClinicianReportPreview profile={patientProfileMock} logs={dailyLogsMock} full />
        <PatientUpgradeCard />
        <ClinicConnectionCard variant="report" />

        <PremiumCard className="bg-[#07111F] text-white">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#7DD3C7]/15 text-[#7DD3C7] ring-1 ring-[#7DD3C7]/30">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7DD3C7]">Review note</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice. Review this report with your clinician.
              </p>
            </div>
          </div>
        </PremiumCard>
      </div>
    </PatientShell>
  );
}
