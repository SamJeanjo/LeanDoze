export type Severity = "WATCH" | "ELEVATED" | "URGENT";

export type SafetyInput = {
  symptoms: Array<{
    symptom: string;
    severity: "NONE" | "MILD" | "MODERATE" | "SEVERE";
    durationDays?: number;
    afterDoseIncrease?: boolean;
  }>;
  missedDose?: boolean;
  hydrationOzByDay: number[];
  proteinGramsByDay: number[];
  weightChangePercentPerWeek?: number;
  hydrationGoalOz: number;
  proteinGoalGrams: number;
};

export type SafetyFlag = {
  type:
    | "SEVERE_ABDOMINAL_PAIN"
    | "PERSISTENT_VOMITING"
    | "DEHYDRATION_RISK"
    | "CONSTIPATION_MULTIPLE_DAYS"
    | "NAUSEA_WORSENING_AFTER_DOSE_INCREASE"
    | "MISSED_DOSE"
    | "RAPID_WEIGHT_CHANGE"
    | "LOW_HYDRATION_MULTIPLE_DAYS"
    | "LOW_PROTEIN_MULTIPLE_DAYS";
  severity: Severity;
  title: string;
  summary: string;
  recommendation: "Review this with your clinician.";
};

const recommendation = "Review this with your clinician." as const;

function hasSymptom(input: SafetyInput, match: string, severity?: SafetyInput["symptoms"][number]["severity"]) {
  return input.symptoms.some((item) => {
    const symptomMatches = item.symptom.toLowerCase().includes(match);
    return symptomMatches && (!severity || item.severity === severity);
  });
}

function lowDays(values: number[], threshold: number) {
  return values.filter((value) => value < threshold).length;
}

export function evaluateSafetyFlags(input: SafetyInput): SafetyFlag[] {
  const flags: SafetyFlag[] = [];

  if (hasSymptom(input, "abdominal pain", "SEVERE")) {
    flags.push({
      type: "SEVERE_ABDOMINAL_PAIN",
      severity: "URGENT",
      title: "Severe abdominal pain logged",
      summary: "A severe abdominal pain symptom was logged in the current review period.",
      recommendation,
    });
  }

  if (input.symptoms.some((item) => item.symptom.toLowerCase().includes("vomiting") && (item.durationDays ?? 0) >= 2)) {
    flags.push({
      type: "PERSISTENT_VOMITING",
      severity: "URGENT",
      title: "Persistent vomiting pattern",
      summary: "Vomiting has been logged across multiple days.",
      recommendation,
    });
  }

  if (lowDays(input.hydrationOzByDay, input.hydrationGoalOz * 0.55) >= 2 || hasSymptom(input, "dizziness")) {
    flags.push({
      type: "DEHYDRATION_RISK",
      severity: "ELEVATED",
      title: "Possible dehydration risk",
      summary: "Hydration has been low or dehydration-related symptoms were logged.",
      recommendation,
    });
  }

  if (input.symptoms.some((item) => item.symptom.toLowerCase().includes("constipation") && (item.durationDays ?? 0) >= 3)) {
    flags.push({
      type: "CONSTIPATION_MULTIPLE_DAYS",
      severity: "ELEVATED",
      title: "Constipation lasting multiple days",
      summary: "Constipation has been logged for three or more days.",
      recommendation,
    });
  }

  if (
    input.symptoms.some(
      (item) =>
        item.symptom.toLowerCase().includes("nausea") &&
        item.afterDoseIncrease &&
        (item.severity === "MODERATE" || item.severity === "SEVERE"),
    )
  ) {
    flags.push({
      type: "NAUSEA_WORSENING_AFTER_DOSE_INCREASE",
      severity: "ELEVATED",
      title: "Nausea worsened after dose increase",
      summary: "Moderate or severe nausea was logged after a recent dose increase.",
      recommendation,
    });
  }

  if (input.missedDose) {
    flags.push({
      type: "MISSED_DOSE",
      severity: "WATCH",
      title: "Missed dose logged",
      summary: "A scheduled dose was marked missed.",
      recommendation,
    });
  }

  if (Math.abs(input.weightChangePercentPerWeek ?? 0) >= 2.5) {
    flags.push({
      type: "RAPID_WEIGHT_CHANGE",
      severity: "ELEVATED",
      title: "Rapid weight change",
      summary: "Weight changed faster than the configured weekly review threshold.",
      recommendation,
    });
  }

  if (lowDays(input.hydrationOzByDay, input.hydrationGoalOz * 0.7) >= 3) {
    flags.push({
      type: "LOW_HYDRATION_MULTIPLE_DAYS",
      severity: "WATCH",
      title: "Low hydration across multiple days",
      summary: "Hydration has been below target for three or more days.",
      recommendation,
    });
  }

  if (lowDays(input.proteinGramsByDay, input.proteinGoalGrams * 0.7) >= 3) {
    flags.push({
      type: "LOW_PROTEIN_MULTIPLE_DAYS",
      severity: "WATCH",
      title: "Low protein across multiple days",
      summary: "Protein intake has been below target for three or more days.",
      recommendation,
    });
  }

  return flags;
}

export const demoSafetyFlags = evaluateSafetyFlags({
  symptoms: [
    { symptom: "nausea", severity: "MODERATE", afterDoseIncrease: true },
    { symptom: "constipation", severity: "MODERATE", durationDays: 3 },
  ],
  missedDose: true,
  hydrationOzByDay: [58, 62, 68, 74, 64],
  proteinGramsByDay: [88, 92, 84, 105, 96],
  weightChangePercentPerWeek: -1.8,
  hydrationGoalOz: 90,
  proteinGoalGrams: 120,
});
