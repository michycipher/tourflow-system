"use client";

import { useState } from "react";
import TourSelector from "@/components/embed/TourSelector";
import CodeBlock from "@/components/embed/CodeBlock";
import InstallationGuide from "@/components/embed/InstallationGuide";
import WidgetScript from "@/components/embed/WidgetScript";
import { Tour } from "@/types/embed";
import { ArrowRight, Play, StopCircle, ExternalLink } from "lucide-react";

const tours: Tour[] = [
  { id: "tour-1", name: "Welcome Tour", steps: 5 },
  { id: "tour-2", name: "Feature Discovery", steps: 5 },
  { id: "tour-3", name: "Onboarding Flow", steps: 5 },
];

export default function EmbedPage() {
  const [selectedTour, setSelectedTour] = useState<Tour>(tours[0]);
  const [previewActive, setPreviewActive] = useState(false);

  const scriptEmbedCode = `...`;
  const nextjsScriptCode = `...`;
  const reactComponentCode = `...`;

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setPreviewActive(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-[#110816] min-h-screen">
      {previewActive && (
        <WidgetScript
          tourId={selectedTour.id}
          apiKey="demo_key"
          theme="dark"
          position="bottom-right"
          autoStart={true}
        />
      )}

      <div className="max-w-4xl mx-auto px-2 sm:px-4">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Embed Code</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Get the code to embed your tour on any website.
          </p>
          <div className="h-px bg-slate-800 mt-4 sm:mt-6"></div>
        </div>

        {/* NPM Notice */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-blue-400 font-medium mb-1">NPM Package Available</h3>
              <p className="text-slate-300 text-sm mb-2 break-all">
                Your widget is published at
                <code className="bg-slate-800 px-2 py-0.5 rounded text-purple-400 ml-1">
                  tourflow-widget@1.0.1
                </code>
              </p>
              <p className="text-slate-400 text-sm">
                CDN is recommended for stability and compatibility.
              </p>
            </div>
          </div>
        </div>

        {/* Tour Selector */}
        <TourSelector
          tours={tours}
          selectedTour={selectedTour}
          onSelectTour={handleSelectTour}
        />

        {/* Live Preview */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Live Preview</h2>
            <button
              onClick={() => setPreviewActive(!previewActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                previewActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white`}
            >
              {previewActive ? (
                <>
                  <StopCircle className="w-4 h-4" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Preview
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 sm:p-6 border border-slate-800">
            <p className="text-slate-300 text-sm sm:text-base">
              {previewActive
                ? "✨ The widget is now active in the bottom-right corner."
                : "Click 'Start Preview' to see the widget in action."}
            </p>
          </div>
        </div>

        {/* Installation Methods */}
        <div className="mb-10">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Installation Methods</h2>

          {/* Method 1 */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-white">
                Method 1: CDN Script Tag
              </h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-3">Works anywhere, no npm needed.</p>
            <div className="overflow-x-auto">
              <CodeBlock code={scriptEmbedCode} language="html" />
            </div>
          </div>

          {/* Method 2 */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Method 2: Next.js Script Component</h3>
            <p className="text-slate-400 text-sm mb-3">Optimized for Next.js apps.</p>
            <div className="overflow-x-auto">
              <CodeBlock code={nextjsScriptCode} language="typescript" />
            </div>
          </div>

          {/* Method 3 */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Method 3: React Component Wrapper</h3>
            <p className="text-slate-400 text-sm mb-3">Reusable React wrapper.</p>
            <div className="overflow-x-auto">
              <CodeBlock code={reactComponentCode} language="typescript" />
            </div>
          </div>
        </div>

        <InstallationGuide />

        {/* Configuration */}
        <div className="mt-10 bg-slate-900 rounded-lg p-4 sm:p-6 border border-slate-800">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Configuration Options</h2>
          <div className="space-y-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-start">
              <code className="text-purple-400 font-mono sm:mr-3 min-w-[100px]">tourId</code>
              <span className="text-slate-300">Unique ID of the tour</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start">
              <code className="text-purple-400 font-mono sm:mr-3 min-w-[100px]">apiKey</code>
              <span className="text-slate-300">Your API key</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start">
              <code className="text-purple-400 font-mono sm:mr-3 min-w-[100px]">theme</code>
              <span className="text-slate-300">‘light’ or ‘dark’</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start">
              <code className="text-purple-400 font-mono sm:mr-3 min-w-[100px]">position</code>
              <span className="text-slate-300">Widget corner position</span>
            </div>
          </div>
        </div>

        {/* CDN Links */}
        <div className="mt-10 bg-slate-900 rounded-lg p-4 sm:p-6 border border-slate-800">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">CDN Links</h2>
          <div className="font-mono text-sm space-y-3 break-all">
            <div>
              <div className="text-slate-400">JavaScript:</div>
              <code className="text-purple-400">
                https://unpkg.com/tourflow-widget@1.0.1/dist/tourflow-widget.iife.js
              </code>
            </div>
            <div>
              <div className="text-slate-400">CSS:</div>
              <code className="text-purple-400">
                https://unpkg.com/tourflow-widget@1.0.1/dist/style.css
              </code>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800">
          <a
            href="/docs"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            View full documentation
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>

      </div>
    </div>
  );
}
