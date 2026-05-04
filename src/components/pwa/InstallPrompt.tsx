"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallPromptProps = {
  compact?: boolean;
  buttonLabel?: string;
};

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallPrompt({ compact = false, buttonLabel = "Add to Home Screen" }: InstallPromptProps) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsStandalone(isStandaloneDisplay());

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setMessage(null);
    }

    function handleInstalled() {
      setInstallEvent(null);
      setIsStandalone(true);
      setMessage("LeanDoze is installed.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) {
      setMessage("On iPhone, use Share, then Add to Home Screen.");
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    setInstallEvent(null);

    if (choice.outcome === "accepted") {
      setMessage("LeanDoze is being added to your home screen.");
    } else {
      setMessage("You can install LeanDoze anytime from your browser menu.");
    }
  }

  if (isStandalone) {
    return compact ? null : (
      <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
        LeanDoze is running as an installed app.
      </div>
    );
  }

  return (
    <div className={compact ? "flex flex-col gap-3 sm:flex-row sm:items-center" : "rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"}>
      {!compact ? (
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <Smartphone className="size-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-950">Install LeanDoze</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Add LeanDoze to your home screen.</p>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={install}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(11,18,32,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        <Download className="size-4" />
        {buttonLabel}
      </button>
      {message ? <p className={compact ? "text-sm font-medium text-slate-600" : "mt-3 text-sm font-medium text-slate-600"}>{message}</p> : null}
    </div>
  );
}
