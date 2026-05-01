import {
  Activity,
  BadgeCheck,
  BellRing,
  CalendarCheck,
  Droplet,
  FileText,
  HeartPulse,
  ShieldPlus,
  Utensils,
} from "lucide-react";

export const todayPlan = [
  { label: "Morning hydration", value: "24 oz before noon", status: "Done" },
  { label: "Protein anchor", value: "35g breakfast target", status: "Due" },
  { label: "Movement", value: "20 min strength walk", status: "Planned" },
  { label: "Symptom check", value: "Nausea, reflux, energy", status: "Log" },
];

export const featureCards = [
  {
    icon: CalendarCheck,
    title: "Today Plan",
    text: "A calm daily checklist for dose timing, food tolerance, hydration, and recovery windows.",
  },
  {
    icon: ShieldPlus,
    title: "Muscle Protection Mode",
    text: "Protein, strength, and trend signals designed to help patients protect lean mass during weight loss.",
  },
  {
    icon: HeartPulse,
    title: "Side Effect Awareness",
    text: "Fast logging and escalation cues help clinics see patterns before the next appointment.",
  },
  {
    icon: Activity,
    title: "Clinic Dashboard",
    text: "A between-visit view of adherence, symptoms, missed doses, and progress by patient cohort.",
  },
];

export const patientMetrics = [
  { label: "Protein", value: "92g", helper: "of 120g goal", progress: 77, icon: Utensils },
  { label: "Hydration", value: "68oz", helper: "of 90oz goal", progress: 76, icon: Droplet },
  { label: "Muscle score", value: "84", helper: "stable this week", progress: 84, icon: ShieldPlus },
  { label: "Report", value: "Ready", helper: "next visit May 14", progress: 100, icon: FileText },
];

export const symptomQuickLog = ["Nausea", "Constipation", "Fatigue", "Reflux", "No symptoms"];

export const patients = [
  {
    id: "ava-m",
    name: "Ava Martinez",
    medication: "Semaglutide 1.0mg",
    weightChange: "-12.4 lb",
    adherence: 94,
    symptoms: "Mild nausea",
    status: "Stable",
    alert: "none",
    lastDose: "Apr 29",
  },
  {
    id: "noah-c",
    name: "Noah Chen",
    medication: "Tirzepatide 5mg",
    weightChange: "-8.1 lb",
    adherence: 76,
    symptoms: "Constipation, fatigue",
    status: "Needs review",
    alert: "symptom",
    lastDose: "Apr 26",
  },
  {
    id: "mina-r",
    name: "Mina Robinson",
    medication: "Semaglutide 0.5mg",
    weightChange: "-5.9 lb",
    adherence: 88,
    symptoms: "None logged",
    status: "On track",
    alert: "none",
    lastDose: "Apr 28",
  },
  {
    id: "eli-w",
    name: "Eli Walker",
    medication: "Tirzepatide 7.5mg",
    weightChange: "-15.2 lb",
    adherence: 62,
    symptoms: "Missed dose",
    status: "Missed dose",
    alert: "dose",
    lastDose: "Apr 21",
  },
];

export const pricingPlans = [
  {
    name: "Patient Free",
    price: "$0",
    period: "forever",
    description: "A gentle GLP-1 tracker for the essentials.",
    features: ["Dose day reminders", "Protein and hydration goals", "Side effect quick log"],
  },
  {
    name: "Patient Pro",
    price: "$9",
    period: "per month",
    description: "More insight for patients who want deeper progress signals.",
    features: ["Muscle Protection Score", "Doctor report exports", "Advanced trend history"],
    featured: true,
  },
  {
    name: "Clinic Starter",
    price: "$99",
    period: "per month",
    description: "Between-visit monitoring for small GLP-1 programs.",
    features: ["Up to 50 patients", "Alerts dashboard", "PDF visit summaries"],
  },
  {
    name: "Clinic Growth",
    price: "$249",
    period: "per month",
    description: "A scalable operating layer for growing clinics.",
    features: ["Up to 250 patients", "Cohort analytics", "Priority onboarding"],
  },
];

export const timeline = [
  { date: "Apr 30", event: "Logged mild nausea after dinner", tone: "coral" },
  { date: "Apr 29", event: "Dose completed on schedule", tone: "green" },
  { date: "Apr 28", event: "Protein goal hit: 124g", tone: "mint" },
  { date: "Apr 26", event: "Hydration below target", tone: "amber" },
];

export const clinicStats = [
  { label: "Active patients", value: "128", helper: "+14 this month", icon: BadgeCheck },
  { label: "Side effect alerts", value: "9", helper: "3 high priority", icon: BellRing },
  { label: "Missed doses", value: "12", helper: "last 7 days", icon: CalendarCheck },
  { label: "Avg adherence", value: "86%", helper: "clinic-wide", icon: Activity },
];
