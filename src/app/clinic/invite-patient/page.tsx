import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { InvitePanel } from "@/components/invites/invite-panel";
import { getClinicAppState } from "@/lib/app-data";
import { toInviteDto } from "@/lib/invite-service";

export const dynamic = "force-dynamic";

export default async function InvitePatientPage() {
  const { db, membership } = await getClinicAppState();
  const allInvites = membership
    ? await db.patientInvite.findMany({
        where: { clinicId: membership.clinicId },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];
  const latestInvitesByEmail = Array.from(
    allInvites
      .reduce((map, invite) => {
        if (!map.has(invite.email)) {
          map.set(invite.email, invite);
        }

        return map;
      }, new Map<string, (typeof allInvites)[number]>())
      .values(),
  ).slice(0, 8);

  return (
    <div>
      <ClinicLayout
        eyebrow="Invite Patient"
        title="Connect a patient to your clinic."
        description="Patients must accept the invite before their dashboard, reports, or risk flags become visible."
        action={<StatusBadge tone="mint">Access required</StatusBadge>}
        activePath="/clinic/invite-patient"
      >
        <InvitePanel
          type="CLINIC_TO_PATIENT"
          title="Invite a patient"
          eyebrow="Patient access"
          emailLabel="Patient email"
          emailPlaceholder="patient@example.com"
          buttonLabel="Send patient invite"
          emptyState="No patient invites yet. Send your first invite to connect a patient."
          education="Patients must accept before your clinic can see their dashboard, reports, or risk flags."
          clinicId={membership?.clinicId}
          initialInvites={latestInvitesByEmail.map(toInviteDto)}
        />
      </ClinicLayout>
    </div>
  );
}
