import { Download, Share2 } from "lucide-react";
import { ClinicConnectionCard } from "@/components/patient/ClinicConnectionCard";
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

        <ClinicianReportPreview profile={patientProfileMock} logs={dailyLogsMock} full />
        <ClinicConnectionCard variant="report" />

        <PremiumCard>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0F766E]">Review note</p>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice. Review this report with your clinician.
          </p>
        </PremiumCard>
      </div>
    </PatientShell>
  );
}
