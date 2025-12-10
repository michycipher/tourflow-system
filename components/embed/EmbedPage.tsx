// components/embed/EmbedPage.tsx
"use client";

import { useState, useEffect } from "react";
import TourSelector from "@/components/embed/TourSelector";
import CodeBlock from "@/components/embed/CodeBlock";
import InstallationGuide from "@/components/embed/InstallationGuide";
import WidgetScript from "@/components/embed/WidgetScript";
import { Tour } from "@/types/embed";
import { ArrowRight, Play, StopCircle, ExternalLink } from "lucide-react";

// Define tours data
const tours: Tour[] = [
  { id: "tour-1", name: "Welcome Tour", steps: 5 },
  { id: "tour-2", name: "Feature Discovery", steps: 5 },
  { id: "tour-3", name: "Onboarding Flow", steps: 5 },
];

export default function EmbedPage() {
  const [selectedTour, setSelectedTour] = useState<Tour>(tours[0]);
  const [previewActive, setPreviewActive] = useState(false);


  // Script tag embed code (Primary method - no npm needed)
  const scriptEmbedCode = `<!-- TourFlow Widget via CDN -->
<link rel="stylesheet" href="https://unpkg.com/tourflow-widget@1.0.2/dist/style.css">

<!-- Load React dependencies -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load TourFlow Widget -->
<script src="https://unpkg.com/tourflow-widget@1.0.2/dist/tourflow-widget.iife.js"></script>
<script>
  TourFlow.init({
    tourId: '${selectedTour.id}',
    apiKey: 'tf_live_xxxxxxxxxxxx',
    theme: 'dark',
    position: 'bottom-right'
  });
</script>`;

  // Next.js Script Component method
  const nextjsScriptCode = `import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/tourflow-widget@1.0.1/dist/style.css"
      />
      
      {/* Load React dependencies */}
      <Script
        src="https://unpkg.com/react@18/umd/react.production.min.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      <Script
        src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
        strategy="beforeInteractive"
        crossOrigin="anonymous"
      />
      
      {/* Load TourFlow Widget */}
      <Script
        src="https://unpkg.com/tourflow-widget@1.0.2/dist/tourflow-widget.iife.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.TourFlow.init({
            tourId: '${selectedTour.id}',
            apiKey: 'tf_live_xxxxxxxxxxxx',
            theme: 'dark',
            position: 'bottom-right'
          });
        }}
      />
      
      {children}
    </>
  )
}`;

  // React component wrapper code
  const reactComponentCode = `// Create this component: components/TourFlowWidget.tsx
"use client";

import { useEffect } from "react";

export default function TourFlowWidget({ tourId, apiKey }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/tourflow-widget@1.0.2/dist/style.css";
    
    // Load React dependencies first
    const reactScript = document.createElement("script");
    reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
    reactScript.crossOrigin = "anonymous";
    
    const reactDomScript = document.createElement("script");
    reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
    reactDomScript.crossOrigin = "anonymous";
    
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://unpkg.com/tourflow-widget@1.0.2/dist/tourflow-widget.iife.js";
    
    widgetScript.onload = () => {
      if (window.TourFlow) {
        window.TourFlow.init({
          tourId,
          apiKey,
          theme: 'dark',
          position: 'bottom-right'
        });
      }
    };
    
    document.head.appendChild(link);
    document.head.appendChild(reactScript);
    
    reactScript.onload = () => {
      document.head.appendChild(reactDomScript);
      reactDomScript.onload = () => {
        document.body.appendChild(widgetScript);
      };
    };
    
    return () => {
      window.TourFlow?.destroy?.();
    };
  }, [tourId, apiKey]);
  
  return null;
}

// Usage:
import TourFlowWidget from '@/components/TourFlowWidget'

function App() {
  return (
    <>
      <TourFlowWidget tourId="${selectedTour.id}" apiKey="tf_live_xxx" />
      {/* Your content */}
    </>
  )
}`;

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setPreviewActive(false);
  };

  return (
    <div className="p-8 bg-[#110816] min-h-screen">
      {/* Conditionally render widget for preview */}
      {previewActive && (
        <WidgetScript
          tourId={selectedTour.id}
          apiKey="demo_key"
          theme="dark"
          position="bottom-right"
          autoStart={true}
        />
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Embed Code</h1>
          <p className="text-slate-400">Get the code to embed your tour on any website.</p>
          <div className="h-px bg-slate-800 mt-6"></div>
        </div>

        {/* NPM Package Notice */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-blue-400 font-medium mb-1">NPM Package Available</h3>
              <p className="text-slate-300 text-sm mb-2">
                Your widget is published on npm at <code className="bg-slate-800 px-2 py-0.5 rounded text-purple-400">tourflow-widget@1.0.1</code>
              </p>
              <p className="text-slate-400 text-sm">
                Using CDN is recommended for most use cases as it avoids dependency conflicts and works with any React version.
              </p>
            </div>
          </div>
        </div>

        {/* Select Tour Section */}
        <TourSelector
          tours={tours}
          selectedTour={selectedTour}
          onSelectTour={handleSelectTour}
        />

        {/* Live Preview Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Live Preview</h2>
            <button
              onClick={() => setPreviewActive(!previewActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                previewActive
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-purple-500 hover:bg-purple-600 text-white"
              }`}
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
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <p className="text-slate-300">
              {previewActive
                ? "✨ The widget is now active in the bottom-right corner. Try interacting with it!"
                : "Click 'Start Preview' to see the widget in action on this page."}
            </p>
          </div>
        </div>

        {/* Installation Methods */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Installation Methods</h2>
          
          {/* Method 1: CDN Script Tag (Recommended) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-white">Method 1: CDN Script Tag</h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Recommended</span>
            </div>
            <p className="text-slate-400 mb-3">Works with any HTML page or framework - no npm install needed</p>
            <CodeBlock code={scriptEmbedCode} language="html" />
          </div>

          {/* Method 2: Next.js Script Component */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Method 2: Next.js with Script Component</h3>
            <p className="text-slate-400 mb-3">Optimized loading with Next.js Script component</p>
            <CodeBlock code={nextjsScriptCode} language="typescript" />
          </div>

          {/* Method 3: React Component Wrapper */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-2">Method 3: Reusable React Component</h3>
            <p className="text-slate-400 mb-3">Create a wrapper component for easier reuse</p>
            <CodeBlock code={reactComponentCode} language="typescript" />
          </div>
        </div>

        {/* Installation Guide */}
        <InstallationGuide />

        {/* Configuration Options */}
        <div className="mt-10 bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration Options</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <code className="text-purple-400 font-mono text-sm mr-3 min-w-[100px]">tourId</code>
              <span className="text-slate-300 text-sm">The unique ID of the tour to display</span>
            </div>
            <div className="flex items-start">
              <code className="text-purple-400 font-mono text-sm mr-3 min-w-[100px]">apiKey</code>
              <span className="text-slate-300 text-sm">Your TourFlow API key (found in Settings)</span>
            </div>
            <div className="flex items-start">
              <code className="text-purple-400 font-mono text-sm mr-3 min-w-[100px]">theme</code>
              <span className="text-slate-300 text-sm">&rsquo;light&rsquo; or &rsquo;dark&rsquo; (default: &rsquo;dark&rsquo;)</span>
            </div>
            <div className="flex items-start">
              <code className="text-purple-400 font-mono text-sm mr-3 min-w-[100px]">position</code>
              <span className="text-slate-300 text-sm">&rsquo;bottom-right&rsquo;, &rsquo;bottom-left&rsquo;, &rsquo;top-right&rsquo;, or &rsquo;top-left&rsquo;</span>
            </div>
          </div>
        </div>

        {/* CDN Links Reference */}
        <div className="mt-10 bg-slate-900 rounded-lg p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-4">CDN Links</h2>
          <div className="space-y-3 font-mono text-sm">
            <div>
              <div className="text-slate-400 mb-1">JavaScript:</div>
              <code className="text-purple-400 break-all">https://unpkg.com/tourflow-widget@1.0.1/dist/tourflow-widget.iife.js</code>
            </div>
            <div>
              <div className="text-slate-400 mb-1">CSS:</div>
              <code className="text-purple-400 break-all">https://unpkg.com/tourflow-widget@1.0.1/dist/style.css</code>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
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