"use client";

import { useState } from "react";
import { CheckIcon, CodeIcon } from "./icons";

export default function CopyEmbedCode({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied; nothing more we can do here.
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <pre className="overflow-x-auto rounded-xl border border-forest/20 bg-gray-50 p-4 text-xs text-ink/80">
        <code className="font-mono">{snippet}</code>
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="flex w-fit items-center gap-1.5 rounded-lg bg-forest px-4 py-2 text-xs font-medium uppercase tracking-wide text-white hover:bg-forest/90"
      >
        {copied ? (
          <>
            <CheckIcon className="h-3.5 w-3.5" />
            Copied!
          </>
        ) : (
          <>
            <CodeIcon className="h-3.5 w-3.5" />
            Copy embed code
          </>
        )}
      </button>
    </div>
  );
}
