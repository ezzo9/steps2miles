"use client";

import { useState } from "react";
import { CheckIcon, LinkIcon, ShareIcon } from "./icons";

export default function ShareResult({
  steps,
  miles,
  km,
}: {
  steps: number;
  miles: number;
  km: number;
}) {
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams({
    steps: String(Math.round(steps)),
    miles: miles.toFixed(2),
    km: km.toFixed(2),
  });
  const ogPath = `/api/og?${params.toString()}`;

  const handleCopyLink = async () => {
    const absoluteUrl = `${window.location.origin}${ogPath}`;
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied; nothing more we can do here.
    }
  };

  return (
    <div className="mt-3 flex items-center gap-4 border-t border-forest/10 pt-2 sm:mt-2 sm:pt-1.5">
      <a
        href={ogPath}
        download="steps-to-miles-result.png"
        className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-forest hover:text-rust sm:min-h-0"
      >
        <ShareIcon className="h-3.5 w-3.5" />
        Share your result
      </a>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex min-h-11 items-center gap-1.5 text-xs font-medium text-forest hover:text-rust sm:min-h-0"
      >
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            Copied!
          </>
        ) : (
          <>
            <LinkIcon className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
