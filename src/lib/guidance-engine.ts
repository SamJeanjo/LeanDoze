import { SymptomSeverity } from "@prisma/client";

export type GuidanceCategory = "nutrition" | "hydration" | "symptoms" | "movement" | "consistency";

export type GuidanceInput = {
  date: Date;
  proteinToday: number;
  proteinGoal: number;
  hydrationToday: number;
  hydrationGoal: number;
  proteinLastDays: number[];
  hydrationLastDays: number[];
  energyLastDays: number[];
  symptomsToday?: {
    nausea?: SymptomSeverity;
    vomiting?: SymptomSeverity;
    constipation?: SymptomSeverity;
    diarrhea?: SymptomSeverity;
    reflux?: SymptomSeverity;
    fatigue?: SymptomSeverity;
    abdominalPain?: SymptomSeverity;
  };
  symptomsLoggedToday: boolean;
  daysSinceDose?: number;
  movementMinutesToday?: number;
  strengthTrainingToday?: boolean;
  constipationDays?: number;
};

export type GuidanceResult = {
  title: string;
  message: string;
  category: GuidanceCategory;
  priority: number;
  date: Date;
};

const supportivePrefix = {
  nutrition: "Protein is below your target today.",
  hydration: "Hydration is below your target today.",
  symptoms: "Your symptom log is useful context.",
  movement: "Movement helps protect strength during weight change.",
  consistency: "Your consistency is building a clearer trend.",
} satisfies Record<GuidanceCategory, string>;

function belowForThreeDays(values: number[], goal: number) {
  return values.slice(0, 3).length >= 3 && values.slice(0, 3).every((value) => value < goal);
}

function isModerateOrSevere(severity?: SymptomSeverity) {
  return severity === SymptomSeverity.MODERATE || severity === SymptomSeverity.SEVERE;
}

export function generateGuidance(input: GuidanceInput): GuidanceResult[] {
  const guidance: GuidanceResult[] = [];

  if (input.proteinToday < input.proteinGoal) {
    guidance.push({
      title: "Protein anchor",
      message:
        "Protein is below your target today. Try to anchor your next meal around protein and keep logging so your clinician can see the pattern.",
      category: "nutrition",
      priority: 2,
      date: input.date,
    });
  }

  if (input.hydrationToday < input.hydrationGoal) {
    guidance.push({
      title: "Hydration target",
      message:
        "Hydration is below your target today. Keep fluids visible and log again later so your care team can review the trend if it continues.",
      category: "hydration",
      priority: 2,
      date: input.date,
    });
  }

  if (belowForThreeDays(input.hydrationLastDays, input.hydrationGoal)) {
    guidance.push({
      title: "Hydration pattern",
      message:
        "Hydration has been below target across multiple days. Keep tracking and review the pattern with your clinician if it feels hard to correct.",
      category: "hydration",
      priority: 3,
      date: input.date,
    });
  }

  if (belowForThreeDays(input.proteinLastDays, input.proteinGoal)) {
    guidance.push({
      title: "Protein consistency",
      message:
        "Protein has been below target across multiple days. A small protein anchor at meals can help make the trend easier to discuss with your clinician.",
      category: "nutrition",
      priority: 3,
      date: input.date,
    });
  }

  if ((input.daysSinceDose ?? 99) <= 2 && isModerateOrSevere(input.symptomsToday?.nausea)) {
    guidance.push({
      title: "Nausea after dose day",
      message:
        "Moderate nausea was logged near dose day. Keep logging symptoms, hydration, and meals so your clinician has clear context.",
      category: "symptoms",
      priority: 3,
      date: input.date,
    });
  }

  if ((input.constipationDays ?? 0) >= 3) {
    guidance.push({
      title: "Constipation trend",
      message:
        "Constipation has appeared across multiple days. Keep logging bowel movement patterns and review this with your clinician.",
      category: "symptoms",
      priority: 3,
      date: input.date,
    });
  }

  const lowHydration = input.hydrationToday < input.hydrationGoal;
  const lowProtein = input.proteinToday < input.proteinGoal;
  if (isModerateOrSevere(input.symptomsToday?.fatigue) && (lowHydration || lowProtein)) {
    guidance.push({
      title: "Energy support",
      message:
        "Fatigue showed up alongside lower protein or hydration. Keep logging these together so the pattern is easier to review with your clinician.",
      category: "consistency",
      priority: 2,
      date: input.date,
    });
  }

  if (!input.symptomsLoggedToday) {
    guidance.push({
      title: "Symptom check",
      message:
        "No symptoms have been logged today. A quick check-in helps keep your report accurate, even when symptoms are mild or absent.",
      category: "symptoms",
      priority: 1,
      date: input.date,
    });
  }

  if (
    input.proteinLastDays.slice(0, 3).every((value) => value >= input.proteinGoal) &&
    input.hydrationLastDays.slice(0, 3).every((value) => value >= input.hydrationGoal)
  ) {
    guidance.push({
      title: "Consistency streak",
      message:
        "Protein and hydration have been steady recently. Keep the rhythm going and bring the trend into your next clinician review.",
      category: "consistency",
      priority: 1,
      date: input.date,
    });
  }

  if (!input.movementMinutesToday && !input.strengthTrainingToday) {
    guidance.push({
      title: "Movement check",
      message: `${supportivePrefix.movement} A short walk or strength-focused movement can be logged here for muscle protection context.`,
      category: "movement",
      priority: 1,
      date: input.date,
    });
  }

  return guidance;
}
