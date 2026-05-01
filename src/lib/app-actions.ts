"use server";

import { randomBytes } from "node:crypto";
import { currentUser, auth } from "@clerk/nextjs/server";
import {
  DoseFrequency,
  InviteStatus,
  InviteType,
  MedicationName,
  PatientAccessRole,
  Prisma,
  RiskFlagLevel,
  SymptomSeverity,
  UserRole,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { generateGuidance } from "@/lib/guidance-engine";
import { createRiskFlags } from "@/lib/risk-engine";

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

function optionalNumberValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
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

function booleanValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "yes";
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

function appUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3010";
}

async function sendInviteEmail(email: string, inviteLink: string) {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "LeanDoze <onboarding@resend.dev>",
      to: email,
      subject: "You have a LeanDoze invite",
      html: `<p>You have been invited to connect on LeanDoze.</p><p><a href="${inviteLink}">Accept invite</a></p><p>LeanDoze does not provide medical advice. Review reports with your clinician.</p>`,
    }),
  });
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
  redirect("/app/onboarding");
}

export async function saveMedicationPlanAction(formData: FormData) {
  const { db, user } = await requireUser();
  const medicationRaw = textValue(formData, "medication");
  const customMedicationName = textValue(formData, "customMedicationName");
  const startWeightLb = numberValue(formData, "startWeightLb");
  const goalWeightLb = numberValue(formData, "goalWeightLb");
  const proteinGoalGrams = intValue(formData, "proteinGoalGrams", 120);
  const hydrationGoalOz = intValue(formData, "hydrationGoalOz", 90);
  const mainConcerns = formData.getAll("mainConcerns").map(String);

  const patientProfile = await db.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      startWeightLb,
      goalWeightLb,
      proteinGoalGrams,
      hydrationGoalOz,
      mainConcerns,
    },
    create: {
      userId: user.id,
      startWeightLb,
      goalWeightLb,
      proteinGoalGrams,
      hydrationGoalOz,
      mainConcerns,
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
      customName: medicationValue(medicationRaw) === MedicationName.OTHER ? customMedicationName || medicationRaw : null,
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

export async function savePatientOnboardingAction(formData: FormData) {
  await saveMedicationPlanAction(formData);
}

async function runPatientEngines(patientId: string) {
  const db = getDb();
  const patient = await db.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      hydrationLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
      nutritionLogs: { orderBy: { loggedAt: "desc" }, take: 7 },
      symptomLogs: { orderBy: { loggedAt: "desc" }, take: 3 },
      dailyCheckIns: { orderBy: { checkInDate: "desc" }, take: 7 },
      doseLogs: { orderBy: { scheduledDate: "desc" }, take: 2 },
      weightLogs: { orderBy: { loggedAt: "desc" }, take: 2 },
      medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!patient) {
    return;
  }

  const latestSymptoms = patient.symptomLogs[0];
  const today = new Date(new Date().toDateString());
  const latestDaily = patient.dailyCheckIns[0];
  const latestDoseMissed = patient.doseLogs[0]?.missed ?? false;
  const doseRecentlyIncreased = patient.medicationPlans[0]?.updatedAt
    ? Date.now() - patient.medicationPlans[0].updatedAt.getTime() < 1000 * 60 * 60 * 24 * 14
    : false;
  const hydrationLastDays = patient.hydrationLogs.map((log) => log.ounces);
  const proteinLastDays = patient.nutritionLogs.map((log) => log.proteinGrams ?? 0);

  await createRiskFlags({
    patientId,
    hydrationGoalOz: patient.hydrationGoalOz,
    proteinGoalGrams: patient.proteinGoalGrams,
    currentWeightLb: patient.weightLogs[0]?.weightLb,
    previousWeightLb: patient.weightLogs[1]?.weightLb,
    latestDoseMissed,
    doseRecentlyIncreased,
    hydrationLastDays,
    proteinLastDays,
    symptomLastDays: patient.symptomLogs.map((log) => ({
      nausea: log.nausea,
      vomiting: log.vomiting,
      constipation: log.constipation,
      abdominalPain: log.abdominalPain,
    })),
  });

  const guidance = generateGuidance({
    date: today,
    proteinToday: patient.nutritionLogs[0]?.proteinGrams ?? 0,
    proteinGoal: patient.proteinGoalGrams,
    hydrationToday: patient.hydrationLogs[0]?.ounces ?? 0,
    hydrationGoal: patient.hydrationGoalOz,
    proteinLastDays,
    hydrationLastDays,
    energyLastDays: patient.dailyCheckIns.map((checkIn) => checkIn.energyLevel ?? 0),
    symptomsToday: latestSymptoms
      ? {
          nausea: latestSymptoms.nausea,
          vomiting: latestSymptoms.vomiting,
          constipation: latestSymptoms.constipation,
          diarrhea: latestSymptoms.diarrhea,
          reflux: latestSymptoms.reflux,
          fatigue: latestSymptoms.fatigue,
          abdominalPain: latestSymptoms.abdominalPain,
        }
      : undefined,
    symptomsLoggedToday: Boolean(latestSymptoms && latestSymptoms.loggedAt >= today),
    daysSinceDose: patient.doseLogs[0]?.takenDate
      ? Math.floor((Date.now() - patient.doseLogs[0].takenDate.getTime()) / 86_400_000)
      : undefined,
    movementMinutesToday: latestDaily?.movementMinutes ?? 0,
    strengthTrainingToday: latestDaily?.strengthTraining ?? false,
    constipationDays: patient.symptomLogs.filter((log) => log.constipation === SymptomSeverity.MODERATE || log.constipation === SymptomSeverity.SEVERE).length,
  });

  await db.guidanceMessage.deleteMany({
    where: {
      patientId,
      date: today,
    },
  });

  for (const item of guidance) {
    await db.guidanceMessage.create({
      data: {
        patientId,
        title: item.title,
        message: item.message,
        category: item.category,
        priority: item.priority,
        date: item.date,
      },
    });
  }
}

export async function saveDailyCheckInAction(formData: FormData) {
  const { db, patientProfile } = await requirePatientProfile();
  const loggedAt = new Date();
  const checkInDate = new Date(loggedAt.toDateString());
  const doseStatus = textValue(formData, "doseStatus");
  const weightLb = optionalNumberValue(formData, "weightLb");
  const operations: Prisma.PrismaPromise<unknown>[] = [
    db.dailyCheckIn.upsert({
      where: { patientId_checkInDate: { patientId: patientProfile.id, checkInDate } },
      update: {
        appetiteLevel: intValue(formData, "appetiteLevel", 5),
        energyLevel: intValue(formData, "energyLevel", 5),
        moodLevel: intValue(formData, "moodLevel", 5),
        movementMinutes: intValue(formData, "movementMinutes", 0),
        strengthTraining: booleanValue(formData, "strengthTraining"),
        bowelMovement: booleanValue(formData, "bowelMovement"),
        notes: textValue(formData, "notes") || null,
      },
      create: {
        patientId: patientProfile.id,
        checkInDate,
        appetiteLevel: intValue(formData, "appetiteLevel", 5),
        energyLevel: intValue(formData, "energyLevel", 5),
        moodLevel: intValue(formData, "moodLevel", 5),
        movementMinutes: intValue(formData, "movementMinutes", 0),
        strengthTraining: booleanValue(formData, "strengthTraining"),
        bowelMovement: booleanValue(formData, "bowelMovement"),
        notes: textValue(formData, "notes") || null,
      },
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
        diarrhea: severityForSymptom(formData, "diarrhea"),
        reflux: severityForSymptom(formData, "reflux"),
        fatigue: severityForSymptom(formData, "fatigue"),
        vomiting: severityForSymptom(formData, "vomiting"),
        abdominalPain: severityForSymptom(formData, "abdominalPain"),
        notes: textValue(formData, "notes") || null,
      },
    }),
  ];

  if (weightLb) {
    operations.push(
      db.weightLog.create({
        data: { patientId: patientProfile.id, loggedAt, weightLb },
      }),
    );
  }

  await db.$transaction(operations);

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

  await runPatientEngines(patientProfile.id);
  revalidatePath("/app/dashboard");
  revalidatePath("/app/check-in");
  redirect("/app/dashboard?checkin=saved");
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
  const plan = patientProfile.medicationPlans[0];
  const notes = symptoms.map((symptom) => symptom.notes).filter(Boolean);
  const discussionTopics = [
    ...(riskFlags.length ? ["Review active risk flags and symptom patterns."] : []),
    ...(hydrationAverage < patientProfile.hydrationGoalOz ? ["Discuss hydration consistency and tolerance."] : []),
    ...(proteinAverage < patientProfile.proteinGoalGrams ? ["Discuss protein intake and muscle protection strategy."] : []),
    ...(symptoms.length ? ["Review symptom timing around dose days."] : []),
  ];

  const report = await db.doctorReport.create({
    data: {
      patientId: patientProfile.id,
      startDate,
      endDate,
      summary: `Last ${days} days: ${adherence}% dose adherence, ${hydrationAverage} oz average hydration, ${proteinAverage} g average protein. ${disclaimer}`,
      flagsSummary: riskFlags.map((flag) => `${riskLevelToSummary(flag.level)}: ${flag.title}`).join("\n") || "No active flags in this period.",
      reportData: {
        days,
        medication: plan ? `${plan.medication}${plan.customName ? ` (${plan.customName})` : ""}` : "No active plan",
        doseMg: plan?.doseMg ?? null,
        weightTrend,
        adherence,
        hydrationAverage,
        proteinAverage,
        symptomLogs: symptoms.length,
        patientNotes: notes,
        discussionTopics,
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
  const token = randomBytes(32).toString("base64url");

  await db.patientInvite.create({
    data: {
      type: InviteType.PATIENT_TO_CLINIC,
      status: InviteStatus.PENDING,
      token,
      email,
      patientId: patientProfile.id,
      invitedByUserId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  await sendInviteEmail(email, `${appUrl()}/invite/${token}`);

  revalidatePath("/app/invite-doctor");
  redirect("/app/invite-doctor?sent=1");
}

export async function invitePatientAction(formData: FormData) {
  const { db, user } = await requireUser();
  const membership = await db.clinicMembership.findFirst({ where: { userId: user.id } });
  const email = textValue(formData, "email").toLowerCase();
  const token = randomBytes(32).toString("base64url");

  if (!membership) {
    redirect("/app/dashboard");
  }

  await db.patientInvite.create({
    data: {
      type: InviteType.CLINIC_TO_PATIENT,
      status: InviteStatus.PENDING,
      token,
      email,
      clinicId: membership.clinicId,
      invitedByUserId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  await sendInviteEmail(email, `${appUrl()}/invite/${token}`);

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
