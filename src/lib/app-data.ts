import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const reportDisclaimer =
  "LeanDoze does not provide medical advice. Review this report with your clinician.";

export async function getOrCreateCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@leandoze.local`;
  const firstName = clerkUser?.firstName ?? null;
  const lastName = clerkUser?.lastName ?? null;
  const db = getDb();

  const user = await db.user.upsert({
    where: { id: userId },
    update: { email, firstName, lastName },
    create: { id: userId, email, firstName, lastName },
    include: {
      patientProfile: {
        include: {
          medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
          weightLogs: { orderBy: { loggedAt: "desc" }, take: 8 },
          nutritionLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          hydrationLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          symptomLogs: { orderBy: { loggedAt: "desc" }, take: 5 },
          dailyCheckIns: { orderBy: { checkInDate: "desc" }, take: 7 },
          riskFlags: { where: { resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 5 },
          guidanceMessages: { orderBy: [{ priority: "desc" }, { createdAt: "desc" }], take: 6 },
          doctorReports: { orderBy: { createdAt: "desc" }, take: 5 },
          accessGrants: { where: { revokedAt: null }, include: { clinic: true }, orderBy: { createdAt: "desc" } },
        },
      },
      memberships: { include: { clinic: true } },
    },
  });

  return { db, user };
}

export async function getPatientAppState() {
  const { db, user } = await getOrCreateCurrentUser();
  return { db, user, patientProfile: user.patientProfile };
}

export async function getClinicAppState() {
  const { db, user } = await getOrCreateCurrentUser();
  const membership = user.memberships[0];

  if (!membership) {
    return { db, user, membership: null, clinic: null, patients: [] };
  }

  const access = await db.patientAccess.findMany({
    where: { clinicId: membership.clinicId, revokedAt: null },
    include: {
      patient: {
        include: {
          user: true,
          medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
          weightLogs: { orderBy: { loggedAt: "desc" }, take: 2 },
          hydrationLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          nutritionLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          symptomLogs: { orderBy: { loggedAt: "desc" }, take: 5 },
          dailyCheckIns: { orderBy: { checkInDate: "desc" }, take: 1 },
          doseLogs: { orderBy: { scheduledDate: "desc" }, take: 3 },
          riskFlags: { where: { resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 5 },
          doctorReports: { orderBy: { createdAt: "desc" }, take: 3 },
          clinicNotes: { orderBy: { createdAt: "desc" }, take: 2 },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    db,
    user,
    membership,
    clinic: membership.clinic,
    patients: access.map((item) => item.patient),
  };
}

export async function getClinicPatient(patientId: string) {
  const { db, membership } = await getClinicAppState();

  if (!membership) {
    return null;
  }

  const access = await db.patientAccess.findFirst({
    where: {
      clinicId: membership.clinicId,
      patientId,
      revokedAt: null,
    },
    include: {
      patient: {
        include: {
          user: true,
          medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
          doseLogs: { orderBy: { scheduledDate: "desc" }, take: 8 },
          weightLogs: { orderBy: { loggedAt: "asc" }, take: 12 },
          hydrationLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          nutritionLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
          symptomLogs: { orderBy: { loggedAt: "desc" }, take: 8 },
          riskFlags: { where: { resolvedAt: null }, orderBy: { createdAt: "desc" } },
          doctorReports: { orderBy: { createdAt: "desc" }, take: 3 },
        },
      },
    },
  });

  return access?.patient ?? null;
}
