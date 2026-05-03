import { ClinicLayout } from "@/components/layout";
import { ClinicReportsAnalytics } from "@/components/reports/ClinicReportsAnalytics";

export const dynamic = "force-dynamic";

export default function ClinicReportsPage() {
  return (
    <ClinicLayout
      eyebrow="Analytics"
      title="Clinic reporting command center."
      description="Dynamic GLP-1 tracking reports for patient progress, side effects, adherence, medication groups, and follow-up signals."
      activePath="/clinic/reports"
    >
      <ClinicReportsAnalytics />
    </ClinicLayout>
  );
}
