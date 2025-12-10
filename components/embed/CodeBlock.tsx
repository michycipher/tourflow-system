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
      <div className="flex justify-between items-center px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="text-sm font-mono text-slate-400">{language}</div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-purple-500 hover:bg-purple-600 text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-300 font-mono bg-slate-950/50">
        <code>{code}</code>
      </pre>
    </div>
  );
}