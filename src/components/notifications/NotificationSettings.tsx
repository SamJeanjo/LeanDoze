"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, BellOff, Clock, Moon, Settings2, X } from "lucide-react";
import { notificationPermissionCopy } from "@/lib/notificationCopy";
import {
  defaultReminderSettings,
  readReminderSettings,
  reminderSettingsStorageKey,
  saveReminderSettings,
  scheduleLocalReminderPreview,
  shouldShowNotificationPermissionPrompt,
  type ReminderSettings,
} from "@/lib/notificationRules";
import { patientStateChangedEvent } from "@/lib/patientStorage";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

const toggles: Array<{ key: keyof Pick<ReminderSettings, "dose" | "protein" | "hydration" | "symptoms" | "reports">; label: string; description: string }> = [
  { key: "dose", label: "Dose reminders", description: "Gentle dose day and day-before prompts." },
  { key: "protein", label: "Protein reminders", description: "Small nudges when protein has not been logged." },
  { key: "hydration", label: "Hydration reminders", description: "Calm water check-ins during the day." },
  { key: "symptoms", label: "Symptom check-ins", description: "Quick prompts to log how you feel, including no symptoms." },
  { key: "reports", label: "Report reminders", description: "Visit prep and clinician report review prompts." },
];

function notificationPermission(): PermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";

  return Notification.permission;
}

function settingPatch(settings: ReminderSettings, patch: Partial<ReminderSettings>) {
  return { ...settings, ...patch };
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white p-4">
      <span>
        <span className="block text-sm font-semibold text-[#07111F]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-[#14B8A6]" />
    </label>
  );
}

export function NotificationPermissionPrompt() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("default");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function sync() {
      setPermission(notificationPermission());
      setShow(shouldShowNotificationPermissionPrompt(2));
    }

    sync();
    window.addEventListener(patientStateChangedEvent, sync);

    return () => window.removeEventListener(patientStateChangedEvent, sync);
  }, []);

  async function turnOn() {
    if (!("Notification" in window)) {
      setMessage("Your browser does not support notifications yet.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      const settings = settingPatch(readReminderSettings(), { enabled: true });
      saveReminderSettings(settings);
      setMessage(notificationPermissionCopy.enabled);
      window.setTimeout(() => setShow(false), 900);
      return;
    }

    window.localStorage.setItem("leandoze.notification.permission.dismissed", "true");
    setMessage(notificationPermissionCopy.denied);
  }

  function dismiss() {
    window.localStorage.setItem("leandoze.notification.permission.dismissed", "true");
    setShow(false);
  }

  if (!show || permission !== "default") return null;

  return (
    <aside className="fixed inset-x-4 bottom-40 z-[65] mx-auto max-w-md animate-[ld-install-slide_250ms_ease-out_both] rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:bottom-6 sm:left-auto sm:right-6 sm:mx-0" aria-label="Turn on LeanDoze reminders">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
          <Bell className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-[-0.015em] text-[#07111F]">{notificationPermissionCopy.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{notificationPermissionCopy.body}</p>
            </div>
            <button type="button" onClick={dismiss} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss reminder prompt">
              <X className="h-4 w-4" />
            </button>
          </div>
          {message ? <p className="mt-3 rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs font-semibold leading-5 text-slate-600">{message}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={turnOn} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#07111F] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
              Turn on reminders
            </button>
            <button type="button" onClick={dismiss} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<ReminderSettings>(defaultReminderSettings);
  const [permission, setPermission] = useState<PermissionState>("default");
  const [status, setStatus] = useState<string | null>(null);
  const preview = useMemo(() => scheduleLocalReminderPreview(settings), [settings]);

  useEffect(() => {
    setSettings(readReminderSettings());
    setPermission(notificationPermission());
  }, []);

  function update(patch: Partial<ReminderSettings>) {
    const next = settingPatch(settings, patch);
    setSettings(next);
    saveReminderSettings(next);
    setStatus("Reminder settings saved.");
    window.setTimeout(() => setStatus(null), 1600);
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setStatus("Your browser does not support notifications yet.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      update({ enabled: true });
      setStatus(notificationPermissionCopy.enabled);
    } else {
      window.localStorage.setItem("leandoze.notification.permission.dismissed", "true");
      update({ enabled: false });
      setStatus(notificationPermissionCopy.denied);
    }
  }

  function snooze24Hours() {
    const snoozedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    update({ snoozedUntil });
    setStatus("All reminders snoozed for 24 hours.");
  }

  function resetDismissalForTesting() {
    window.localStorage.removeItem("leandoze.notification.permission.dismissed");
    window.localStorage.removeItem(reminderSettingsStorageKey);
    setSettings(defaultReminderSettings);
    setStatus("Reminder preferences reset on this device.");
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
              {settings.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#0F766E]">Reminders</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#07111F]">Helpful reminders, only when you want them.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">LeanDoze can remind you about dose days, protein, hydration, symptom check-ins, and report prep. You control everything.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={permission === "granted" ? () => update({ enabled: !settings.enabled }) : enableNotifications}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#07111F] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {settings.enabled ? "Turn off reminders" : "Turn on reminders"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-slate-600 ring-1 ring-slate-200">Permission: {permission}</span>
          <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-slate-600 ring-1 ring-slate-200">Max 1-2/day, never more than 3</span>
          <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-slate-600 ring-1 ring-slate-200">No medical advice</span>
        </div>

        {status ? <p className="mt-4 rounded-2xl bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]">{status}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {toggles.map((item) => (
          <Toggle
            key={item.key}
            checked={settings[item.key]}
            label={item.label}
            description={item.description}
            onChange={(checked) => update({ [item.key]: checked })}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="rounded-2xl border border-slate-200/70 bg-white p-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#07111F]">
            <Clock className="h-4 w-4 text-[#0F766E]" />
            Preferred reminder time
          </span>
          <input type="time" value={settings.preferredTime} onChange={(event) => update({ preferredTime: event.target.value })} className="mt-3 min-h-11 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-3 text-sm font-semibold text-[#07111F]" />
        </label>
        <label className="rounded-2xl border border-slate-200/70 bg-white p-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#07111F]">
            <Moon className="h-4 w-4 text-[#0F766E]" />
            Quiet hours start
          </span>
          <input type="time" value={settings.quietStart} onChange={(event) => update({ quietStart: event.target.value })} className="mt-3 min-h-11 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-3 text-sm font-semibold text-[#07111F]" />
        </label>
        <label className="rounded-2xl border border-slate-200/70 bg-white p-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#07111F]">
            <Moon className="h-4 w-4 text-[#0F766E]" />
            Quiet hours end
          </span>
          <input type="time" value={settings.quietEnd} onChange={(event) => update({ quietEnd: event.target.value })} className="mt-3 min-h-11 w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-3 text-sm font-semibold text-[#07111F]" />
        </label>
      </div>

      <div className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="flex items-start gap-3">
          <Settings2 className="mt-1 h-5 w-5 text-[#0F766E]" />
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#07111F]">Reminder logic preview</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">These are local scheduling previews. Real push delivery will use a web push service later.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {preview.length ? (
            preview.map((item) => (
              <div key={item.id} className="rounded-2xl bg-[#F8FAFC] p-4 ring-1 ring-slate-200">
                <p className="text-sm font-semibold text-[#07111F]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0F766E]">{item.suggestedTime}</p>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-[#F8FAFC] p-4 text-sm leading-6 text-slate-600">No reminders are scheduled right now because reminders are off, snoozed, or quiet hours are active.</p>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={snooze24Hours} className="inline-flex min-h-11 items-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            Snooze all for 24 hours
          </button>
          <button type="button" onClick={resetDismissalForTesting} className="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-semibold text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50">
            Reset on this device
          </button>
        </div>
      </div>
    </section>
  );
}
