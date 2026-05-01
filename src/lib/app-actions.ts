"use server";

import { randomBytes } from "node:crypto";
import { currentUser, auth } from "@clerk/nextjs/server";
import {
  DoseFrequency,
  InviteStatus,
  InviteType,
  MedicationName,
  PatientAccessRole,
  RiskFlagLevel,
  SymptomSeverity,
  UserRole,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

const disclaimer =
  "LeanDoze does not provide medical advice. Review this report with your clinician.";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number.parseFloat(textValue(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number.parseInt(textValue(formData, key), 10);
  return Number.isFinite(value) ? value : fallback;
}

function dateValue(formData: FormData, key: string, fallback = new Date()) {
  const value = textValue(formData, key);
  const parsed = value ? new Date(`${value}T12:00:00`) : fallback;
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function medicationValue(value: string): MedicationName {
  const normalized = value.toUpperCase() as MedicationName;
  return Object.values(MedicationName).includes(normalized) ? normalized : MedicationName.OTHER;
}

function frequencyValue(value: string): DoseFrequency {
  return value.toUpperCase() === DoseFrequency.DAILY ? DoseFrequency.DAILY : DoseFrequency.WEEKLY;
}

function severityValue(value: string): SymptomSeverity {
  const normalized = value.toUpperCase() as SymptomSeverity;
  return Object.values(SymptomSeverity).includes(normalized) ? normalized : SymptomSeverity.NONE;
}

function severityForSymptom(formData: FormData, symptom: string) {
  const checked = formData.getAll("symptoms").map(String).includes(symptom);
  return checked ? severityValue(textValue(formData, `${symptom}Severity`)) : SymptomSeverity.NONE;
}

function riskLevelToSummary(level: RiskFlagLevel) {
  if (level === RiskFlagLevel.URGENT) {
    return "Urgent review";
  }

  if (level === RiskFlagLevel.MEDIUM) {
    return "Review pattern";
  }

  return "Watch trend";
}

async function requireUser() {
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
      patientProfile: true,
      memberships: true,
    },
  });

  return { db, user };
}

async function requirePatientProfile() {
  const { db, user } = await requireUser();
  const patientProfile = await db.patientProfile.findUnique({
    where: { userId: user.id },
    include: { medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" } } },
  });

  if (!patientProfile) {
    redirect("/app/dashboard");
  }

  return { db, user, patientProfile };
}

export async function selectRoleAction(formData: FormData) {
  const role = textValue(formData, "role");
  const { db, user } = await requireUser();

  if (role === "clinic") {
    const clinic = await db.clinic.create({
      data: {
        name: textValue(formData, "clinicName") || "LeanDoze Clinic",
        slug: `clinic-${randomBytes(5).toString("hex")}`,
        memberships: {
          create: {
            userId: user.id,
            role: UserRole.CLINIC_ADMIN,
          },
        },
      },
    });

    await db.user.update({ where: { id: user.id }, data: { role: UserRole.CLINIC_ADMIN } });
    revalidatePath("/clinic/dashboard");
    redirect(`/clinic/dashboard?clinic=${clinic.slug}`);
  }

  await db.user.update({ where: { id: user.id }, data: { role: UserRole.PATIENT } });
  redirect("/app/medication");
}

export async function saveMedicationPlanAction(formData: FormData) {
  const { db, user } = await requireUser();
  const medicationRaw = textValue(formData, "medication");
  const startWeightLb = numberValue(formData, "startWeightLb");
  const goalWeightLb = numberValue(formData, "goalWeightLb");
  const proteinGoalGrams = intValue(formData, "proteinGoalGrams", 120);
  const hydrationGoalOz = intValue(formData, "hydrationGoalOz", 90);

  const patientProfile = await db.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      startWeightLb,
      goalWeightLb,
      proteinGoalGrams,
      hydrationGoalOz,
    },
    create: {
      userId: user.id,
      startWeightLb,
      goalWeightLb,
      proteinGoalGrams,
      hydrationGoalOz,
    },
  });

  await db.medicationPlan.updateMany({
    where: { patientId: patientProfile.id, active: true },
    data: { active: false },
  });

  await db.medicationPlan.create({
    data: {
      patientId: patientProfile.id,
      medication: medicationValue(medicationRaw),
      customName: medicationValue(medicationRaw) === MedicationName.OTHER ? medicationRaw : null,
      doseMg: numberValue(formData, "doseMg"),
      frequency: frequencyValue(textValue(formData, "frequency")),
      startDate: dateValue(formData, "startDate", new Date()),
      nextDoseDate: dateValue(formData, "nextDoseDate"),
      notes: textValue(formData, "notes") || null,
    },
  });

  revalidatePath("/app/dashboard");
  revalidatePath("/app/medication");
  redirect("/app/dashboard");
}

async function createRiskFlagsForCheckIn(patientId: string) {
  const db = getDb();
  const patient = await db.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      hydrationLogs: { orderBy: { loggedAt: "desc" }, take: 3 },
      nutritionLogs: { orderBy: { loggedAt: "desc" }, take: 3 },
      symptomLogs: { orderBy: { loggedAt: "desc" }, take: 3 },
      doseLogs: { orderBy: { scheduledDate: "desc" }, take: 1 },
    },
  });

  if (!patient) {
    return;
  }

  const flags: Array<{
    level: RiskFlagLevel;
    title: string;
    description: string;
    source: string;
  }> = [];

  const latestSymptoms = patient.symptomLogs[0];

  if (latestSymptoms?.abdominalPain === SymptomSeverity.SEVERE) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe abdominal pain logged",
      description: "A severe abdominal pain symptom was logged. Review this with your clinician.",
      source: "symptom-log",
    });
  }

  if (latestSymptoms?.vomiting === SymptomSeverity.SEVERE) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe vomiting logged",
      description: "Severe vomiting was logged. Review this with your clinician.",
      source: "symptom-log",
    });
  }

  if (patient.hydrationLogs.length >= 3 && patient.hydrationLogs.every((log) => log.ounces < patient.hydrationGoalOz)) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Hydration below goal for 3 days",
      description: "Hydration has been below the configured target for three recent logs.",
      source: "hydration-log",
    });
  }

  if (
    patient.nutritionLogs.length >= 3 &&
    patient.nutritionLogs.every((log) => (log.proteinGrams ?? 0) < patient.proteinGoalGrams)
  ) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Protein below goal for 3 days",
      description: "Protein intake has been below the configured target for three recent logs.",
      source: "nutrition-log",
    });
  }

  if (patient.doseLogs.some((log) => log.missed)) {
    flags.push({
      level: RiskFlagLevel.LOW,
      title: "Missed dose logged",
      description: "A scheduled dose was marked missed. Review this with your clinician.",
      source: "dose-log",
    });
  }

  for (const flag of flags) {
    await db.riskFlag.create({
      data: {
        patientId,
        ...flag,
        recommendation: "Review this with your clinician.",
      },
    });
  }
}

export async function saveDailyCheckInAction(formData: FormData) {
  const { db, patientProfile } = await requirePatientProfile();
  const loggedAt = new Date();
  const checkInDate = new Date(loggedAt.toDateString());
  const doseStatus = textValue(formData, "doseStatus");

  await db.$transaction([
    db.dailyCheckIn.upsert({
      where: { patientId_checkInDate: { patientId: patientProfile.id, checkInDate } },
      update: {
        appetiteLevel: intValue(formData, "appetiteLevel", 5),
        energyLevel: intValue(formData, "energyLevel", 5),
        moodLevel: intValue(formData, "moodLevel", 5),
        notes: textValue(formData, "notes") || null,
      },
      create: {
        patientId: patientProfile.id,
        checkInDate,
        appetiteLevel: intValue(formData, "appetiteLevel", 5),
        energyLevel: intValue(formData, "energyLevel", 5),
        moodLevel: intValue(formData, "moodLevel", 5),
        notes: textValue(formData, "notes") || null,
      },
    }),
    db.weightLog.create({
      data: { patientId: patientProfile.id, loggedAt, weightLb: numberValue(formData, "weightLb") },
    }),
    db.nutritionLog.create({
      data: { patientId: patientProfile.id, loggedAt, proteinGrams: intValue(formData, "proteinGrams") },
    }),
    db.hydrationLog.create({
      data: { patientId: patientProfile.id, loggedAt, ounces: intValue(formData, "hydrationOz") },
    }),
    db.symptomLog.create({
      data: {
        patientId: patientProfile.id,
        loggedAt,
        nausea: severityForSymptom(formData, "nausea"),
        constipation: severityForSymptom(formData, "constipation"),
        reflux: severityForSymptom(formData, "reflux"),
        fatigue: severityForSymptom(formData, "fatigue"),
        vomiting: severityForSymptom(formData, "vomiting"),
        abdominalPain: severityForSymptom(formData, "abdominalPain"),
        notes: textValue(formData, "notes") || null,
      },
    }),
  ]);

  if (doseStatus === "missed") {
    const plan = patientProfile.medicationPlans[0];
    await db.doseLog.create({
      data: {
        patientId: patientProfile.id,
        medicationPlanId: plan?.id,
        scheduledDate: new Date(),
        doseMg: plan?.doseMg ?? 0,
        missed: true,
        notes: "Missed dose logged from daily check-in.",
      },
    });
  }

  await createRiskFlagsForCheckIn(patientProfile.id);
  revalidatePath("/app/dashboard");
  revalidatePath("/app/check-in");
  redirect("/app/dashboard");
}

export async function generateDoctorReportAction(formData: FormData) {
  const { db, patientProfile } = await requirePatientProfile();
  const days = intValue(formData, "days", 7);
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);

  const [weights, nutrition, hydration, symptoms, riskFlags, doses] = await Promise.all([
    db.weightLog.findMany({ where: { patientId: patientProfile.id, loggedAt: { gte: startDate } }, orderBy: { loggedAt: "asc" } }),
    db.nutritionLog.findMany({ where: { patientId: patientProfile.id, loggedAt: { gte: startDate } } }),
    db.hydrationLog.findMany({ where: { patientId: patientProfile.id, loggedAt: { gte: startDate } } }),
    db.symptomLog.findMany({ where: { patientId: patientProfile.id, loggedAt: { gte: startDate } } }),
    db.riskFlag.findMany({ where: { patientId: patientProfile.id, createdAt: { gte: startDate } }, orderBy: { createdAt: "desc" } }),
    db.doseLog.findMany({ where: { patientId: patientProfile.id, scheduledDate: { gte: startDate } } }),
  ]);

  const proteinAverage = Math.round(
    nutrition.reduce((sum, log) => sum + (log.proteinGrams ?? 0), 0) / Math.max(nutrition.length, 1),
  );
  const hydrationAverage = Math.round(
    hydration.reduce((sum, log) => sum + log.ounces, 0) / Math.max(hydration.length, 1),
  );
  const takenDoses = doses.filter((dose) => dose.taken).length;
  const adherence = doses.length ? Math.round((takenDoses / doses.length) * 100) : 100;
  const firstWeight = weights[0]?.weightLb;
  const lastWeight = weights[weights.length - 1]?.weightLb;
  const weightTrend = firstWeight && lastWeight ? `${(lastWeight - firstWeight).toFixed(1)} lb` : "Not enough data";

  const report = await db.doctorReport.create({
    data: {
      patientId: patientProfile.id,
      startDate,
      endDate,
      summary: `Last ${days} days: ${adherence}% dose adherence, ${hydrationAverage} oz average hydration, ${proteinAverage} g average protein. ${disclaimer}`,
      flagsSummary: riskFlags.map((flag) => `${riskLevelToSummary(flag.level)}: ${flag.title}`).join("\n") || "No active flags in this period.",
      reportData: {
        days,
        weightTrend,
        adherence,
        hydrationAverage,
        proteinAverage,
        symptomLogs: symptoms.length,
        riskFlags: riskFlags.map((flag) => ({ title: flag.title, level: flag.level, description: flag.description })),
        disclaimer,
      },
    },
  });

  revalidatePath("/app/reports");
  redirect(`/app/reports?report=${report.id}`);
}

export async function inviteDoctorAction(formData: FormData) {
  const { db, user, patientProfile } = await requirePatientProfile();
  const email = textValue(formData, "email").toLowerCase();

  await db.patientInvite.create({
    data: {
      type: InviteType.PATIENT_TO_CLINIC,
      status: InviteStatus.PENDING,
      token: randomBytes(32).toString("base64url"),
      email,
      patientId: patientProfile.id,
      invitedByUserId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  revalidatePath("/app/invite-doctor");
  redirect("/app/invite-doctor?sent=1");
}

export async function invitePatientAction(formData: FormData) {
  const { db, user } = await requireUser();
  const membership = await db.clinicMembership.findFirst({ where: { userId: user.id } });

  if (!membership) {
    redirect("/app/dashboard");
  }

  await db.patientInvite.create({
    data: {
      type: InviteType.CLINIC_TO_PATIENT,
      status: InviteStatus.PENDING,
      token: randomBytes(32).toString("base64url"),
      email: textValue(formData, "email").toLowerCase(),
      clinicId: membership.clinicId,
      invitedByUserId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  revalidatePath("/clinic/invite-patient");
  redirect("/clinic/invite-patient?sent=1");
}

export async function acceptInviteAction(formData: FormData) {
  const token = textValue(formData, "token");
  const { db, user } = await requireUser();
  const invite = await db.patientInvite.findUnique({ where: { token } });

  if (!invite || invite.status !== InviteStatus.PENDING || invite.expiresAt < new Date()) {
    redirect(`/invite/${token}?status=unavailable`);
  }

  let patientId = invite.patientId;
  let clinicId = invite.clinicId;

  if (invite.type === InviteType.CLINIC_TO_PATIENT) {
    const patient = await db.patientProfile.findUnique({ where: { userId: user.id } });
    if (!patient || !invite.clinicId) {
      redirect("/app/medication");
    }
    patientId = patient.id;
    clinicId = invite.clinicId;
  }

  if (invite.type === InviteType.PATIENT_TO_CLINIC) {
    const membership = await db.clinicMembership.findFirst({ where: { userId: user.id } });
    if (!membership || !invite.patientId) {
      redirect("/clinic/dashboard");
    }
    patientId = invite.patientId;
    clinicId = membership.clinicId;
  }

  if (!patientId || !clinicId) {
    redirect(`/invite/${token}?status=unavailable`);
  }

  await db.$transaction([
    db.patientAccess.upsert({
      where: { patientId_clinicId: { patientId, clinicId } },
      update: { revokedAt: null, role: PatientAccessRole.CLINICIAN, grantedByInviteId: invite.id },
      create: { patientId, clinicId, role: PatientAccessRole.CLINICIAN, grantedByInviteId: invite.id },
    }),
    db.patientInvite.update({
      where: { id: invite.id },
      data: { status: InviteStatus.ACCEPTED, acceptedAt: new Date() },
    }),
  ]);

  revalidatePath("/clinic/patients");
  redirect(invite.type === InviteType.CLINIC_TO_PATIENT ? "/app/dashboard" : "/clinic/patients");
}

export async function revokePatientAccessAction(formData: FormData) {
  const { db, patientProfile } = await requirePatientProfile();
  const clinicId = textValue(formData, "clinicId");

  await db.patientAccess.updateMany({
    where: { patientId: patientProfile.id, clinicId },
    data: { revokedAt: new Date() },
  });

  revalidatePath("/app/invite-doctor");
}
