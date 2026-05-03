export type RiskStatus = "Stable" | "Watch" | "Needs follow-up";
export type AdherenceStatus = "On track" | "Missed dose" | "Low logging";
export type SexValue = "Female" | "Male" | "Other / not specified";

export type SymptomEntry = {
  name: string;
  severity: "Mild" | "Moderate" | "Severe";
  dayAfterDose: number;
  medication: "Semaglutide" | "Tirzepatide" | "Liraglutide" | "Other";
  dose: string;
};

export type ClinicReportPatient = {
  id: string;
  name: string;
  sex: SexValue;
  age: number;
  medication: "Semaglutide" | "Tirzepatide" | "Liraglutide" | "Other";
  brand: "Ozempic" | "Wegovy" | "Mounjaro" | "Zepbound" | "Saxenda" | "Other";
  dose: string;
  startDate: string;
  currentWeight: number;
  startingWeight: number;
  goalWeight: number;
  status: "Active" | "Paused";
  riskStatus: RiskStatus;
  adherenceStatus: AdherenceStatus;
  lastLogDate: string;
  clinicianId: string;
  muscleProtectionScore: number;
  nextAppointment: string;
  notes: string;
};

export type PatientLog = {
  id: string;
  patientId: string;
  date: string;
  doseTaken: boolean;
  doseDayNumber: number;
  symptoms: SymptomEntry[];
  proteinGrams: number;
  proteinGoal: number;
  hydrationOz: number;
  hydrationGoal: number;
  weight: number;
  appetiteLevel: number;
  activityCompleted: boolean;
  notes: string;
};

export type ReportFilter = {
  dateRange: "7d" | "30d" | "90d" | "custom";
  search: string;
  medication: string;
  brand: string;
  dose: string;
  symptoms: string[];
  sex: string;
  ageRange: string;
  riskStatus: string;
  adherenceStatus: string;
};

export const defaultReportFilter: ReportFilter = {
  dateRange: "30d",
  search: "",
  medication: "All",
  brand: "All",
  dose: "All",
  symptoms: [],
  sex: "All",
  ageRange: "All",
  riskStatus: "All",
  adherenceStatus: "All",
};

export const reportPatients: ClinicReportPatient[] = [
  {
    id: "avery-morgan",
    name: "Avery Morgan",
    sex: "Female",
    age: 43,
    medication: "Semaglutide",
    brand: "Wegovy",
    dose: "0.5 mg",
    startDate: "2026-03-28",
    currentWeight: 199.4,
    startingWeight: 208.6,
    goalWeight: 175,
    status: "Active",
    riskStatus: "Needs follow-up",
    adherenceStatus: "Missed dose",
    lastLogDate: "2026-05-03",
    clinicianId: "clinic-01",
    muscleProtectionScore: 68,
    nextAppointment: "May 14, 2026",
    notes: "Hydration and protein below target over the last three days. Review with clinician.",
  },
  {
    id: "sam-jeanjo",
    name: "Sam Jeanjo",
    sex: "Male",
    age: 48,
    medication: "Tirzepatide",
    brand: "Zepbound",
    dose: "5 mg",
    startDate: "2026-03-15",
    currentWeight: 183.8,
    startingWeight: 187.4,
    goalWeight: 168,
    status: "Active",
    riskStatus: "Stable",
    adherenceStatus: "On track",
    lastLogDate: "2026-05-03",
    clinicianId: "clinic-01",
    muscleProtectionScore: 88,
    nextAppointment: "May 21, 2026",
    notes: "Consistent intake, hydration, and movement pattern.",
  },
  {
    id: "maria-carter",
    name: "Maria Carter",
    sex: "Female",
    age: 36,
    medication: "Tirzepatide",
    brand: "Mounjaro",
    dose: "7.5 mg",
    startDate: "2026-01-12",
    currentWeight: 214.2,
    startingWeight: 231.1,
    goalWeight: 190,
    status: "Active",
    riskStatus: "Watch",
    adherenceStatus: "On track",
    lastLogDate: "2026-05-02",
    clinicianId: "clinic-01",
    muscleProtectionScore: 76,
    nextAppointment: "May 17, 2026",
    notes: "Moderate nausea appears most often the day after dose.",
  },
  {
    id: "john-price",
    name: "John Price",
    sex: "Male",
    age: 57,
    medication: "Semaglutide",
    brand: "Ozempic",
    dose: "1 mg",
    startDate: "2025-12-03",
    currentWeight: 221.5,
    startingWeight: 246.8,
    goalWeight: 210,
    status: "Active",
    riskStatus: "Needs follow-up",
    adherenceStatus: "Low logging",
    lastLogDate: "2026-04-30",
    clinicianId: "clinic-01",
    muscleProtectionScore: 61,
    nextAppointment: "May 10, 2026",
    notes: "Logging dropped and hydration is inconsistent. Review pattern with clinician.",
  },
  {
    id: "nina-patel",
    name: "Nina Patel",
    sex: "Female",
    age: 29,
    medication: "Liraglutide",
    brand: "Saxenda",
    dose: "1.8 mg",
    startDate: "2026-04-08",
    currentWeight: 171.2,
    startingWeight: 176.4,
    goalWeight: 158,
    status: "Active",
    riskStatus: "Watch",
    adherenceStatus: "On track",
    lastLogDate: "2026-05-03",
    clinicianId: "clinic-01",
    muscleProtectionScore: 73,
    nextAppointment: "May 18, 2026",
    notes: "Constipation and low appetite recurring. Tracking only, review with clinician.",
  },
  {
    id: "eli-roberts",
    name: "Eli Roberts",
    sex: "Other / not specified",
    age: 51,
    medication: "Other",
    brand: "Other",
    dose: "Custom",
    startDate: "2026-02-20",
    currentWeight: 192.8,
    startingWeight: 204.2,
    goalWeight: 180,
    status: "Active",
    riskStatus: "Stable",
    adherenceStatus: "On track",
    lastLogDate: "2026-05-01",
    clinicianId: "clinic-01",
    muscleProtectionScore: 82,
    nextAppointment: "May 28, 2026",
    notes: "Stable trend with mild fatigue once this period.",
  },
];

const symptomPatterns: Record<string, Array<Omit<SymptomEntry, "medication" | "dose">>> = {
  "avery-morgan": [
    { name: "Nausea", severity: "Moderate", dayAfterDose: 1 },
    { name: "Constipation", severity: "Moderate", dayAfterDose: 3 },
    { name: "Dehydration", severity: "Moderate", dayAfterDose: 4 },
    { name: "Fatigue", severity: "Moderate", dayAfterDose: 2 },
  ],
  "sam-jeanjo": [{ name: "Nausea", severity: "Mild", dayAfterDose: 1 }],
  "maria-carter": [
    { name: "Nausea", severity: "Moderate", dayAfterDose: 1 },
    { name: "Low appetite", severity: "Mild", dayAfterDose: 2 },
    { name: "Reflux", severity: "Mild", dayAfterDose: 2 },
  ],
  "john-price": [
    { name: "Dehydration", severity: "Moderate", dayAfterDose: 3 },
    { name: "Dizziness", severity: "Mild", dayAfterDose: 4 },
    { name: "Fatigue", severity: "Moderate", dayAfterDose: 5 },
  ],
  "nina-patel": [
    { name: "Constipation", severity: "Moderate", dayAfterDose: 4 },
    { name: "Low appetite", severity: "Moderate", dayAfterDose: 2 },
  ],
  "eli-roberts": [{ name: "Fatigue", severity: "Mild", dayAfterDose: 2 }],
};

export const reportLogs: PatientLog[] = reportPatients.flatMap((patient) => {
  const weightDelta = (patient.currentWeight - patient.startingWeight) / 29;
  return Array.from({ length: 30 }, (_, index) => {
    const day = new Date("2026-05-03T12:00:00.000Z");
    day.setDate(day.getDate() - (29 - index));
    const doseDayNumber = (index % 7) + 1;
    const lowerAdherence = patient.adherenceStatus === "Missed dose" && index === 22;
    const lowLogging = patient.adherenceStatus === "Low logging" && index > 23;
    const symptomSeed = symptomPatterns[patient.id] ?? [];
    const symptoms = symptomSeed
      .filter((symptom, symptomIndex) => doseDayNumber === symptom.dayAfterDose || (index + symptomIndex) % 11 === 0)
      .map((symptom) => ({ ...symptom, medication: patient.medication, dose: patient.dose }));

    return {
      id: `${patient.id}-${index}`,
      patientId: patient.id,
      date: day.toISOString().slice(0, 10),
      doseTaken: !lowerAdherence,
      doseDayNumber,
      symptoms,
      proteinGrams: Math.round(patient.riskStatus === "Needs follow-up" ? 74 + (index % 5) * 5 : 112 + (index % 6) * 4),
      proteinGoal: patient.id === "sam-jeanjo" ? 125 : 120,
      hydrationOz: Math.round(patient.riskStatus === "Needs follow-up" ? 58 + (index % 6) * 4 : 86 + (index % 5) * 3),
      hydrationGoal: patient.id === "sam-jeanjo" ? 92 : 90,
      weight: Number((patient.startingWeight + weightDelta * index).toFixed(1)),
      appetiteLevel: patient.riskStatus === "Stable" ? 6 + (index % 3) : 4 + (index % 3),
      activityCompleted: patient.muscleProtectionScore > 78 ? index % 2 === 0 : index % 3 === 0,
      notes: lowLogging ? "No log entered for several days." : symptoms.length ? "Symptoms logged for clinician review." : "Routine check-in.",
    };
  });
});

export const symptomOptions = [
  "Nausea",
  "Constipation",
  "Vomiting",
  "Diarrhea",
  "Fatigue",
  "Low appetite",
  "Dehydration",
  "Dizziness",
  "Abdominal pain",
];
