"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "html" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="relative rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-slate-950 border-b border-slate-800">
        <div className="text-xs sm:text-sm font-mono text-slate-400">
          {language}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-md bg-purple-500 hover:bg-purple-600 text-white transition-colors w-full sm:w-auto"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-2 sm:p-3 md:p-4 overflow-x-auto text-xs sm:text-sm text-slate-300 font-mono bg-slate-950/50 whitespace-pre-wrap break-words max-h-[300px] sm:max-h-[400px] overflow-y-auto">
        <code className="break-all">{code}</code>
      </pre>
    </div>
  );
}