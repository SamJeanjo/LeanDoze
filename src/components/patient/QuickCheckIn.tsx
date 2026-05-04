"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Droplet, HeartPulse, Scale, Utensils } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { Modal } from "@/components/ui/Modal";
import {
  getTodaySummary,
  openQuickCheckInEvent,
  patientStateChangedEvent,
  saveHydrationLog,
  saveNoSymptomsToday,
  saveProteinLog,
  saveSymptomLog,
  saveWeightLog,
  type SymptomSeverity,
} from "@/lib/patientStorage";

type QuickCheckInType = "Weight" | "Protein" | "Water" | "Symptoms";

const actionConfig: Array<{ label: QuickCheckInType; icon: typeof Scale }> = [
  { label: "Weight", icon: Scale },
  { label: "Protein", icon: Utensils },
  { label: "Water", icon: Droplet },
  { label: "Symptoms", icon: HeartPulse },
];

const symptomOptions = [
  "Nausea",
  "Constipation",
  "Fatigue",
  "Diarrhea",
  "Vomiting",
  "Heartburn",
  "Low appetite",
  "Dizziness",
  "Dehydration",
  "Abdominal discomfort",
];

const severityOptions: SymptomSeverity[] = ["mild", "moderate", "severe"];

function numberOrEmpty(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? String(value) : "";
}

function QuickToast({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]">
      <CheckCircle2 className="h-4 w-4" />
      {message}
    </div>
  );
}

function NumericCheckIn({
  type,
  value,
  setValue,
  error,
}: {
  type: Exclude<QuickCheckInType, "Symptoms">;
  value: string;
  setValue: (value: string) => void;
  error: string | null;
}) {
  const isWeight = type === "Weight";
  const isProtein = type === "Protein";
  const unit = isWeight ? "lb" : isProtein ? "g" : "oz";
  const quickAdds = isProtein ? [10, 20, 30] : type === "Water" ? [8, 16, 24] : [];

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-semibold text-[#07111F]">{isWeight ? "Current weight" : isProtein ? "Protein grams today" : "Water ounces today"}</span>
        <div className="mt-2 flex min-h-14 items-center rounded-[22px] border border-slate-200/80 bg-[#F8FAFC] px-4 focus-within:border-[#14B8A6] focus-within:bg-white">
          <input
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="min-h-12 w-full bg-transparent text-lg font-semibold text-[#07111F] outline-none placeholder:text-slate-400"
            placeholder={isWeight ? "182.4" : isProtein ? "92" : "68"}
          />
          <span className="text-sm font-bold text-slate-500">{unit}</span>
        </div>
      </label>

      {quickAdds.length ? (
        <div className="grid grid-cols-3 gap-2">
          {quickAdds.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => {
                const current = Number(value) || 0;
                setValue(String(current + amount));
              }}
              className="min-h-11 rounded-2xl bg-[#ECFEFF] text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4] transition hover:bg-[#CCFBF1]"
            >
              +{amount} {unit}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm font-semibold text-[#BE123C]">{error}</p> : null}
    </div>
  );
}

function SymptomCheckIn({
  selectedSymptom,
  setSelectedSymptom,
  severity,
  setSeverity,
  note,
  setNote,
  mentionToClinician,
  setMentionToClinician,
  error,
  onNoSymptoms,
}: {
  selectedSymptom: string | null;
  setSelectedSymptom: (symptom: string | null) => void;
  severity: SymptomSeverity | null;
  setSeverity: (severity: SymptomSeverity | null) => void;
  note: string;
  setNote: (note: string) => void;
  mentionToClinician: boolean;
  setMentionToClinician: (value: boolean) => void;
  error: string | null;
  onNoSymptoms: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#07111F]">How are you feeling today?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">Small check-ins help build your report. You can skip anything you don&apos;t want to track.</p>
      </div>

      <button
        type="button"
        onClick={onNoSymptoms}
        className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#07111F] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        No symptoms today
      </button>

      <div className="grid grid-cols-2 gap-2">
        {symptomOptions.map((symptom) => {
          const active = selectedSymptom === symptom;

          return (
            <button
              key={symptom}
              type="button"
              onClick={() => setSelectedSymptom(active ? null : symptom)}
              className={
                active
                  ? "min-h-11 rounded-2xl bg-[#ECFEFF] px-3 text-sm font-semibold text-[#0F766E] ring-1 ring-[#99F6E4]"
                  : "min-h-11 rounded-2xl border border-slate-200/80 bg-[#F8FAFC] px-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
              }
            >
              {symptom}
            </button>
          );
        })}
      </div>

      {selectedSymptom ? (
        <div className="space-y-4 rounded-[24px] border border-slate-200/80 bg-[#F8FAFC] p-4">
          <div>
            <p className="text-sm font-semibold text-[#07111F]">How strong did it feel?</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {severityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSeverity(option)}
                  className={
                    severity === option
                      ? "min-h-11 rounded-2xl bg-[#ECFEFF] text-sm font-semibold capitalize text-[#0F766E] ring-1 ring-[#99F6E4]"
                      : "min-h-11 rounded-2xl bg-white text-sm font-semibold capitalize text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-[#07111F]">Note optional</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-6 text-[#07111F] outline-none focus:border-[#14B8A6]"
              placeholder="What changed today?"
            />
          </label>

          <label className="flex min-h-11 items-center gap-3 rounded-2xl bg-white px-3 text-sm font-semibold text-[#07111F] ring-1 ring-slate-200">
            <input
              type="checkbox"
              checked={mentionToClinician}
              onChange={(event) => setMentionToClinician(event.target.checked)}
              className="h-4 w-4 accent-[#14B8A6]"
            />
            Mention this to my clinician
          </label>
        </div>
      ) : null}

      {severity === "severe" ? (
        <p className="rounded-2xl bg-[#FFF7ED] p-3 text-xs leading-5 text-[#9A3412] ring-1 ring-[#FED7AA]">
          If symptoms are severe, persistent, or concerning, contact your healthcare provider. LeanDoze does not provide medical advice.
        </p>
      ) : null}

      {error ? <p className="text-sm font-semibold text-[#BE123C]">{error}</p> : null}
    </div>
  );
}

export function QuickCheckInContent({
  type,
  onClose,
  onSaved,
}: {
  type: QuickCheckInType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const today = getTodaySummary();
  const [value, setValue] = useState(() => {
    if (type === "Weight") return numberOrEmpty(today.weight);
    if (type === "Protein") return numberOrEmpty(today.proteinGrams);
    if (type === "Water") return numberOrEmpty(today.hydrationOz);
    return "";
  });
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [severity, setSeverity] = useState<SymptomSeverity | null>(null);
  const [note, setNote] = useState("");
  const [mentionToClinician, setMentionToClinician] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function finishSave(message: string) {
    setError(null);
    setSavedMessage(message);
    onSaved();
    window.setTimeout(onClose, 650);
  }

  function saveNumericLog() {
    const numericValue = Number(value);

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setSavedMessage(null);
      setError(type === "Weight" ? "Enter a weight to save." : type === "Protein" ? "Enter protein grams to save." : "Enter water ounces to save.");
      return;
    }

    if (type === "Weight") saveWeightLog(Number(numericValue.toFixed(1)));
    if (type === "Protein") saveProteinLog(Math.round(numericValue));
    if (type === "Water") saveHydrationLog(Math.round(numericValue));

    finishSave("Saved");
  }

  function saveNoSymptoms() {
    saveNoSymptomsToday(3);
    finishSave("Check-in saved");
  }

  function saveSymptoms() {
    if (!selectedSymptom) {
      setSavedMessage(null);
      setError("Choose a symptom or select 'No symptoms today.'");
      return;
    }

    if (!severity) {
      setSavedMessage(null);
      setError("Choose how strong it felt.");
      return;
    }

    saveSymptomLog({
      symptom: selectedSymptom,
      severity,
      note: note.trim() || undefined,
      mentionToClinician,
      doseCycleDay: 3,
    });
    finishSave("Saved");
  }

  const save = type === "Symptoms" ? saveSymptoms : saveNumericLog;

  return (
    <div className="mt-5 space-y-5">
      {type === "Symptoms" ? (
        <SymptomCheckIn
          selectedSymptom={selectedSymptom}
          setSelectedSymptom={setSelectedSymptom}
          severity={severity}
          setSeverity={setSeverity}
          note={note}
          setNote={setNote}
          mentionToClinician={mentionToClinician}
          setMentionToClinician={setMentionToClinician}
          error={error}
          onNoSymptoms={saveNoSymptoms}
        />
      ) : (
        <NumericCheckIn type={type} value={value} setValue={setValue} error={error} />
      )}

      {type !== "Symptoms" ? (
        <div className="sticky bottom-0 -mx-1 bg-white pb-1 pt-2">
          <button onClick={save} className="min-h-12 w-full rounded-full bg-[#07111F] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
            Save
          </button>
        </div>
      ) : selectedSymptom ? (
        <div className="sticky bottom-0 -mx-1 bg-white pb-1 pt-2">
          <button onClick={save} className="min-h-12 w-full rounded-full bg-[#07111F] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
            Save symptom
          </button>
        </div>
      ) : null}

      <QuickToast message={savedMessage} />
    </div>
  );
}

export function QuickCheckIn() {
  const [active, setActive] = useState<QuickCheckInType | null>(null);
  const [summary, setSummary] = useState(() => getTodaySummary());

  const actions = useMemo(
    () =>
      actionConfig.map((action) => {
        const value =
          action.label === "Weight"
            ? summary.weight
              ? `${summary.weight} lb`
              : "Add today"
            : action.label === "Protein"
              ? `${summary.proteinGrams}g today`
              : action.label === "Water"
                ? `${summary.hydrationOz}oz today`
                : summary.symptomCheckDone
                  ? summary.symptomCount
                    ? `${summary.symptomCount} logged`
                    : "Checked today"
                  : "10-sec check";

        return { ...action, value };
      }),
    [summary],
  );

  useEffect(() => {
    const sync = () => setSummary(getTodaySummary());

    function openFromAction(event: Event) {
      const detail = (event as CustomEvent<{ type?: string }>).detail;
      const type = detail?.type;
      if (type === "Weight" || type === "Protein" || type === "Water" || type === "Symptoms") setActive(type);
    }

    sync();
    window.addEventListener(patientStateChangedEvent, sync);
    window.addEventListener(openQuickCheckInEvent, openFromAction);

    return () => {
      window.removeEventListener(patientStateChangedEvent, sync);
      window.removeEventListener(openQuickCheckInEvent, openFromAction);
    };
  }, []);

  return (
    <>
      <section id="quick-check-in" className="relative z-0 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#0F766E]">Quick check-in</p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#07111F]">Stay consistent, not perfect.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Small check-ins help build your report.</p>
          </div>
          <span className="w-fit rounded-full bg-[#ECFEFF] px-3 py-1.5 text-xs font-bold text-[#0F766E] ring-1 ring-[#99F6E4]/70">4 taps max</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setActive(action.label)}
                className="flex min-h-28 flex-col items-start justify-between rounded-[24px] bg-[#F8FAFC] p-4 text-left ring-1 ring-[#E2E8F0]/80 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_28px_80px_rgba(15,23,42,0.09)] active:scale-[0.99]"
              >
                <Icon className="h-5 w-5 text-[#0F766E]" />
                <span>
                  <span className="block text-sm font-semibold text-[#07111F]">{action.label}</span>
                  <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{action.value}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <FloatingActionButton label="Log" icon={HeartPulse} onClick={() => setActive("Symptoms")} />
      <BottomSheet open={Boolean(active)} title={active ?? ""} onClose={() => setActive(null)}>
        {active ? <QuickCheckInContent type={active} onClose={() => setActive(null)} onSaved={() => setSummary(getTodaySummary())} /> : null}
      </BottomSheet>
      <Modal open={Boolean(active)} title={active ?? ""} onClose={() => setActive(null)}>
        {active ? <QuickCheckInContent type={active} onClose={() => setActive(null)} onSaved={() => setSummary(getTodaySummary())} /> : null}
      </Modal>
    </>
  );
}
