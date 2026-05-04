export type SymptomSeverity = "mild" | "moderate" | "severe";

export type PatientSymptomLog = {
  id: string;
  date: string;
  symptom: string;
  severity: SymptomSeverity;
  note?: string;
  mentionToClinician: boolean;
  doseCycleDay: number;
  createdAt: string;
};

export type PatientDailyLog = {
  id: string;
  date: string;
  weight?: number;
  proteinGrams: number;
  hydrationOz: number;
  symptoms: PatientSymptomLog[];
  notes?: string;
  completedActions: string[];
  createdAt: string;
  updatedAt: string;
};

export type PatientWeightLog = {
  id: string;
  date: string;
  weight: number;
  createdAt: string;
};

export type PatientNutritionLog = {
  id: string;
  date: string;
  proteinGrams: number;
  createdAt: string;
};

export type PatientHydrationLog = {
  id: string;
  date: string;
  hydrationOz: number;
  createdAt: string;
};

export type PatientStorageState = {
  dailyLogs: PatientDailyLog[];
  symptomLogs: PatientSymptomLog[];
  weightLogs: PatientWeightLog[];
  proteinLogs: PatientNutritionLog[];
  hydrationLogs: PatientHydrationLog[];
  completedActions: Record<string, string[]>;
};

const storageKey = "leandoze.patient.v1";

export const patientStateChangedEvent = "leandoze:patient-state";
export const openQuickCheckInEvent = "leandoze:open-quick-checkin";

export const emptyPatientState: PatientStorageState = {
  dailyLogs: [],
  symptomLogs: [],
  weightLogs: [],
  proteinLogs: [],
  hydrationLogs: [],
  completedActions: {},
};

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function makeId(prefix: string) {
  const cryptoValue =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${cryptoValue}`;
}

function dedupeActions(actions: string[]) {
  return Array.from(new Set(actions));
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getPatientState(): PatientStorageState {
  if (!canUseStorage()) return emptyPatientState;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return emptyPatientState;

    const parsed = JSON.parse(raw) as Partial<PatientStorageState>;

    return {
      dailyLogs: parsed.dailyLogs ?? [],
      symptomLogs: parsed.symptomLogs ?? [],
      weightLogs: parsed.weightLogs ?? [],
      proteinLogs: parsed.proteinLogs ?? [],
      hydrationLogs: parsed.hydrationLogs ?? [],
      completedActions: parsed.completedActions ?? {},
    };
  } catch {
    return emptyPatientState;
  }
}

export function savePatientState(state: PatientStorageState) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(patientStateChangedEvent, { detail: state }));
}

function updateDailyLog(
  state: PatientStorageState,
  updater: (log: PatientDailyLog) => PatientDailyLog,
  date = todayKey(),
) {
  const existing = state.dailyLogs.find((log) => log.date === date);
  const now = new Date().toISOString();
  const base: PatientDailyLog =
    existing ??
    {
      id: makeId("daily"),
      date,
      proteinGrams: 0,
      hydrationOz: 0,
      symptoms: [],
      completedActions: [],
      createdAt: now,
      updatedAt: now,
    };

  const nextLog = updater({ ...base, updatedAt: now });
  const nextDailyLogs = existing
    ? state.dailyLogs.map((log) => (log.date === date ? nextLog : log))
    : [...state.dailyLogs, nextLog];

  return {
    ...state,
    dailyLogs: nextDailyLogs,
    completedActions: {
      ...state.completedActions,
      [date]: dedupeActions(nextLog.completedActions),
    },
  };
}

export function getTodayPatientLog(state = getPatientState(), date = todayKey()) {
  return state.dailyLogs.find((log) => log.date === date);
}

export function getCompletedActionsForToday(state = getPatientState(), date = todayKey()) {
  const logActions = getTodayPatientLog(state, date)?.completedActions ?? [];
  const storedActions = state.completedActions[date] ?? [];
  return dedupeActions([...logActions, ...storedActions]);
}

export function saveWeightLog(weight: number, date = todayKey()) {
  const state = getPatientState();
  const now = new Date().toISOString();
  const nextState = updateDailyLog(
    {
      ...state,
      weightLogs: [...state.weightLogs.filter((log) => log.date !== date), { id: makeId("weight"), date, weight, createdAt: now }],
    },
    (log) => ({
      ...log,
      weight,
      completedActions: dedupeActions([...log.completedActions, "weight"]),
    }),
    date,
  );

  savePatientState(nextState);
  return nextState;
}

export function saveProteinLog(proteinGrams: number, date = todayKey()) {
  const state = getPatientState();
  const now = new Date().toISOString();
  const nextState = updateDailyLog(
    {
      ...state,
      proteinLogs: [...state.proteinLogs.filter((log) => log.date !== date), { id: makeId("protein"), date, proteinGrams, createdAt: now }],
    },
    (log) => ({
      ...log,
      proteinGrams,
      completedActions: dedupeActions([...log.completedActions, "protein-first"]),
    }),
    date,
  );

  savePatientState(nextState);
  return nextState;
}

export function saveHydrationLog(hydrationOz: number, date = todayKey()) {
  const state = getPatientState();
  const now = new Date().toISOString();
  const nextState = updateDailyLog(
    {
      ...state,
      hydrationLogs: [...state.hydrationLogs.filter((log) => log.date !== date), { id: makeId("hydration"), date, hydrationOz, createdAt: now }],
    },
    (log) => ({
      ...log,
      hydrationOz,
      completedActions: dedupeActions([...log.completedActions, "hydrate-early"]),
    }),
    date,
  );

  savePatientState(nextState);
  return nextState;
}

export function saveSymptomLog(input: {
  symptom: string;
  severity: SymptomSeverity;
  note?: string;
  mentionToClinician: boolean;
  doseCycleDay: number;
  date?: string;
}) {
  const date = input.date ?? todayKey();
  const state = getPatientState();
  const now = new Date().toISOString();
  const symptomLog: PatientSymptomLog = {
    id: makeId("symptom"),
    date,
    symptom: input.symptom,
    severity: input.severity,
    note: input.note,
    mentionToClinician: input.mentionToClinician,
    doseCycleDay: input.doseCycleDay,
    createdAt: now,
  };
  const nextState = updateDailyLog(
    {
      ...state,
      symptomLogs: [...state.symptomLogs, symptomLog],
    },
    (log) => ({
      ...log,
      symptoms: [...log.symptoms, symptomLog],
      completedActions: dedupeActions([...log.completedActions, "log-symptoms"]),
    }),
    date,
  );

  savePatientState(nextState);
  return nextState;
}

export function saveNoSymptomsToday(doseCycleDay: number, date = todayKey()) {
  const state = getPatientState();
  const now = new Date().toISOString();
  const nextState = updateDailyLog(state, (log) => ({
    ...log,
    notes: log.notes || "No symptoms today.",
    completedActions: dedupeActions([...log.completedActions, "log-symptoms"]),
    symptoms: log.symptoms,
    updatedAt: now,
  }), date);

  savePatientState(nextState);
  return nextState;
}

export function getLatestWeight(state = getPatientState()) {
  return [...state.weightLogs].sort((a, b) => b.date.localeCompare(a.date))[0]?.weight;
}

export function getTodaySummary(state = getPatientState(), date = todayKey()) {
  const today = getTodayPatientLog(state, date);

  return {
    date,
    weight: today?.weight ?? getLatestWeight(state),
    proteinGrams: today?.proteinGrams ?? 0,
    hydrationOz: today?.hydrationOz ?? 0,
    symptomCount: today?.symptoms.length ?? 0,
    symptomCheckDone: getCompletedActionsForToday(state, date).includes("log-symptoms"),
    completedActions: getCompletedActionsForToday(state, date),
  };
}

export function formatLocalLogsForReport(state = getPatientState()) {
  return state.dailyLogs
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => ({
      date: log.date,
      weight: log.weight ?? 0,
      proteinGrams: log.proteinGrams,
      hydrationOz: log.hydrationOz,
      symptoms: log.symptoms.map((symptom) => ({
        symptom: symptom.symptom,
        severity: symptom.severity,
        dayAfterDose: symptom.doseCycleDay,
        note: symptom.note,
        clinicianFlag: symptom.mentionToClinician,
      })),
      energyLevel: 0,
      appetiteLevel: 0,
      activityCompleted: log.completedActions.includes("strength"),
      doseTaken: true,
      notes: log.notes ?? "",
    }));
}
