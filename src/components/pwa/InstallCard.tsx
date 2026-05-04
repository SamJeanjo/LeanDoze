"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { getPatientState, patientStateChangedEvent } from "@/lib/patientStorage";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const dismissedKey = "leandoze.pwa.install.dismissed";
const sessionShownKey = "leandoze.pwa.install.shown.session";
const sessionCountKey = "leandoze.pwa.session.count";
const sessionCountedKey = "leandoze.pwa.session.counted";

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isiOS() {
  if (typeof window === "undefined") return false;

  const platform = window.navigator.platform || "";
  const userAgent = window.navigator.userAgent || "";
  const touchMac = platform === "MacIntel" && window.navigator.maxTouchPoints > 1;

  return /iPhone|iPad|iPod/.test(userAgent) || touchMac;
}

function completedActionCount() {
  const state = getPatientState();
  const fromDailyLogs = state.dailyLogs.flatMap((log) => log.completedActions);
  const fromStoredActions = Object.values(state.completedActions).flat();

  return new Set([...fromDailyLogs, ...fromStoredActions]).size;
}

function getSessionCount() {
  if (typeof window === "undefined") return 1;

  if (!window.sessionStorage.getItem(sessionCountedKey)) {
    const current = Number(window.localStorage.getItem(sessionCountKey) ?? "0");
    const next = current + 1;
    window.localStorage.setItem(sessionCountKey, String(next));
    window.sessionStorage.setItem(sessionCountedKey, "true");
    return next;
  }

  return Number(window.localStorage.getItem(sessionCountKey) ?? "1");
}

export function InstallCard() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [shownThisSession, setShownThisSession] = useState(true);
  const [isShowing, setIsShowing] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [actionsCompleted, setActionsCompleted] = useState(0);
  const [isAppleMobile, setIsAppleMobile] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const eligible = useMemo(() => actionsCompleted >= 2 || sessionCount >= 2, [actionsCompleted, sessionCount]);
  const visible = isShowing && !isStandalone && !isDismissed;

  useEffect(() => {
    setIsStandalone(isStandaloneDisplay());
    setIsAppleMobile(isiOS());
    setIsDismissed(window.localStorage.getItem(dismissedKey) === "true");
    setShownThisSession(window.sessionStorage.getItem(sessionShownKey) === "true");
    setSessionCount(getSessionCount());
    setActionsCompleted(completedActionCount());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstallEvent(null);
      setIsStandalone(true);
      dismissForSession();
    }

    function syncActions() {
      setActionsCompleted(completedActionCount());
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener(patientStateChangedEvent, syncActions);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener(patientStateChangedEvent, syncActions);
    };
  }, []);

  useEffect(() => {
    if (!eligible || isStandalone || isDismissed || shownThisSession) return;

    window.sessionStorage.setItem(sessionShownKey, "true");
    setShownThisSession(true);
    setIsShowing(true);
  }, [eligible, isDismissed, isStandalone, shownThisSession]);

  function dismissForSession() {
    window.sessionStorage.setItem(sessionShownKey, "true");
    setShownThisSession(true);
    setIsShowing(false);
  }

  function dismissLongTerm() {
    window.localStorage.setItem(dismissedKey, "true");
    window.sessionStorage.setItem(sessionShownKey, "true");
    setIsDismissed(true);
    setShownThisSession(true);
    setIsShowing(false);
  }

  async function install() {
    if (isAppleMobile) {
      setMessage("Tap Share, then Add to Home Screen.");
      return;
    }

    if (!installEvent) {
      setMessage("Open your browser menu, then choose Install app.");
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);

    if (choice.outcome === "accepted") {
      dismissForSession();
    } else {
      setMessage("You can add LeanDoze later from your browser menu.");
    }
  }

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-24 z-[70] mx-auto max-w-md animate-[ld-install-slide_250ms_ease-out_both] rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:bottom-6 sm:right-6 sm:left-auto sm:mx-0" aria-label="Install LeanDoze">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#ECFEFF] text-[#0F766E] ring-1 ring-[#99F6E4]">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-[-0.015em] text-[#07111F]">Use LeanDoze like an app</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Faster check-ins. Opens instantly. No browser.</p>
            </div>
            <button type="button" onClick={dismissLongTerm} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss install suggestion">
              <X className="h-4 w-4" />
            </button>
          </div>

          {isAppleMobile || message ? (
            <p className="mt-3 rounded-xl bg-[#F8FAFC] px-3 py-2 text-xs font-semibold leading-5 text-slate-600">
              {message ?? "Tap Share \u2192 Add to Home Screen"}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={install} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#07111F] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
              <Download className="h-4 w-4" />
              Add to Home Screen
            </button>
            <button type="button" onClick={dismissLongTerm} className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              Not now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
