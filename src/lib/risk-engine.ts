import { RiskFlagLevel, SymptomSeverity } from "@prisma/client";
import { getDb } from "@/lib/db";

export type RiskEngineInput = {
  patientId: string;
  hydrationGoalOz: number;
  proteinGoalGrams: number;
  currentWeightLb?: number;
  previousWeightLb?: number;
  latestDoseMissed?: boolean;
  doseRecentlyIncreased?: boolean;
  hydrationLastDays: number[];
  proteinLastDays: number[];
  symptomLastDays: Array<{
    nausea: SymptomSeverity;
    vomiting: SymptomSeverity;
    constipation: SymptomSeverity;
    abdominalPain: SymptomSeverity;
  }>;
};

export type RiskFlagDraft = {
  level: RiskFlagLevel;
  title: string;
  description: string;
  recommendation: string;
  source: string;
};

const guidanceReview = "Review this with your clinician.";
const urgentReview = "Seek medical guidance or contact your clinician.";

function moderateOrSevere(value: SymptomSeverity) {
  return value === SymptomSeverity.MODERATE || value === SymptomSeverity.SEVERE;
}

function belowPercentForDays(values: number[], goal: number, percent: number, days: number) {
  return values.slice(0, days).length >= days && values.slice(0, days).every((value) => value < goal * percent);
}

export function evaluateRiskFlags(input: RiskEngineInput): RiskFlagDraft[] {
  const flags: RiskFlagDraft[] = [];
  const latestSymptoms = input.symptomLastDays[0];

  if (latestSymptoms?.abdominalPain === SymptomSeverity.SEVERE) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe abdominal pain logged",
      description: "Severe abdominal pain was logged in the latest check-in.",
      recommendation: urgentReview,
      source: "symptom-log",
    });
  }

  if (latestSymptoms?.vomiting === SymptomSeverity.SEVERE) {
    flags.push({
      level: RiskFlagLevel.URGENT,
      title: "Severe vomiting logged",
      description: "Severe vomiting was logged in the latest check-in.",
      recommendation: urgentReview,
      source: "symptom-log",
    });
  }

  if (input.symptomLastDays.slice(0, 2).length >= 2 && input.symptomLastDays.slice(0, 2).every((log) => moderateOrSevere(log.vomiting))) {
    flags.push({
      level: RiskFlagLevel.HIGH,
      title: "Vomiting across multiple days",
      description: "Moderate or severe vomiting has been logged for two or more recent days.",
      recommendation: urgentReview,
      source: "symptom-log",
    });
  }

  if (belowPercentForDays(input.hydrationLastDays, input.hydrationGoalOz, 0.6, 3)) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Hydration below 60% of goal",
      description: "Hydration has been below 60% of the configured goal for three recent days.",
      recommendation: guidanceReview,
      source: "hydration-log",
    });
  }

  if (belowPercentForDays(input.proteinLastDays, input.proteinGoalGrams, 0.6, 3)) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Protein below 60% of goal",
      description: "Protein has been below 60% of the configured goal for three recent days.",
      recommendation: guidanceReview,
      source: "nutrition-log",
    });
  }

  if (
    input.symptomLastDays.slice(0, 3).length >= 3 &&
    input.symptomLastDays.slice(0, 3).every((log) => moderateOrSevere(log.constipation))
  ) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Constipation across multiple days",
      description: "Moderate or severe constipation has been logged for three recent days.",
      recommendation: guidanceReview,
      source: "symptom-log",
    });
  }

  if (input.latestDoseMissed) {
    flags.push({
      level: RiskFlagLevel.LOW,
      title: "Missed dose logged",
      description: "A scheduled dose was marked missed.",
      recommendation: guidanceReview,
      source: "dose-log",
    });
  }

  if (input.currentWeightLb && input.previousWeightLb) {
    const lossPercent = ((input.previousWeightLb - input.currentWeightLb) / input.previousWeightLb) * 100;
    if (lossPercent >= 2.5) {
      flags.push({
        level: RiskFlagLevel.MEDIUM,
        title: "Rapid weight change",
        description: "Weight changed faster than the configured weekly review threshold.",
        recommendation: guidanceReview,
        source: "weight-log",
      });
    }
  }

  if (input.doseRecentlyIncreased && moderateOrSevere(latestSymptoms?.nausea ?? SymptomSeverity.NONE)) {
    flags.push({
      level: RiskFlagLevel.MEDIUM,
      title: "Symptoms after dose increase",
      description: "Moderate or severe nausea was logged after a recent dose increase.",
      recommendation: guidanceReview,
      source: "symptom-log",
    });
  }

  return flags;
}

export async function createRiskFlags(input: RiskEngineInput) {
  const db = getDb();
  const drafts = evaluateRiskFlags(input);

  for (const flag of drafts) {
    await db.riskFlag.create({
      data: {
        patientId: input.patientId,
        ...flag,
      },
    });
  }

  return drafts;
}
