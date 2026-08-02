"use client";

import { useEffect } from "react";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

// Registers the offline-fallback service worker. A no-op, invisible
// component, this only runs the browser API call, it renders nothing.
//
// Skipped on localhost: Next.js dev mode doesn't content-hash its JS
// filenames the way a production build does, so a cache-first service
// worker there ends up serving stale old JS under the same URL after every
// code change, causing confusing hydration mismatches for no real benefit
// (offline support isn't something local dev testing needs). Also actively
// unregisters any worker a previous visit already installed, so switching
// back to localhost after testing this feature doesn't leave it stuck.
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (LOCAL_HOSTS.has(window.location.hostname)) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing (unsupported browser, blocked, etc.) just
      // means no offline fallback, the site still works normally online.
    });
  }, []);

  return null;
}
