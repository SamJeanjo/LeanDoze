import { getCompletedActionsForToday, getPatientState } from "@/lib/patientStorage";
import { pickNotificationCopy, type NotificationCategory } from "@/lib/notificationCopy";

export type ReminderSettings = {
  enabled: boolean;
  dose: boolean;
  protein: boolean;
  hydration: boolean;
  symptoms: boolean;
  reports: boolean;
  preferredTime: string;
  quietStart: string;
  quietEnd: string;
  snoozedUntil?: string;
};

export type ReminderCandidate = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  suggestedTime: string;
  priority: "low" | "normal";
};

export const defaultReminderSettings: ReminderSettings = {
  enabled: false,
  dose: true,
  protein: true,
  hydration: true,
  symptoms: true,
  reports: true,
  preferredTime: "09:00",
  quietStart: "20:30",
  quietEnd: "08:00",
};

export const reminderSettingsStorageKey = "leandoze.notification.settings.v1";

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function minutesFromTime(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function readReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return defaultReminderSettings;

  try {
    const raw = window.localStorage.getItem(reminderSettingsStorageKey);
    if (!raw) return defaultReminderSettings;

    return { ...defaultReminderSettings, ...JSON.parse(raw) };
  } catch {
    return defaultReminderSettings;
  }
}

export function saveReminderSettings(settings: ReminderSettings) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(reminderSettingsStorageKey, JSON.stringify(settings));
}

export function isWithinQuietHours(now = new Date(), settings = defaultReminderSettings) {
  const current = now.getHours() * 60 + now.getMinutes();
  const quietStart = minutesFromTime(settings.quietStart);
  const quietEnd = minutesFromTime(settings.quietEnd);

  if (quietStart > quietEnd) {
    return current >= quietStart || current < quietEnd;
  }

  return current >= quietStart && current < quietEnd;
}

export function isSnoozed(settings: ReminderSettings, now = new Date()) {
  return Boolean(settings.snoozedUntil && new Date(settings.snoozedUntil) > now);
}

export function shouldShowNotificationPermissionPrompt(minCompletedActions = 2) {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "default") return false;
  if (window.localStorage.getItem("leandoze.notification.permission.dismissed") === "true") return false;

  const completedActions = getCompletedActionsForToday();
  return completedActions.length >= minCompletedActions;
}

export function buildReminderCandidates(settings: ReminderSettings, doseCycleDay = 3, now = new Date()): ReminderCandidate[] {
  if (!settings.enabled || isSnoozed(settings, now) || isWithinQuietHours(now, settings)) return [];

  const state = getPatientState();
  const today = state.dailyLogs.find((log) => log.date === dayKey(now));
  const completed = getCompletedActionsForToday(state, dayKey(now));
  const seed = now.getDate() + doseCycleDay;
  const candidates: ReminderCandidate[] = [];

  if (settings.dose && doseCycleDay === 1) {
    candidates.push({
      id: "dose-day-morning",
      category: "dose",
      title: "Dose day today",
      body: pickNotificationCopy("dose", seed),
      suggestedTime: settings.preferredTime,
      priority: "normal",
    });
  }

  if (settings.protein && !completed.includes("protein-first")) {
    candidates.push({
      id: "protein-check",
      category: "protein",
      title: "Protein check-in",
      body: pickNotificationCopy("protein", seed),
      suggestedTime: settings.preferredTime,
      priority: "normal",
    });
  }

  if (settings.hydration && !completed.includes("hydrate-early")) {
    candidates.push({
      id: "hydration-check",
      category: "hydration",
      title: "Hydration check-in",
      body: pickNotificationCopy("hydration", seed),
      suggestedTime: settings.preferredTime,
      priority: "normal",
    });
  }

  if (settings.symptoms && !completed.includes("log-symptoms")) {
    candidates.push({
      id: "symptom-check",
      category: "symptoms",
      title: "How are you feeling today?",
      body: pickNotificationCopy("symptoms", seed),
      suggestedTime: "18:00",
      priority: "low",
    });
  }

  if (settings.reports && today && state.dailyLogs.length >= 3) {
    candidates.push({
      id: "report-prep",
      category: "reports",
      title: "Report prep",
      body: pickNotificationCopy("reports", seed),
      suggestedTime: "17:30",
      priority: "low",
    });
  }

  if (completed.length >= 2) {
    candidates.push({
      id: "habit-reinforcement",
      category: "streak",
      title: "Small check-ins are adding up",
      body: pickNotificationCopy("streak", seed),
      suggestedTime: "19:00",
      priority: "low",
    });
  }

  return candidates.slice(0, 3);
}

export function scheduleLocalReminderPreview(settings: ReminderSettings) {
  // TODO: Replace this local preview with web push subscriptions plus a server scheduler.
  // Future options: Vercel Cron, Firebase Cloud Messaging, OneSignal, Supabase Edge Functions, or Resend fallback.
  return buildReminderCandidates(settings).slice(0, 2);
}
