import { RiskFlagStatus, SymptomSeverity } from "@prisma/client";
import { getDb } from "@/lib/db";

export type PatientNarrative = {
  summary: string;
  flagsSummary: string;
  discussionPoints: string[];
};

export type NarrativeSection = {
  title: string;
  items: string[];
};

const disclaimer = "This summary is for clinical review. LeanDoze does not provide medical advice.";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((startOfDay(end).getTime() - startOfDay(start).getTime()) / 86_400_000));
}

function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function patientName(patient: { user: { firstName: string | null; lastName: string | null; email: string } }) {
  return `${patient.user.firstName ?? ""} ${patient.user.lastName ?? ""}`.trim() || patient.user.email;
}

function medicationLabel(plan?: { medication: string; customName: string | null; doseMg: number; startDate: Date }) {
  if (!plan) {
    return "No active medication plan";
  }

  const name = plan.customName || plan.medication.charAt(0) + plan.medication.slice(1).toLowerCase();
  const week = Math.max(1, Math.ceil((daysBetween(plan.startDate, new Date()) + 1) / 7));
  return `Week ${week} on ${name} (${plan.doseMg} mg)`;
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

function severityLabel(rank: number) {
  if (rank >= 3) {
    return "severe";
  }

  if (rank >= 2) {
    return "moderate";
  }

  if (rank >= 1) {
    return "mild";
  }

  return "none";
}

function countLowDays<T>(logs: T[], dateFor: (log: T) => Date, valueFor: (log: T) => number, goal: number) {
  const byDay = logs.reduce<Record<string, number>>((totals, log) => {
    const key = startOfDay(dateFor(log)).toISOString().slice(0, 10);
    totals[key] = (totals[key] ?? 0) + valueFor(log);
    return totals;
  }, {});

  return Object.values(byDay).filter((value) => value < goal * 0.6).length;
}

function symptomLine(
  label: string,
  logs: Array<{ loggedAt: Date } & Record<string, unknown>>,
  key: "nausea" | "vomiting" | "constipation" | "diarrhea" | "reflux" | "fatigue" | "abdominalPain",
) {
  const activeLogs = logs.filter((log) => log[key] !== SymptomSeverity.NONE);
  const highest = activeLogs.reduce((max, log) => Math.max(max, severityRank(log[key] as SymptomSeverity)), 0);

  if (!activeLogs.length) {
    return `No ${label}`;
  }

  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${severityLabel(highest)} on ${activeLogs.length} day${activeLogs.length === 1 ? "" : "s"}`;
}

function energyTrend(checkIns: Array<{ energyLevel: number | null; checkInDate: Date }>) {
  const values = checkIns.map((checkIn) => checkIn.energyLevel).filter((value): value is number => value !== null);

  if (values.length < 2) {
    return "Not enough energy data yet";
  }

  const recent = average(values.slice(0, Math.min(3, values.length)));
  const older = average(values.slice(-Math.min(3, values.length)));

  if (recent <= older - 1) {
    return "Slight downward trend last 3 days";
  }

  if (recent >= older + 1) {
    return "Improving trend last 3 days";
  }

  return "Stable over recent check-ins";
}

export async function generatePatientNarrative(patientId: string, days = 7): Promise<PatientNarrative> {
  const db = getDb();
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);

  const patient = await db.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      user: true,
      medicationPlans: { where: { active: true }, orderBy: { createdAt: "desc" }, take: 1 },
      doseLogs: { where: { scheduledDate: { gte: startDate } }, orderBy: { scheduledDate: "asc" } },
      weightLogs: { where: { loggedAt: { gte: startDate } }, orderBy: { loggedAt: "asc" } },
      nutritionLogs: { where: { loggedAt: { gte: startDate } }, orderBy: { loggedAt: "asc" } },
      hydrationLogs: { where: { loggedAt: { gte: startDate } }, orderBy: { loggedAt: "asc" } },
      symptomLogs: { where: { loggedAt: { gte: startDate } }, orderBy: { loggedAt: "asc" } },
      dailyCheckIns: { where: { checkInDate: { gte: startDate } }, orderBy: { checkInDate: "asc" } },
      riskFlags: { where: { status: RiskFlagStatus.OPEN }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) {
    return {
      summary: `No patient data found.\n\nNote:\n${disclaimer}`,
      flagsSummary: "No active flags.",
      discussionPoints: ["Confirm patient access and report period."],
    };
  }

  const plan = patient.medicationPlans[0];
  const dosesTaken = patient.doseLogs.filter((dose) => dose.taken).length;
  const missedDoses = patient.doseLogs.filter((dose) => dose.missed).length;
  const delayedDoses = patient.doseLogs.filter((dose) => dose.takenDate && dose.takenDate.getTime() - dose.scheduledDate.getTime() > 86_400_000).length;
  const firstWeight = patient.weightLogs[0]?.weightLb ?? patient.startWeightLb ?? null;
  const latestWeight = patient.weightLogs[patient.weightLogs.length - 1]?.weightLb ?? firstWeight;
  const weightChange = firstWeight && latestWeight ? latestWeight - firstWeight : null;
  const weeklyRate = weightChange !== null ? (weightChange / Math.max(days, 1)) * 7 : null;
  const proteinAverage = average(patient.nutritionLogs.map((log) => log.proteinGrams ?? 0));
  const hydrationAverage = average(patient.hydrationLogs.map((log) => log.ounces));
  const lowHydrationDays = countLowDays(patient.hydrationLogs, (log) => log.loggedAt, (log) => log.ounces, patient.hydrationGoalOz);
  const lowProteinDays = countLowDays(patient.nutritionLogs, (log) => log.loggedAt, (log) => log.proteinGrams ?? 0, patient.proteinGoalGrams);
  const symptomLines = [
    symptomLine("nausea", patient.symptomLogs, "nausea"),
    symptomLine("vomiting", patient.symptomLogs, "vomiting"),
    symptomLine("constipation", patient.symptomLogs, "constipation"),
    symptomLine("reflux", patient.symptomLogs, "reflux"),
    symptomLine("fatigue", patient.symptomLogs, "fatigue"),
    symptomLine("severe abdominal pain", patient.symptomLogs, "abdominalPain"),
  ];
  const activeFlags = patient.riskFlags.map((flag) => `${flag.title} (${flag.level})`);
  const discussionPoints = [
    ...(lowHydrationDays ? ["hydration strategy"] : []),
    ...(lowProteinDays ? ["protein intake"] : []),
    ...(patient.symptomLogs.some((log) => log.nausea !== SymptomSeverity.NONE) ? ["nausea pattern after dose"] : []),
    ...(weeklyRate !== null && weeklyRate < -2 ? ["pace of weight change"] : []),
    ...(activeFlags.length ? ["active risk flags"] : []),
  ];

  const summary = [
    `${patientName(patient)} - ${medicationLabel(plan)}`,
    "",
    "Adherence:",
    patient.doseLogs.length
      ? `- ${dosesTaken} of ${patient.doseLogs.length} logged doses taken`
      : "- No scheduled dose logs in this period",
    delayedDoses ? `- ${delayedDoses} delayed dose${delayedDoses === 1 ? "" : "s"}` : "- no delayed doses logged",
    missedDoses ? `- ${missedDoses} missed dose${missedDoses === 1 ? "" : "s"}` : "- otherwise consistent",
    "",
    "Weight:",
    weightChange !== null
      ? `- ${weightChange < 0 ? "Down" : weightChange > 0 ? "Up" : "No change"} ${Math.abs(weightChange).toFixed(1)} lb in this period`
      : "- Not enough weight data",
    weeklyRate !== null ? `- weekly rate ${weeklyRate.toFixed(1)} lb/week` : "- weekly rate unavailable",
    "",
    "Nutrition:",
    `- Protein average ${proteinAverage}g vs ${patient.proteinGoalGrams}g goal`,
    `- Hydration average ${hydrationAverage}oz vs ${patient.hydrationGoalOz}oz goal`,
    lowHydrationDays ? `- Hydration below 60% target on ${lowHydrationDays} day${lowHydrationDays === 1 ? "" : "s"}` : "- Hydration generally consistent",
    "",
    "Symptoms:",
    ...symptomLines.map((line) => `- ${line}`),
    "",
    "Energy:",
    `- ${energyTrend(patient.dailyCheckIns)}`,
    "",
    "Flags:",
    ...(activeFlags.length ? activeFlags.map((flag) => `- ${flag}`) : ["- No active flags"]),
    "",
    "Suggested discussion:",
    ...(discussionPoints.length ? discussionPoints.map((point) => `- ${point}`) : ["- continue monitoring current pattern"]),
    "",
    "Note:",
    disclaimer,
  ].join("\n");

  return {
    summary,
    flagsSummary: activeFlags.join("\n") || "No active flags.",
    discussionPoints: discussionPoints.length ? discussionPoints : ["continue monitoring current pattern"],
  };
}

export function formatNarrativeForUI(narrative: PatientNarrative): NarrativeSection[] {
  const sections: NarrativeSection[] = [];
  let current: NarrativeSection | null = null;

  for (const rawLine of narrative.summary.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (line.endsWith(":")) {
      current = { title: line.slice(0, -1), items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { title: "Summary", items: [] };
      sections.push(current);
    }

    current.items.push(line.replace(/^- /, ""));
  }

  return sections;
}

