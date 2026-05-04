import type { LucideIcon } from "lucide-react";
import { BarChart3, CalendarDays, ClipboardList, Droplet, HeartPulse, LineChart, UsersRound, Utensils } from "lucide-react";
import { medicationTrademarkDisclaimer, medicalDisclaimer } from "@/lib/seo";

export type SeoPageContent = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  eyebrow: string;
  intro: string;
  icon: LucideIcon;
  sections: Array<{
    title: string;
    body: string[];
  }>;
  highlights: Array<{
    title: string;
    text: string;
  }>;
  cta: string;
  disclaimer?: string;
};

export const seoPages: Record<string, SeoPageContent> = {
  "glp-1-tracker": {
    slug: "/glp-1-tracker",
    title: "GLP-1 Tracker for Dose Days, Symptoms, Protein & Hydration",
    description:
      "LeanDoze is a GLP-1 tracker that helps patients organize dose days, symptoms, protein, hydration, weight progress, and clinician-ready reports.",
    keywords: ["GLP-1 tracker", "GLP-1 app", "GLP-1 medication tracker", "GLP-1 companion app"],
    h1: "A calmer GLP-1 tracker for the daily routine.",
    eyebrow: "GLP-1 tracker",
    icon: ClipboardList,
    intro:
      "LeanDoze is built for the part of GLP-1 care that happens between appointments: the daily pattern of dose timing, appetite changes, hydration, protein, symptoms, weight progress, and notes for the next visit.",
    sections: [
      {
        title: "Track the routine, not just the medication",
        body: [
          "Many tracking tools focus on one narrow action, such as logging a shot date or entering a weight. LeanDoze is designed around the broader GLP-1 routine. Patients can keep dose days, protein goals, hydration, symptom notes, movement, energy, and clinician questions in one place so each day feels easier to understand.",
          "The goal is not to make medical decisions for the patient. The goal is to reduce friction around remembering what happened, when it happened, and what may be useful to discuss with a healthcare provider. That makes LeanDoze a practical GLP-1 companion app rather than a generic checklist.",
        ],
      },
      {
        title: "Built for patient-entered data",
        body: [
          "LeanDoze keeps the patient in control. Logs are written in plain language and organized into patterns such as dose rhythm, side effect tracking, protein consistency, hydration consistency, and progress trends. The experience is designed to be quick enough for daily use and structured enough to support a clinician conversation.",
          "Patients can use LeanDoze to prepare for appointments by turning daily logs into a report that summarizes dose adherence, symptoms marked for clinician review, hydration and protein trends, weight changes, and questions they want to remember.",
        ],
      },
      {
        title: "A tracker with clinic context",
        body: [
          "For clinics, patient-entered tracking data can provide context between visits. LeanDoze is structured so future clinic dashboards can show adherence summaries, risk flags, symptom patterns, hydration and protein trends, and clinician-ready reports. It supports clinical review without replacing clinical judgment.",
          medicalDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Dose rhythm", text: "Track next dose date, dose cycle day, and missed or delayed dose notes." },
      { title: "Daily basics", text: "Log protein, hydration, symptoms, weight, energy, and movement." },
      { title: "Visit prep", text: "Organize trends and questions into clinician-ready summaries." },
    ],
    cta: "Start GLP-1 tracking",
  },
  "ozempic-tracker": {
    slug: "/ozempic-tracker",
    title: "Ozempic Tracker for Symptoms, Dose Days & Progress",
    description:
      "Track Ozempic dose days, symptoms, protein, hydration, weight progress, and clinician-ready reports with LeanDoze.",
    keywords: ["Ozempic tracker", "Ozempic app", "GLP-1 tracker", "semaglutide tracker"],
    h1: "An Ozempic tracker for daily consistency.",
    eyebrow: "Ozempic tracker",
    icon: CalendarDays,
    intro:
      "LeanDoze helps patients organize an Ozempic tracking routine around dose days, symptoms, hydration, protein, weight progress, and notes for clinician review.",
    sections: [
      {
        title: "Track dose days and the week around them",
        body: [
          "Patients using Ozempic often want an easier way to remember dose timing, daily habits, and patterns that show up across the week. LeanDoze gives the routine a simple structure: next dose date, dose cycle day, protein and hydration goals, symptoms, weight trend, and questions for the next visit.",
          "The app does not recommend a dose, tell patients to change medication, or interpret symptoms as a diagnosis. Instead, it helps preserve the details that are easy to forget. That can make conversations with a healthcare provider more organized and less dependent on memory alone.",
        ],
      },
      {
        title: "Support protein, hydration, and symptom awareness",
        body: [
          "LeanDoze is especially useful when appetite changes affect daily consistency. Patients can track protein and water in the same place as symptom notes, making it easier to see whether certain days were low, steady, or worth mentioning at a visit.",
          "Symptom logging can include nausea, constipation, reflux, fatigue, vomiting, abdominal discomfort, and notes the patient chooses to add. Severe, persistent, or concerning symptoms should be reviewed with a healthcare provider. LeanDoze keeps that safety boundary clear.",
        ],
      },
      {
        title: "Prepare a clinician-ready report",
        body: [
          "Before an appointment, LeanDoze can organize patient-entered logs into a report preview. The summary can include dose logs, symptom notes marked for clinician review, protein and hydration adherence, weight trend, and patient questions.",
          medicationTrademarkDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Semaglutide routine", text: "Organize Ozempic-related tracking without making medication decisions." },
      { title: "Side effect notes", text: "Log symptom timing and severity for future clinician review." },
      { title: "Progress context", text: "Keep weight trend, protein, hydration, and questions together." },
    ],
    cta: "Track your Ozempic routine",
    disclaimer: medicationTrademarkDisclaimer,
  },
  "wegovy-tracker": {
    slug: "/wegovy-tracker",
    title: "Wegovy Tracker for GLP-1 Dose Days, Protein & Weight Progress",
    description:
      "LeanDoze helps patients track Wegovy routines, including dose days, symptoms, protein, hydration, weight progress, and clinician reports.",
    keywords: ["Wegovy tracker", "Wegovy app", "GLP-1 weight loss tracker", "GLP-1 protein tracker"],
    h1: "A Wegovy tracker for the habits behind progress.",
    eyebrow: "Wegovy tracker",
    icon: LineChart,
    intro:
      "LeanDoze helps patients using Wegovy keep daily tracking simple: dose rhythm, protein, hydration, symptoms, weight progress, energy, and report notes in one calm place.",
    sections: [
      {
        title: "Make the daily routine easier to follow",
        body: [
          "Wegovy tracking is often about more than remembering a dose day. Patients may also want to understand appetite changes, protein consistency, hydration, symptoms, and progress over time. LeanDoze turns those moving pieces into a focused daily plan so the next useful action is easier to see.",
          "The product is intentionally not a calorie-counting punishment app. The emphasis is on consistency, not perfection. Patients can log the essentials quickly and use the report view to prepare for care team conversations.",
        ],
      },
      {
        title: "Track weight progress with context",
        body: [
          "A weight trend can be useful, but it rarely tells the whole story. LeanDoze pairs weight tracking with non-scale wins, hydration and protein adherence, symptom notes, and questions for a clinician. That gives patients a more complete record of what happened between visits.",
          "LeanDoze does not guarantee weight loss, define safe weight change for an individual, or replace clinical guidance. It creates a structured record patients can review with their healthcare provider.",
        ],
      },
      {
        title: "Help clinics review patient-entered patterns",
        body: [
          "For clinics, structured patient logs can make GLP-1 follow-up more efficient. Reports can surface dose adherence, symptom notes, protein and hydration consistency, and patient questions without asking the patient to reconstruct weeks of detail during the appointment.",
          medicationTrademarkDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Weight trend", text: "Track weight progress alongside daily habits and symptoms." },
      { title: "Protein focus", text: "Keep protein goals visible when appetite changes make routines harder." },
      { title: "Clinician report", text: "Preview visit summaries from patient-entered data." },
    ],
    cta: "Track your Wegovy routine",
    disclaimer: medicationTrademarkDisclaimer,
  },
  "mounjaro-tracker": {
    slug: "/mounjaro-tracker",
    title: "Mounjaro Tracker for Dose Rhythm, Symptoms & Daily Logs",
    description:
      "Use LeanDoze to track Mounjaro dose days, symptoms, protein, hydration, weight progress, and clinician-ready reports.",
    keywords: ["Mounjaro tracker", "Mounjaro app", "tirzepatide tracker", "GLP-1 medication tracker"],
    h1: "A Mounjaro tracker built for daily follow-through.",
    eyebrow: "Mounjaro tracker",
    icon: Droplet,
    intro:
      "LeanDoze helps patients organize Mounjaro-related tracking around the practical day-to-day routine: dose timing, symptoms, hydration, protein, weight progress, and clinician notes.",
    sections: [
      {
        title: "Keep dose timing and daily logs together",
        body: [
          "A useful Mounjaro tracker should help patients remember more than a date. LeanDoze connects dose rhythm with daily check-ins, hydration, protein, symptom notes, weight trend, and questions for clinical review. That makes the tracking record more useful than isolated entries scattered across separate apps.",
          "Patients can use LeanDoze as a calm daily operating layer. The Today Plan shows what matters now, while reports organize what happened across a week or month.",
        ],
      },
      {
        title: "Log symptoms without alarm",
        body: [
          "LeanDoze supports side effect tracking in plain language. Patients can log symptoms like nausea, constipation, diarrhea, reflux, fatigue, vomiting, or abdominal discomfort and choose whether they want to mention the note to a clinician.",
          "The app avoids diagnostic language. If symptoms are severe, persistent, or concerning, LeanDoze uses safe language that points patients back to medical guidance rather than making claims or recommendations.",
        ],
      },
      {
        title: "Build better follow-up conversations",
        body: [
          "For follow-up visits, LeanDoze can summarize patient-entered tracking data into a clinician-ready view: dose logs, protein and hydration averages, symptom patterns, weight trend, and discussion topics. Clinics get clearer context; patients do not have to rely on memory.",
          medicationTrademarkDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Dose rhythm", text: "Track dose days and the week around them." },
      { title: "Hydration record", text: "Keep water intake visible alongside symptoms and appetite." },
      { title: "Discussion topics", text: "Prepare questions and patterns for clinician review." },
    ],
    cta: "Track your Mounjaro routine",
    disclaimer: medicationTrademarkDisclaimer,
  },
  "zepbound-tracker": {
    slug: "/zepbound-tracker",
    title: "Zepbound Tracker for Protein, Hydration, Symptoms & Reports",
    description:
      "LeanDoze helps patients track Zepbound routines with dose days, symptoms, protein, hydration, weight progress, and clinician-ready summaries.",
    keywords: ["Zepbound tracker", "Zepbound app", "tirzepatide tracker", "GLP-1 companion app"],
    h1: "A Zepbound tracker for simple daily structure.",
    eyebrow: "Zepbound tracker",
    icon: Utensils,
    intro:
      "LeanDoze is designed to help patients using Zepbound keep the routine clear: what to log today, what patterns are forming, and what may be useful to review with a clinician.",
    sections: [
      {
        title: "Focus on what matters today",
        body: [
          "Zepbound tracking can quickly become scattered if dose dates, symptom notes, water intake, protein goals, and weight entries live in separate places. LeanDoze brings those details into a single GLP-1 companion app that emphasizes daily clarity and calm follow-through.",
          "The app shows a simple Today Plan based on common tracking priorities such as protein, hydration, symptom check-ins, and report notes. It is designed to feel supportive rather than punitive.",
        ],
      },
      {
        title: "Support clinician conversations",
        body: [
          "Patients can mark symptoms or notes they want to mention, then preview a report that organizes the information for the next visit. That report can include dose adherence, symptoms, hydration and protein consistency, weight trend, and questions.",
          "LeanDoze does not suggest dose changes, diagnose symptoms, or provide treatment advice. It helps make the patient-entered record easier to review with a healthcare provider.",
        ],
      },
      {
        title: "Built for patients and clinics",
        body: [
          "The patient app is simple and action-focused. The clinic view is designed for scanning patient-entered data, follow-up flags, and summaries between visits. Together, they support better organization without replacing the clinician-patient relationship.",
          medicationTrademarkDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Protein tracking", text: "Make protein goals part of the daily plan." },
      { title: "Symptom notes", text: "Keep symptom timing, severity, and notes organized." },
      { title: "Report preview", text: "Turn logs into visit-ready context." },
    ],
    cta: "Track your Zepbound routine",
    disclaimer: medicationTrademarkDisclaimer,
  },
  "glp-1-side-effect-tracker": {
    slug: "/glp-1-side-effect-tracker",
    title: "GLP-1 Side Effect Tracker for Symptoms and Clinician Reports",
    description:
      "Track GLP-1 side effects, symptom timing, severity, notes, hydration, protein, and clinician-ready report summaries with LeanDoze.",
    keywords: ["GLP-1 side effect tracker", "GLP-1 symptom tracker", "Ozempic side effect tracker", "Wegovy side effect tracker"],
    h1: "A GLP-1 side effect tracker that keeps symptoms organized.",
    eyebrow: "Side effect tracking",
    icon: HeartPulse,
    intro:
      "LeanDoze helps patients log GLP-1 symptoms with timing, severity, notes, and optional clinician flags so patterns are easier to review at the next appointment.",
    sections: [
      {
        title: "Track symptoms without panic",
        body: [
          "Symptom tracking should feel clear, not scary. LeanDoze lets patients record nausea, constipation, reflux, fatigue, vomiting, diarrhea, abdominal discomfort, dizziness, low appetite, and notes in a structured way. The language stays calm and avoids diagnosis.",
          "When symptoms are severe, persistent, or concerning, LeanDoze points patients back to appropriate medical guidance. It does not tell a patient what condition they have, whether to stop medication, or how to change a dose.",
        ],
      },
      {
        title: "Connect symptoms to the rest of the routine",
        body: [
          "Symptoms rarely happen in isolation. LeanDoze keeps symptom notes near hydration, protein, dose rhythm, weight trend, energy, appetite, and patient questions. This helps patients build a more complete record of what happened and when.",
          "For example, a patient may want to remember that nausea was moderate on two days, hydration was lower than usual, or a specific note should be discussed at the next visit. LeanDoze organizes those details without making medical claims.",
        ],
      },
      {
        title: "Create clinician-ready summaries",
        body: [
          "Before an appointment, LeanDoze can turn patient-entered symptom logs into a report preview with frequency, severity, notes marked for clinician review, and related protein or hydration context. This can make follow-up conversations more efficient and specific.",
          medicalDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Severity logging", text: "Record mild, moderate, or severe symptoms in seconds." },
      { title: "Timing context", text: "Connect symptoms to dose cycle days and daily logs." },
      { title: "Clinician notes", text: "Mark what you want to mention at your next visit." },
    ],
    cta: "Start symptom tracking",
  },
  "glp-1-clinic-dashboard": {
    slug: "/glp-1-clinic-dashboard",
    title: "GLP-1 Clinic Dashboard for Patient Monitoring & Reports",
    description:
      "LeanDoze supports GLP-1 patient monitoring with patient-entered logs, adherence summaries, symptom patterns, risk flags, and clinician-ready reports.",
    keywords: ["GLP-1 clinic dashboard", "GLP-1 patient monitoring", "GLP-1 clinic software", "GLP-1 reports"],
    h1: "A GLP-1 clinic dashboard for between-visit visibility.",
    eyebrow: "Clinic dashboard",
    icon: UsersRound,
    intro:
      "LeanDoze is designed to help clinics review patient-entered GLP-1 tracking data between visits, including adherence summaries, symptom patterns, hydration, protein, weight trends, risk flags, and reports.",
    sections: [
      {
        title: "See who may need attention",
        body: [
          "GLP-1 programs can involve many small data points: dose timing, missed doses, symptoms, hydration, protein, weight progress, and questions from patients. A clinic dashboard should help teams scan for patterns without drowning them in noise.",
          "LeanDoze organizes patient-entered data into follow-up queues, report previews, and concise summaries. The goal is to support clinical review and help appointments start with context.",
        ],
      },
      {
        title: "Patient-owned data, clinic-ready views",
        body: [
          "LeanDoze is built around patient control. Patients own their profile and choose when to invite a doctor or clinic and when to share reports. Clinics should not see patient data unless access exists.",
          "Once connected, the clinic experience can focus on fast scanning: patients needing follow-up, risk flags, symptom trends, hydration and protein adherence, weight trends, and downloadable reports.",
        ],
      },
      {
        title: "Support, not diagnosis",
        body: [
          "LeanDoze does not make clinical decisions, prescribe medication, or diagnose symptoms. Risk flags and summaries are designed to call attention to patient-entered patterns for clinician review.",
          medicalDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Follow-up queue", text: "Scan patients with medium, high, or urgent open flags." },
      { title: "Report summaries", text: "Review dose logs, symptoms, protein, hydration, and weight trend." },
      { title: "Patient access", text: "Clinic visibility depends on patient-approved access." },
    ],
    cta: "Explore clinic reporting",
  },
  "for-clinics": {
    slug: "/for-clinics",
    title: "LeanDoze for Clinics — GLP-1 Patient Monitoring",
    description:
      "LeanDoze helps clinics review patient-entered GLP-1 progress, symptoms, adherence, protein, hydration, weight trends, and clinician-ready reports.",
    keywords: ["GLP-1 patient monitoring", "GLP-1 clinic dashboard", "GLP-1 clinic reports", "GLP-1 care team software"],
    h1: "GLP-1 patient monitoring built for clinic review.",
    eyebrow: "For clinics",
    icon: BarChart3,
    intro:
      "LeanDoze gives clinics a structured way to review patient-entered GLP-1 tracking data between visits while keeping the patient experience simple enough for daily use.",
    sections: [
      {
        title: "Better data starts with the patient experience",
        body: [
          "Clinics only get useful between-visit visibility if patients actually log. LeanDoze begins with a patient-first daily app that feels simple and supportive: today’s plan, quick check-ins, symptom notes, protein, hydration, progress, and clinician reports.",
          "That patient-entered data can then flow into clinic views designed for scanning and follow-up. This keeps LeanDoze from feeling like another administrative portal patients ignore.",
        ],
      },
      {
        title: "Designed for fast clinical scanning",
        body: [
          "The clinic side can organize active patients, follow-up flags, symptom trends, hydration and protein adherence, weight trend, medication group reporting, and clinician-ready narratives. Reports are designed to be concise enough for real workflows.",
          "LeanDoze uses careful language around flags and summaries. It can surface patterns for review, but it does not diagnose conditions or recommend medication changes.",
        ],
      },
      {
        title: "Patient access and privacy",
        body: [
          "Patients should always understand what they share. LeanDoze is designed around explicit invitations, patient-owned profiles, and report sharing by choice. Clinic visibility should depend on access granted by the patient.",
          medicalDisclaimer,
        ],
      },
    ],
    highlights: [
      { title: "Panel visibility", text: "Review patient-entered progress between visits." },
      { title: "Risk flags", text: "Surface patterns that may need clinician review." },
      { title: "Reports", text: "Generate visit-ready summaries from daily logs." },
    ],
    cta: "Open clinic demo",
  },
};

export const seoPageList = Object.values(seoPages);
