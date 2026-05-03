import {
  type ClinicReportPatient,
  type PatientLog,
  type ReportFilter,
  type RiskStatus,
} from "@/lib/mockClinicReports";

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function weightChange(patient: ClinicReportPatient) {
  return Number((patient.currentWeight - patient.startingWeight).toFixed(1));
}

export function riskTone(status: RiskStatus) {
  if (status === "Needs follow-up") {
    return "coral";
  }

  if (status === "Watch") {
    return "amber";
  }

  return "green";
}

export function ageRangeFor(age: number) {
  if (age < 35) return "18-34";
  if (age < 50) return "35-49";
  if (age < 65) return "50-64";
  return "65+";
}

export function treatmentStage(startDate: string) {
  const start = new Date(startDate).getTime();
  const now = new Date("2026-05-03T12:00:00.000Z").getTime();
  const weeks = Math.max(0, Math.floor((now - start) / 604_800_000));

  if (weeks <= 4) return "0-4 weeks";
  if (weeks <= 12) return "5-12 weeks";
  if (weeks <= 24) return "13-24 weeks";
  return "6+ months";
}

export function filterPatients(
  patients: ClinicReportPatient[],
  logs: PatientLog[],
  filters: ReportFilter,
) {
  const search = filters.search.trim().toLowerCase();

  return patients.filter((patient) => {
    const patientLogs = logs.filter((log) => log.patientId === patient.id);
    const symptomNames = new Set(patientLogs.flatMap((log) => log.symptoms.map((symptom) => symptom.name)));
    const medicationMatch = filters.medication === "All" || patient.medication === filters.medication;
    const brandMatch = filters.brand === "All" || patient.brand === filters.brand;
    const doseMatch = filters.dose === "All" || patient.dose === filters.dose;
    const sexMatch = filters.sex === "All" || patient.sex === filters.sex;
    const ageMatch = filters.ageRange === "All" || ageRangeFor(patient.age) === filters.ageRange;
    const riskMatch = filters.riskStatus === "All" || patient.riskStatus === filters.riskStatus;
    const adherenceMatch = filters.adherenceStatus === "All" || patient.adherenceStatus === filters.adherenceStatus;
    const symptomMatch = !filters.symptoms.length || filters.symptoms.every((symptom) => symptomNames.has(symptom));
    const searchMatch = !search || patient.name.toLowerCase().includes(search);

    return medicationMatch && brandMatch && doseMatch && sexMatch && ageMatch && riskMatch && adherenceMatch && symptomMatch && searchMatch;
  });
}

export function logsForPatients(logs: PatientLog[], patients: ClinicReportPatient[]) {
  const ids = new Set(patients.map((patient) => patient.id));
  return logs.filter((log) => ids.has(log.patientId));
}

export function getKpis(patients: ClinicReportPatient[], logs: PatientLog[]) {
  const activePatients = patients.filter((patient) => patient.status === "Active").length;
  const avgWeightChange = patients.length
    ? patients.reduce((sum, patient) => sum + weightChange(patient), 0) / patients.length
    : 0;
  const symptomaticPatients = patients.filter((patient) =>
    logs.some((log) => log.patientId === patient.id && log.symptoms.length),
  ).length;
  const missedDoseLogs = logs.filter((log) => !log.doseTaken).length;
  const proteinAdherence = logs.length
    ? (logs.filter((log) => log.proteinGrams >= log.proteinGoal * 0.85).length / logs.length) * 100
    : 0;
  const hydrationAdherence = logs.length
    ? (logs.filter((log) => log.hydrationOz >= log.hydrationGoal * 0.85).length / logs.length) * 100
    : 0;
  const followUpPatients = patients.filter((patient) => patient.riskStatus === "Needs follow-up").length;
  const avgMuscleScore = patients.length
    ? patients.reduce((sum, patient) => sum + patient.muscleProtectionScore, 0) / patients.length
    : 0;

  return {
    activePatients,
    avgWeightChange,
    symptomaticPatients,
    missedDoseRate: logs.length ? (missedDoseLogs / logs.length) * 100 : 0,
    proteinAdherence,
    hydrationAdherence,
    followUpPatients,
    avgMuscleScore,
  };
}

export function groupByDate(logs: PatientLog[]) {
  return Object.values(
    logs.reduce<Record<string, { date: string; weight: number[]; adherence: number[]; symptoms: number; muscle: number[] }>>(
      (groups, log) => {
        groups[log.date] ??= { date: log.date, weight: [], adherence: [], symptoms: 0, muscle: [] };
        groups[log.date].weight.push(log.weight);
        groups[log.date].adherence.push(log.doseTaken ? 100 : 0);
        groups[log.date].symptoms += log.symptoms.length;
        groups[log.date].muscle.push(
          Math.min(100, Math.round((log.proteinGrams / log.proteinGoal) * 42 + (log.hydrationOz / log.hydrationGoal) * 32 + (log.activityCompleted ? 18 : 4))),
        );
        return groups;
      },
      {},
    ),
  ).map((item) => ({
    date: item.date.slice(5),
    weight: average(item.weight),
    adherence: average(item.adherence),
    symptoms: item.symptoms,
    muscle: average(item.muscle),
  }));
}

export function average(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function symptomStats(logs: PatientLog[]) {
  const stats = new Map<string, { name: string; mild: number; moderate: number; severe: number; total: number }>();

  for (const symptom of logs.flatMap((log) => log.symptoms)) {
    const row = stats.get(symptom.name) ?? { name: symptom.name, mild: 0, moderate: 0, severe: 0, total: 0 };
    row.total += 1;
    if (symptom.severity === "Mild") row.mild += 1;
    if (symptom.severity === "Moderate") row.moderate += 1;
    if (symptom.severity === "Severe") row.severe += 1;
    stats.set(symptom.name, row);
  }

  return [...stats.values()].sort((a, b) => b.total - a.total);
}

export function medicationRows(patients: ClinicReportPatient[], logs: PatientLog[]) {
  const meds = ["Semaglutide", "Tirzepatide", "Liraglutide", "Other"];
  return meds.map((medication) => {
    const medPatients = patients.filter((patient) => patient.medication === medication);
    const medLogs = logsForPatients(logs, medPatients);
    const symptoms = symptomStats(medLogs).slice(0, 2).map((item) => item.name).join(", ") || "Low";
    const missed = medLogs.length ? (medLogs.filter((log) => !log.doseTaken).length / medLogs.length) * 100 : 0;
    const protein = medLogs.length ? (medLogs.filter((log) => log.proteinGrams >= log.proteinGoal * 0.85).length / medLogs.length) * 100 : 0;

    return {
      medication,
      patients: medPatients.length,
      avgWeightChange: medPatients.length ? medPatients.reduce((sum, patient) => sum + weightChange(patient), 0) / medPatients.length : 0,
      commonSymptoms: symptoms,
      missedDoseRate: missed,
      avgAdherence: protein,
      followUpFlags: medPatients.filter((patient) => patient.riskStatus !== "Stable").length,
    };
  });
}

export function segmentCounts(patients: ClinicReportPatient[], by: "sex" | "age" | "stage") {
  return Object.values(
    patients.reduce<Record<string, { name: string; stable: number; watch: number; followUp: number; total: number }>>((groups, patient) => {
      const name = by === "sex" ? patient.sex : by === "age" ? ageRangeFor(patient.age) : treatmentStage(patient.startDate);
      groups[name] ??= { name, stable: 0, watch: 0, followUp: 0, total: 0 };
      groups[name].total += 1;
      if (patient.riskStatus === "Stable") groups[name].stable += 1;
      if (patient.riskStatus === "Watch") groups[name].watch += 1;
      if (patient.riskStatus === "Needs follow-up") groups[name].followUp += 1;
      return groups;
    }, {}),
  );
}
