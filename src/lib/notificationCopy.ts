export type NotificationCategory =
  | "dose"
  | "protein"
  | "hydration"
  | "symptoms"
  | "reports"
  | "streak";

export const notificationCopy: Record<NotificationCategory, string[]> = {
  dose: [
    "Dose day today. Open LeanDoze when you're ready.",
    "Your next dose is tomorrow. Take a quick look at your plan.",
    "Dose logged. We'll adjust today's check-ins around it.",
  ],
  protein: [
    "Protein first today. A small check-in helps.",
    "Low appetite days can make protein easy to miss.",
    "Quick protein check? It takes 10 seconds.",
  ],
  hydration: [
    "Hydration check-in. Small sips count.",
    "Add water when you get a second.",
    "Your day is easier to review when water is logged.",
  ],
  symptoms: [
    "How are you feeling today?",
    "Quick symptom check-in?",
    "No symptoms today? You can log that too.",
  ],
  reports: [
    "Your next visit report is getting organized.",
    "Add anything you want your clinician to see.",
    "Preview your report before your appointment.",
  ],
  streak: [
    "You're building consistency.",
    "Small check-ins are adding up.",
    "Nice work - your week is easier to review.",
  ],
};

export const notificationPermissionCopy = {
  title: "Helpful reminders, only when you want them.",
  body: "LeanDoze can remind you about dose days, quick check-ins, and report prep. You control everything.",
  enabled: "Reminders are on. You can change them anytime.",
  denied: "Reminders are off. You can enable them later in your browser settings.",
};

export function pickNotificationCopy(category: NotificationCategory, seed = 0) {
  const options = notificationCopy[category];
  return options[Math.abs(seed) % options.length];
}
