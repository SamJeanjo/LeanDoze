import type { DailyLogMock, PatientProfileMock, TodayPlanMock } from "@/lib/mockPatientData";

export function currentDoseCycleDay(plan: TodayPlanMock) {
  return plan.doseCycleDay;
}

export function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function weightChange(profile: PatientProfileMock) {
  return Number((profile.currentWeight - profile.startingWeight).toFixed(1));
}

export function proteinAdherence(logs: DailyLogMock[], goal: number) {
  return Math.round((logs.filter((log) => log.proteinGrams >= goal * 0.85).length / logs.length) * 100);
}

export function hydrationAdherence(logs: DailyLogMock[], goal: number) {
  return Math.round((logs.filter((log) => log.hydrationOz >= goal * 0.85).length / logs.length) * 100);
}

export function muscleProtectionScore(logs: DailyLogMock[], profile: PatientProfileMock) {
  const recent = logs.slice(-7);
  const protein = proteinAdherence(recent, profile.proteinGoal);
  const hydration = hydrationAdherence(recent, profile.hydrationGoal);
  const activity = Math.round((recent.filter((log) => log.activityCompleted).length / recent.length) * 100);
  const energy = average(recent.map((log) => log.energyLevel)) * 10;
  const score = Math.round(protein * 0.34 + hydration * 0.24 + activity * 0.24 + energy * 0.18);

  return {
    score: Math.max(0, Math.min(100, score)),
    label: score >= 85 ? "Strong" : score >= 72 ? "Stable" : score >= 58 ? "Building consistency" : "Needs attention",
    explanation: "Based on protein consistency, hydration, strength activity, energy, and pace of weight change.",
  };
}

export function doseCycleCopy(day: number) {
  const copy: Record<number, { appetite: string; watch: string }> = {
    1: { appetite: "Appetite may dip", watch: "nausea, reflux, hydration" },
    2: { appetite: "Lower appetite possible", watch: "hydration, constipation" },
    3: { appetite: "Protein can be easy to miss", watch: "fatigue, low appetite" },
    4: { appetite: "Usually more steady", watch: "constipation patterns" },
    5: { appetite: "Often steadier", watch: "energy and activity" },
    6: { appetite: "Meal rhythm may return", watch: "protein consistency" },
    7: { appetite: "Prep for next dose", watch: "questions for clinician" },
  };

  return copy[day] ?? copy[3];
}

export function clinicianReportSummary(logs: DailyLogMock[], profile: PatientProfileMock) {
  const recent = logs.slice(-14);
  const symptoms = recent.flatMap((log) => log.symptoms);
  const flagged = symptoms.filter((symptom) => symptom.clinicianFlag);

  return {
    weightTrend: `${weightChange(profile)} lb since start`,
    symptomNotes: flagged.length ? `${flagged.length} symptom note${flagged.length === 1 ? "" : "s"} marked for clinician` : "No symptom notes marked for clinician",
    protein: `${proteinAdherence(recent, profile.proteinGoal)}% protein adherence`,
    hydration: `${hydrationAdherence(recent, profile.hydrationGoal)}% hydration adherence`,
    dose: `${recent.filter((log) => log.doseTaken).length} of ${recent.length} dose/check-in days on rhythm`,
    questions: ["How should I think about appetite changes?", "What patterns should I keep tracking?", "Are my protein and hydration targets appropriate?"],
  };
}
