export type PatientProfileMock = {
  id: string;
  name: string;
  medication: string;
  brand: string;
  route: "injection" | "pill";
  dose: string;
  doseDay: string;
  startDate: string;
  lastDoseDate: string;
  nextDoseDate: string;
  currentWeight: number;
  startingWeight: number;
  goalWeight: number;
  proteinGoal: number;
  hydrationGoal: number;
  mainConcern: string;
  clinicConnected: boolean;
};

export type SymptomLogMock = {
  symptom: string;
  severity: "mild" | "moderate" | "severe";
  dayAfterDose: number;
  note?: string;
  clinicianFlag: boolean;
};

export type DailyLogMock = {
  date: string;
  weight: number;
  proteinGrams: number;
  hydrationOz: number;
  symptoms: SymptomLogMock[];
  energyLevel: number;
  appetiteLevel: number;
  activityCompleted: boolean;
  doseTaken: boolean;
  notes: string;
};

export type TodayAction = {
  id: string;
  title: string;
  reason: string;
  cta: string;
  state: "complete" | "due" | "planned";
  progress: number;
};

export type TodayPlanMock = {
  doseCycleDay: number;
  priority: string;
  actions: TodayAction[];
  insight: string;
  riskNotice?: string;
};

export const patientProfileMock: PatientProfileMock = {
  id: "emma-rivera",
  name: "Emma Rivera",
  medication: "Semaglutide",
  brand: "Wegovy",
  route: "injection",
  dose: "0.5 mg",
  doseDay: "Monday",
  startDate: "2026-03-23",
  lastDoseDate: "2026-04-30",
  nextDoseDate: "2026-05-07",
  currentWeight: 182.4,
  startingWeight: 191.2,
  goalWeight: 165,
  proteinGoal: 120,
  hydrationGoal: 90,
  mainConcern: "staying consistent",
  clinicConnected: true,
};

export const dailyLogsMock: DailyLogMock[] = [
  {
    date: "2026-04-27",
    weight: 185.8,
    proteinGrams: 96,
    hydrationOz: 84,
    symptoms: [{ symptom: "nausea", severity: "mild", dayAfterDose: 1, clinicianFlag: false }],
    energyLevel: 7,
    appetiteLevel: 5,
    activityCompleted: true,
    doseTaken: true,
    notes: "A little nausea after breakfast, improved by afternoon.",
  },
  {
    date: "2026-04-28",
    weight: 185.2,
    proteinGrams: 112,
    hydrationOz: 92,
    symptoms: [],
    energyLevel: 8,
    appetiteLevel: 6,
    activityCompleted: true,
    doseTaken: true,
    notes: "Protein smoothie helped.",
  },
  {
    date: "2026-04-29",
    weight: 184.7,
    proteinGrams: 88,
    hydrationOz: 76,
    symptoms: [{ symptom: "low appetite", severity: "mild", dayAfterDose: 3, clinicianFlag: false }],
    energyLevel: 6,
    appetiteLevel: 4,
    activityCompleted: false,
    doseTaken: true,
    notes: "Lower appetite day.",
  },
  {
    date: "2026-04-30",
    weight: 184.1,
    proteinGrams: 104,
    hydrationOz: 86,
    symptoms: [],
    energyLevel: 7,
    appetiteLevel: 5,
    activityCompleted: true,
    doseTaken: true,
    notes: "Short strength walk.",
  },
  {
    date: "2026-05-01",
    weight: 183.5,
    proteinGrams: 92,
    hydrationOz: 68,
    symptoms: [{ symptom: "constipation", severity: "mild", dayAfterDose: 1, clinicianFlag: true }],
    energyLevel: 6,
    appetiteLevel: 4,
    activityCompleted: false,
    doseTaken: true,
    notes: "Mention constipation if it continues.",
  },
  {
    date: "2026-05-02",
    weight: 182.9,
    proteinGrams: 118,
    hydrationOz: 88,
    symptoms: [],
    energyLevel: 8,
    appetiteLevel: 6,
    activityCompleted: true,
    doseTaken: true,
    notes: "Good protein day.",
  },
  {
    date: "2026-05-03",
    weight: 182.4,
    proteinGrams: 64,
    hydrationOz: 44,
    symptoms: [],
    energyLevel: 7,
    appetiteLevel: 5,
    activityCompleted: false,
    doseTaken: true,
    notes: "Morning log started.",
  },
];

export const todayPlanMock: TodayPlanMock = {
  doseCycleDay: 3,
  priority: "protein + hydration",
  insight: "Today is a protein + hydration priority day.",
  actions: [
    {
      id: "protein-first",
      title: "Protein first",
      reason: "Low appetite days can make protein easy to miss.",
      cta: "Log protein",
      state: "due",
      progress: 53,
    },
    {
      id: "hydrate-early",
      title: "Hydrate early",
      reason: "Front-loading water can make the rest of the day easier.",
      cta: "Add water",
      state: "due",
      progress: 49,
    },
    {
      id: "log-symptoms",
      title: "Log symptoms",
      reason: "A 10-second symptom check keeps your report accurate.",
      cta: "Log symptoms",
      state: "planned",
      progress: 0,
    },
    {
      id: "strength",
      title: "10-minute strength",
      reason: "Support muscle retention habits while weight changes.",
      cta: "Log activity",
      state: "planned",
      progress: 0,
    },
    {
      id: "meal-prep",
      title: "Prep next meal",
      reason: "Future-you has an easier time hitting protein.",
      cta: "Plan meal",
      state: "complete",
      progress: 100,
    },
  ],
};

export const nonScaleWins = [
  "Clothes fit better",
  "Fewer cravings after lunch",
  "Better energy on strength days",
  "Walked more this week",
  "Protein goal hit 3 days",
  "Symptoms improved after day 2",
];

export const progressPhotos = [
  { label: "Start", date: "Mar 23", tone: "bg-[#FFF7ED]" },
  { label: "Week 4", date: "Apr 20", tone: "bg-[#ECFEFF]" },
  { label: "Week 6", date: "May 3", tone: "bg-[#F0FDF4]" },
];
