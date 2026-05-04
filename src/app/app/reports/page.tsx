import { Download, Share2 } from "lucide-react";
import { ClinicianReportPreview } from "@/components/patient/ClinicianReportPreview";
import { PatientShell } from "@/components/patient/PatientShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { dailyLogsMock, patientProfileMock } from "@/lib/mockPatientData";

export const dynamic = "force-dynamic";

export default function PatientReportsPage() {
  return (
    <PatientShell active="report">
      <div className="ld-page-enter space-y-6">
        <PageHeader
          eyebrow="Reports"
          title="Your next visit, already organized."
          description="Preview your 14/30-day summary, symptom notes, adherence patterns, and questions for your clinician."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(7,17,31,0.18)] transition hover:-translate-y-0.5">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#07111F] ring-1 ring-[#E2E8F0] transition hover:-translate-y-0.5">
                <Share2 className="h-4 w-4" />
                Share with clinic
              </button>
            </div>
          }
        />

        <ClinicianReportPreview profile={patientProfileMock} logs={dailyLogsMock} full />

        <PremiumCard className="bg-[#FFF7ED]">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-800">Review note</p>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice. Review this report with your clinician.
          </p>
        </PremiumCard>
      </div>
    </PatientShell>
  );
}
