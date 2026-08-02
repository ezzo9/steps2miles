"use client";

import { useEffect, useState } from "react";
import { FootprintsIcon, XIcon } from "./icons";

const DISMISS_KEY = "install-prompt-dismissed";

// Chrome/Edge fire this before showing their own install UI, on both mobile
// and desktop. Calling preventDefault() lets us show our own button instead
// and trigger the real native prompt later, on an actual click.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isMobileDevice(): boolean {
  return /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

// iOS Safari has no beforeinstallprompt event and no API to trigger the add
// dialog, "standalone" is the only signal it exposes for an already-launched
// home-screen app. Android and desktop Chrome/Edge report through the
// display-mode media query instead once installed.
function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"prompt" | "ios" | null>(null);
  const [mobile, setMobile] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    if (isStandalone()) return;

    const onMobile = isMobileDevice();
    setMobile(onMobile);

    // iOS has no install event at all, so this is the only path that can
    // ever apply there, every other browser (mobile Chrome, desktop
    // Chrome/Edge) goes through beforeinstallprompt below. Firefox and
    // desktop Safari support neither, so the event simply never fires there
    // and this component silently never appears, no fallback needed.
    if (onMobile && isIos()) {
      setMode("ios");
      setVisible(true);
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode("prompt");
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div
      className={
        mobile
          ? "fixed inset-x-0 bottom-0 z-50 border-t border-forest/10 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(33,29,24,0.08)]"
          : "fixed bottom-5 right-5 z-50 w-full max-w-xs rounded-2xl border border-forest/10 bg-white p-4 shadow-[0_8px_30px_rgba(33,29,24,0.14)]"
      }
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
          <FootprintsIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs uppercase tracking-wide text-forest">
            {mobile ? "Add to Home Screen" : "Install the App"}
          </p>
          <p className="text-xs text-ink/60">
            {mode === "ios"
              ? 'Tap Share, then "Add to Home Screen"'
              : mobile
              ? "One tap, straight to the calculator"
              : "One click from your desktop or taskbar"}
          </p>
        </div>
        {mode === "prompt" && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="shrink-0 rounded-lg bg-rust px-3 py-2 font-display text-xs uppercase tracking-wide text-white hover:bg-rust/90"
          >
            {mobile ? "Add" : "Install"}
          </button>
        )}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-ink/40 hover:text-ink/70"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
