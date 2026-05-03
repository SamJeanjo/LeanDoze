export const glp1MedicationOptions = [
  { value: "OZEMPIC", label: "Ozempic (semaglutide)" },
  { value: "WEGOVY", label: "Wegovy (semaglutide)" },
  { value: "MOUNJARO", label: "Mounjaro (tirzepatide)" },
  { value: "ZEPBOUND", label: "Zepbound (tirzepatide)" },
  { value: "RYBELSUS", label: "Rybelsus (oral semaglutide)" },
  { value: "SAXENDA", label: "Saxenda (liraglutide)" },
  { value: "OTHER", label: "Other / compounded / not listed" },
];

export const glp1DoseScheduleOptions = [
  { value: "OZEMPIC_025_WEEKLY_4", label: "Ozempic: 0.25 mg once weekly for 4 weeks", doseMg: 0.25, frequency: "WEEKLY" },
  { value: "OZEMPIC_05_WEEKLY", label: "Ozempic: 0.5 mg once weekly", doseMg: 0.5, frequency: "WEEKLY" },
  { value: "OZEMPIC_1_WEEKLY", label: "Ozempic: 1 mg once weekly", doseMg: 1, frequency: "WEEKLY" },
  { value: "OZEMPIC_2_WEEKLY", label: "Ozempic: 2 mg once weekly", doseMg: 2, frequency: "WEEKLY" },
  { value: "WEGOVY_025_WEEKLY_4", label: "Wegovy: 0.25 mg once weekly for 4 weeks", doseMg: 0.25, frequency: "WEEKLY" },
  { value: "WEGOVY_05_WEEKLY_4", label: "Wegovy: 0.5 mg once weekly for 4 weeks", doseMg: 0.5, frequency: "WEEKLY" },
  { value: "WEGOVY_1_WEEKLY_4", label: "Wegovy: 1 mg once weekly for 4 weeks", doseMg: 1, frequency: "WEEKLY" },
  { value: "WEGOVY_17_WEEKLY", label: "Wegovy: 1.7 mg once weekly", doseMg: 1.7, frequency: "WEEKLY" },
  { value: "WEGOVY_24_WEEKLY", label: "Wegovy: 2.4 mg once weekly", doseMg: 2.4, frequency: "WEEKLY" },
  { value: "MOUNJARO_25_WEEKLY_4", label: "Mounjaro: 2.5 mg once weekly for 4 weeks", doseMg: 2.5, frequency: "WEEKLY" },
  { value: "MOUNJARO_5_WEEKLY", label: "Mounjaro: 5 mg once weekly", doseMg: 5, frequency: "WEEKLY" },
  { value: "MOUNJARO_75_WEEKLY", label: "Mounjaro: 7.5 mg once weekly", doseMg: 7.5, frequency: "WEEKLY" },
  { value: "MOUNJARO_10_WEEKLY", label: "Mounjaro: 10 mg once weekly", doseMg: 10, frequency: "WEEKLY" },
  { value: "MOUNJARO_125_WEEKLY", label: "Mounjaro: 12.5 mg once weekly", doseMg: 12.5, frequency: "WEEKLY" },
  { value: "MOUNJARO_15_WEEKLY", label: "Mounjaro: 15 mg once weekly", doseMg: 15, frequency: "WEEKLY" },
  { value: "ZEPBOUND_25_WEEKLY_4", label: "Zepbound: 2.5 mg once weekly for 4 weeks", doseMg: 2.5, frequency: "WEEKLY" },
  { value: "ZEPBOUND_5_WEEKLY", label: "Zepbound: 5 mg once weekly", doseMg: 5, frequency: "WEEKLY" },
  { value: "ZEPBOUND_75_WEEKLY", label: "Zepbound: 7.5 mg once weekly", doseMg: 7.5, frequency: "WEEKLY" },
  { value: "ZEPBOUND_10_WEEKLY", label: "Zepbound: 10 mg once weekly", doseMg: 10, frequency: "WEEKLY" },
  { value: "ZEPBOUND_125_WEEKLY", label: "Zepbound: 12.5 mg once weekly", doseMg: 12.5, frequency: "WEEKLY" },
  { value: "ZEPBOUND_15_WEEKLY", label: "Zepbound: 15 mg once weekly", doseMg: 15, frequency: "WEEKLY" },
  { value: "RYBELSUS_3_DAILY_30", label: "Rybelsus: 3 mg once daily for 30 days", doseMg: 3, frequency: "DAILY" },
  { value: "RYBELSUS_7_DAILY", label: "Rybelsus: 7 mg once daily", doseMg: 7, frequency: "DAILY" },
  { value: "RYBELSUS_14_DAILY", label: "Rybelsus: 14 mg once daily", doseMg: 14, frequency: "DAILY" },
  { value: "SAXENDA_06_DAILY_7", label: "Saxenda: 0.6 mg once daily for 1 week", doseMg: 0.6, frequency: "DAILY" },
  { value: "SAXENDA_12_DAILY_7", label: "Saxenda: 1.2 mg once daily for 1 week", doseMg: 1.2, frequency: "DAILY" },
  { value: "SAXENDA_18_DAILY_7", label: "Saxenda: 1.8 mg once daily for 1 week", doseMg: 1.8, frequency: "DAILY" },
  { value: "SAXENDA_24_DAILY_7", label: "Saxenda: 2.4 mg once daily for 1 week", doseMg: 2.4, frequency: "DAILY" },
  { value: "SAXENDA_3_DAILY", label: "Saxenda: 3 mg once daily", doseMg: 3, frequency: "DAILY" },
  { value: "OTHER", label: "Other / custom schedule", doseMg: 0, frequency: "WEEKLY" },
] as const;

export function scheduleForValue(value?: string | null) {
  return glp1DoseScheduleOptions.find((option) => option.value === value);
}
