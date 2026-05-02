import { ClinicLayout } from "@/components/layout";
import { StatusBadge } from "@/components/status-badge";
import { InvitePatientPanel } from "@/components/clinic/invite-patient-panel";
import { getClinicAppState } from "@/lib/app-data";

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3010");

  return (
    <div>
      <ClinicLayout
        eyebrow="Invite Patient"
        title="Connect a patient to your clinic."
        description="Patients must accept the invite before their dashboard, reports, or risk flags become visible."
        action={<StatusBadge tone="mint">Access required</StatusBadge>}
        activePath="/clinic/invite-patient"
      >
        <InvitePatientPanel
          baseUrl={baseUrl}
          invites={latestInvitesByEmail.map((invite) => ({
            id: invite.id,
            email: invite.email,
            status: invite.status,
            expiresAt: invite.expiresAt.toLocaleDateString(),
            token: invite.token,
          }))}
        />
      </ClinicLayout>
    </div>
  );
}
