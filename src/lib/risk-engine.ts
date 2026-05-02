import { RiskFlagLevel, RiskFlagStatus, SymptomSeverity } from "@prisma/client";
import { getDb } from "@/lib/db";

export type RiskFlagDraft = {
  level: RiskFlagLevel;
  title: string;
  description: string;
  recommendation: string;
  source: string;
};

const reviewRecommendation = "Review this pattern with the clinician.";
const careTeamRecommendation = "This should be discussed with the care team.";
const urgentRecommendation = "Seek urgent medical guidance if symptoms are severe or worsening.";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getLastNDays(days: number, anchor = new Date()) {
  const today = startOfDay(anchor);
  return Array.from({ length: days }, (_, index) => addDays(today, -index));
}

function dayKey(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function severityRank(severity: SymptomSeverity) {
  const ranks = {
    [SymptomSeverity.NONE]: 0,
    [SymptomSeverity.MILD]: 1,
    [SymptomSeverity.MODERATE]: 2,
    [SymptomSeverity.SEVERE]: 3,
  };

  return ranks[severity];
}

function isModerateOrSevere(severity: SymptomSeverity) {
  return severityRank(severity) >= severityRank(SymptomSeverity.MODERATE);
}

function groupTotalByDay<T>(logs: T[], dateFor: (log: T) => Date, valueFor: (log: T) => number) {
  return logs.reduce<Record<string, number>>((totals, log) => {
    const key = dayKey(dateFor(log));
    totals[key] = (totals[key] ?? 0) + valueFor(log);
    return totals;
  }, {});
}

function symptomDays(
  symptoms: Array<{
    loggedAt: Date;
    nausea: SymptomSeverity;
    vomiting: SymptomSeverity;
    constipation: SymptomSeverity;
    diarrhea: SymptomSeverity;
    reflux: SymptomSeverity;
    fatigue: SymptomSeverity;
    abdominalPain: SymptomSeverity;
  }>,
  predicate: (log: (typeof symptoms)[number]) => boolean,
) {
  return new Set(symptoms.filter(predicate).map((log) => dayKey(log.loggedAt))).size;
}

function isDosePastDue(plan?: { nextDoseDate: Date | null }) {
  if (!plan?.nextDoseDate) {
    return false;
  }

  return startOfDay(plan.nextDoseDate).getTime() < startOfDay(new Date()).getTime();
}

function calculateWeightChangePercent(weights: Array<{ loggedAt: Date; weightLb: number }>) {
  if (weights.length < 2) {
    return 0;
  }

  const sorted = [...weights].sort((a, b) => a.loggedAt.getTime() - b.loggedAt.getTime());
  const oldest = sorted[0]?.weightLb;
  const newest = sorted[sorted.length - 1]?.weightLb;

  if (!oldest || !newest || newest >= oldest) {
    return 0;
  }

  return ((oldest - newest) / oldest) * 100;
}

function activeToday<T extends { loggedAt: Date }>(logs: T[]) {
  const today = dayKey(new Date());
  return logs.filter((log) => dayKey(log.loggedAt) === today);
}

function buildRiskDrafts(input: {
  proteinGoalGrams: number;
  hydrationGoalOz: number;
  medicationPlan?: { nextDoseDate: Date | null };
  dailyCheckIns: Array<{ checkInDate: Date }>;
  nutritionLogs: Array<{ loggedAt: Date; proteinGrams: number | null }>;
  hydrationLogs: Array<{ loggedAt: Date; ounces: number }>;
  symptomLogs: Array<{
    loggedAt: Date;
    nausea: SymptomSeverity;
    vomiting: SymptomSeverity;
    constipation: SymptomSeverity;
    diarrhea: SymptomSeverity;
    reflux: SymptomSeverity;
    fatigue: SymptomSeverity;
    abdominalPain: SymptomSeverity;
  }>;
  weightLogs: Array<{ loggedAt: Date; weightLb: number }>;
  doseLogs: Array<{ missed: boolean }>;
}) {
  const flags: RiskFlagDraft[] = [];
  const todaySymptoms = activeToday(input.symptomLogs);
  const lastThreeDays = getLastNDays(3).map(dayKey);
  const hydrationByDay = groupTotalByDay(input.hydrationLogs, (log) => log.loggedAt, (log) => log.ounces);
  const proteinByDay = groupTotalByDay(input.nutritionLogs, (log) => log.loggedAt, (log) => log.proteinGrams ?? 0);
  const lowHydrationDays = lastThreeDays.filter((day) => (hydrationByDay[day] ?? 0) < input.hydrationGoalOz * 0.6).length;
  const lowProteinDays = lastThreeDays.filter((day) => (proteinByDay[day] ?? 0) < input.proteinGoalGrams * 0.6).length;
  const latestCheckInDay = input.dailyCheckIns[0]?.checkInDate;
  const daysSinceCheckIn = latestCheckInDay
    ? Math.floor((startOfDay(new Date()).getTime() - startOfDay(latestCheckInDay).getTime()) / 86_400_000)
    : 3;

  if (todaySymptoms.some((log) => log.abdominalPain === SymptomSeverity.SEVERE)) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe abdominal pain logged",
      description: "Severe abdominal pain was logged today.",
      recommendation: urgentRecommendation,
      source: "severe-abdominal-pain",
    });
  }

  if (todaySymptoms.some((log) => log.vomiting === SymptomSeverity.SEVERE)) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe vomiting logged",
      description: "Severe vomiting was logged today.",
      recommendation: urgentRecommendation,
      source: "severe-vomiting",
    });
  }

  if (symptomDays(input.symptomLogs, (log) => isModerateOrSevere(log.vomiting)) >= 2) {
    flags.push({
      level: RiskFlagLevel.HIGH,
      title: "Vomiting recurring across days",
      description: "Moderate or severe vomiting has been logged on two or more recent days.",
      recommendation: urgentRecommendation,
      source: "recurring-vomiting",
    });
  }

  if (symptomDays(input.symptomLogs, (log) => log.nausea === SymptomSeverity.SEVERE) >= 2) {
    flags.push({
      level: RiskFlagLevel.HIGH,
      title: "Severe nausea recurring",
      description: "Severe nausea has been logged on two or more recent days.",
      recommendation: careTeamRecommendation,
      source: "recurring-nausea",
    });
  }

  if (calculateWeightChangePercent(input.weightLogs) >= 2.5) {
    flags.push({
      level: RiskFlagLevel.HIGH,
      title: "Rapid weight change",
      description: "Weight has decreased by more than the weekly review threshold in recent logs.",
      recommendation: reviewRecommendation,
      source: "rapid-weight-loss",
    });
  }

  if (lowHydrationDays >= 3) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Hydration below target",
      description: "Hydration has been below 60% of the configured goal for three days.",
      recommendation: reviewRecommendation,
      source: "low-hydration-3-days",
    });
  }

  if (lowProteinDays >= 3) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Protein below target",
      description: "Protein has been below 60% of the configured goal for three days.",
      recommendation: reviewRecommendation,
      source: "low-protein-3-days",
    });
  }

  if (symptomDays(input.symptomLogs, (log) => isModerateOrSevere(log.constipation)) >= 3) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Constipation recurring",
      description: "Moderate or severe constipation has been logged on three recent days.",
      recommendation: reviewRecommendation,
      source: "constipation-3-days",
    });
  }

  if (isDosePastDue(input.medicationPlan)) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Dose appears past due",
      description: "The next dose date is in the past based on the active medication plan.",
      recommendation: reviewRecommendation,
      source: "dose-past-due",
    });
  }

  if (input.doseLogs.some((dose) => dose.missed)) {
    flags.push({
      level: RiskFlagLevel.LOW,
      title: "Missed dose logged",
      description: "A dose was marked missed in recent dose logs.",
      recommendation: reviewRecommendation,
      source: "missed-dose",
    });
  }

  if (daysSinceCheckIn >= 3) {
    flags.push({
      level: RiskFlagLevel.LOW,
      title: "No check-in for 3 days",
      description: "No daily check-in has been logged for at least three days.",
      recommendation: "Keep logging so the care team can see the pattern.",
      source: "no-checkin-3-days",
    });
  }

  if (
    symptomDays(input.symptomLogs, (log) =>
      [log.nausea, log.vomiting, log.constipation, log.diarrhea, log.reflux, log.fatigue, log.abdominalPain].some(
        (severity) => severity === SymptomSeverity.MILD,
      ),
    ) >= 3
  ) {
    flags.push({
      level: RiskFlagLevel.LOW,
      title: "Mild symptoms recurring",
      description: "Mild symptoms have been logged on three or more recent days.",
      recommendation: reviewRecommendation,
      source: "recurring-mild-symptoms",
    });
  }

  return flags;
}

async function upsertOpenFlag(patientId: string, flag: RiskFlagDraft) {
  const db = getDb();
  const existing = await db.riskFlag.findFirst({
    where: {
      patientId,
      source: flag.source,
      title: flag.title,
      status: RiskFlagStatus.OPEN,
    },
  });

  if (existing) {
    await db.riskFlag.update({
      where: { id: existing.id },
      data: {
        level: flag.level,
        description: flag.description,
        recommendation: flag.recommendation,
      },
    });
    return;
  }

  await db.riskFlag.create({
    data: {
      patientId,
      ...flag,
    },
  });
}

async function resolveFlag(patientId: string, source: string) {
  const db = getDb();
  await db.riskFlag.updateMany({
    where: {
      patientId,
      source,
      status: RiskFlagStatus.OPEN,
    },
    data: {
      status: RiskFlagStatus.RESOLVED,
      resolvedAt: new Date(),
    },
  });
}

export async function evaluatePatientRisk(patientId: string): Promise<void> {
  const db = getDb();
  const sevenDaysAgo = addDays(startOfDay(new Date()), -6);
  const patient = await db.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
      dailyCheckIns: { where: { checkInDate: { gte: sevenDaysAgo } }, orderBy: { checkInDate: "desc" } },
      nutritionLogs: { where: { loggedAt: { gte: sevenDaysAgo } }, orderBy: { loggedAt: "desc" } },
      hydrationLogs: { where: { loggedAt: { gte: sevenDaysAgo } }, orderBy: { loggedAt: "desc" } },
      symptomLogs: { where: { loggedAt: { gte: sevenDaysAgo } }, orderBy: { loggedAt: "desc" } },
      weightLogs: { where: { loggedAt: { gte: sevenDaysAgo } }, orderBy: { loggedAt: "desc" } },
      doseLogs: { where: { scheduledDate: { gte: sevenDaysAgo } }, orderBy: { scheduledDate: "desc" } },
    },
  });

  if (!patient) {
    return;
  }

  const drafts = buildRiskDrafts({
    proteinGoalGrams: patient.proteinGoalGrams,
    hydrationGoalOz: patient.hydrationGoalOz,
    medicationPlan: patient.medicationPlans[0],
    dailyCheckIns: patient.dailyCheckIns,
    nutritionLogs: patient.nutritionLogs,
    hydrationLogs: patient.hydrationLogs,
    symptomLogs: patient.symptomLogs,
    weightLogs: patient.weightLogs,
    doseLogs: patient.doseLogs,
  });
  const activeSources = new Set(drafts.map((flag) => flag.source));
  const knownSources = [
    "severe-abdominal-pain",
    "severe-vomiting",
    "recurring-vomiting",
    "recurring-nausea",
    "rapid-weight-loss",
    "low-hydration-3-days",
    "low-protein-3-days",
    "constipation-3-days",
    "dose-past-due",
    "missed-dose",
    "no-checkin-3-days",
    "recurring-mild-symptoms",
  ];

  for (const flag of drafts) {
    await upsertOpenFlag(patientId, flag);
  }

  for (const source of knownSources) {
    if (!activeSources.has(source)) {
      await resolveFlag(patientId, source);
    }
  }

  await db.patientProfile.update({
    where: { id: patientId },
    data: { riskEvaluatedAt: new Date() },
  });
}

