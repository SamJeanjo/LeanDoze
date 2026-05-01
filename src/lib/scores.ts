import { SymptomSeverity } from "@prisma/client";

export type MuscleScoreInput = {
  proteinGoal: number;
  hydrationGoal: number;
  proteinLast7: number[];
  hydrationLast7: number[];
  movementMinutesLast7: number[];
  strengthTrainingDaysLast7: number;
  weightChangePercentPerWeek?: number;
  energyLast7: number[];
};

export type MuscleProtectionScore = {
  score: number;
  label: "Needs attention" | "Building consistency" | "Stable" | "Strong";
  explanation: string;
};

export type DoseRhythmInput = {
  nextDoseDate?: Date | null;
  lastDoseTakenDate?: Date | null;
  symptomsLast3: Array<{
    nausea: SymptomSeverity;
    vomiting: SymptomSeverity;
    abdominalPain: SymptomSeverity;
  }>;
  hydrationLast3: number[];
  proteinLast3: number[];
  hydrationGoal: number;
  proteinGoal: number;
};

export type DoseRhythmStatus = {
  status: "On schedule" | "Check in" | "Needs review";
  explanation: string;
};

function consistency(values: number[], goal: number) {
  if (!values.length || goal <= 0) {
    return 0;
  }

  return values.filter((value) => value >= goal).length / values.length;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function calculateMuscleProtectionScore(input: MuscleScoreInput): MuscleProtectionScore {
  const proteinScore = consistency(input.proteinLast7, input.proteinGoal) * 32;
  const hydrationScore = consistency(input.hydrationLast7, input.hydrationGoal) * 20;
  const movementScore = Math.min(1, input.movementMinutesLast7.reduce((sum, value) => sum + value, 0) / 150) * 18;
  const strengthScore = Math.min(1, input.strengthTrainingDaysLast7 / 2) * 14;
  const weightLossPenalty = Math.max(0, ((input.weightChangePercentPerWeek ?? 0) - 1.5) * 5);
  const energyScore = Math.min(1, average(input.energyLast7) / 8) * 16;
  const score = Math.max(0, Math.min(100, Math.round(proteinScore + hydrationScore + movementScore + strengthScore + energyScore - weightLossPenalty)));

  const label =
    score < 45 ? "Needs attention" : score < 68 ? "Building consistency" : score < 84 ? "Stable" : "Strong";

  const explanation =
    score >= 84
      ? "Protein, hydration, movement, and energy trends are supporting lean mass protection."
      : score >= 68
        ? "Your core habits are mostly steady. Protein and strength consistency have the biggest impact from here."
        : "Protein, hydration, movement, or energy trends need more consistent logging and review.";

  return { score, label, explanation };
}

export function calculateDoseRhythmStatus(input: DoseRhythmInput): DoseRhythmStatus {
  const severeSymptoms = input.symptomsLast3.some(
    (symptom) =>
      symptom.abdominalPain === SymptomSeverity.SEVERE ||
      symptom.vomiting === SymptomSeverity.SEVERE,
  );

  if (severeSymptoms) {
    return {
      status: "Needs review",
      explanation: "Severe symptoms were logged recently. Seek medical guidance or contact your clinician.",
    };
  }

  const lowHydration = input.hydrationLast3.length >= 3 && input.hydrationLast3.every((value) => value < input.hydrationGoal);
  const lowProtein = input.proteinLast3.length >= 3 && input.proteinLast3.every((value) => value < input.proteinGoal);

  if (lowHydration || lowProtein) {
    return {
      status: "Check in",
      explanation: "Protein or hydration has been below target recently. Review this with your clinician if the pattern continues.",
    };
  }

  if (!input.nextDoseDate) {
    return {
      status: "Check in",
      explanation: "Add your next dose date to keep dose rhythm tracking accurate.",
    };
  }

  const today = new Date();
  const nextDoseDay = new Date(input.nextDoseDate.toDateString());
  const dayDiff = Math.round((nextDoseDay.getTime() - new Date(today.toDateString()).getTime()) / 86_400_000);

  if (dayDiff < 0) {
    return {
      status: "Check in",
      explanation: "Your next dose date appears past due. Log your dose status and review timing with your clinician.",
    };
  }

  return {
    status: "On schedule",
    explanation: dayDiff === 0 ? "Today is listed as dose day." : `Next dose is scheduled in ${dayDiff} day${dayDiff === 1 ? "" : "s"}.`,
  };
}
