"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import TourSelector from "@/components/embed/TourSelector";
import CodeBlock from "@/components/embed/CodeBlock";
import InstallationGuide from "@/components/embed/InstallationGuide";
import WidgetScript from "@/components/embed/WidgetScript";
import { Tour } from "@/types/embed";
import { ArrowRight, Play, StopCircle, ExternalLink } from "lucide-react";
import { getCurrentUser, getUserTours } from "@/lib/supabase"; 
export default function EmbedPage() {
  const router = useRouter(); 
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadTours = async () => {
    setLoading(true);
    
    try {
      const { user: currentUser, error: authError } = await getCurrentUser();
      
      if (authError || !currentUser) {
        router.push('/login');
        return;
      }

      const { data, error } = await getUserTours(currentUser.id);

      if (data) {
        const mappedTours: Tour[] = data.map((dbTour) => ({
          id: dbTour.id,
          title: dbTour.title || "Unnamed Tour",
          steps: dbTour.total_steps || 0
        }));
        
        setTours(mappedTours);
        if (mappedTours.length > 0) {
          setSelectedTour(mappedTours[0]);
        }
      }
      
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };
  
  loadTours();
}, [router]);

  const scriptEmbedCode = `<!-- TourFlow Widget v1.0.6 -->
<link rel="stylesheet" href="https://unpkg.com/tourflow-widget@1.0.6/dist/style.css" />

<!-- Load React dependencies -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Load TourFlow Widget -->
<script src="https://unpkg.com/tourflow-widget@1.0.6/dist/tourflow-widget.iife.js"></script>
<script>
  TourFlow.mountWidget({
    tour_id: "${selectedTour?.id || ''}",
    apiKey: "demo_key",
    theme: "dark",
    position: "bottom-right",
  });
</script>`;

  const nextjsScriptCode = `import Script from "next/script";

export default function Layout({ children }) {
  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/tourflow-widget@1.0.6/dist/style.css"
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
        src="https://unpkg.com/tourflow-widget@1.0.6/dist/tourflow-widget.iife.js"
        strategy="afterInteractive"
        onLoad={() => {
          window.TourFlow.mountWidget({
            tour_id: "${selectedTour?.id || ''}",
            apiKey: "demo_key",
            theme: "dark",
            position: "bottom-right"
          });
        }}
      />
      
      {children}
    </>
  )
}`;

  const reactComponentCode = `import { useEffect } from "react";

export default function TourflowWidget() {
  useEffect(() => {
    // Load React dependencies
    const reactScript = document.createElement("script");
    reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
    reactScript.crossOrigin = "anonymous";
    
    const reactDomScript = document.createElement("script");
    reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
    reactDomScript.crossOrigin = "anonymous";
    
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://unpkg.com/tourflow-widget@1.0.6/dist/tourflow-widget.iife.js";
    
    widgetScript.onload = () => {
      if (window.TourFlow) {
        window.TourFlow.mountWidget({
          tour_id: "${selectedTour?.id || ''}",
          apiKey: "demo_key",
          theme: "dark",
          position: "bottom-right",
        });
      }
    };
    
    document.head.appendChild(reactScript);
    reactScript.onload = () => {
      document.head.appendChild(reactDomScript);
      reactDomScript.onload = () => {
        document.body.appendChild(widgetScript);
      };
    };
  }, []);

  return null;
}`;

  const handleSelectTour = (tour: Tour) => {
    setSelectedTour(tour);
    setPreviewActive(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#110816] py-6 px-4 flex items-center justify-center">
        <p className="text-white">Loading tours...</p>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="min-h-screen bg-[#110816] py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Embed Code</h1>
          <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
            <p className="text-slate-300">No tours available. Create a tour first in the Tour Management section.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110816] py-3 sm:py-4 md:py-6 px-2 sm:px-3 md:px-4 lg:px-6 overflow-x-hidden">
      {previewActive && selectedTour && (
        <WidgetScript
          tourId={selectedTour.id}
          apiKey="demo_key"
          theme="dark"
          position="bottom-right"
          autoStart={true}
        />
      )}

      <div className="max-w-full md:max-w-3xl lg:max-w-4xl w-full mx-auto px-1 sm:px-2 md:px-4">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Embed Code
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm md:text-base">
            Get the code to embed your tour on any website.
          </p>
          <div className="h-px bg-slate-800 mt-3 sm:mt-4 md:mt-6"></div>
        </div>

        <div className="mb-4 sm:mb-5 md:mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 w-full">
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-blue-400 font-medium text-sm sm:text-base mb-1">
                NPM Package Available
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-2 break-words">
                Your widget is published at{" "}
                <code className="bg-slate-800 px-1.5 py-0.5 sm:px-2 rounded text-purple-400 break-all text-xs sm:text-sm">
                  tourflow-widget@1.0.6
                </code>
              </p>
              <p className="text-slate-400 text-xs sm:text-sm">
                CDN is recommended for most use cases.
              </p>
            </div>
          </div>
        </div>

        {selectedTour && (
          <TourSelector
            tours={tours}
            selectedTour={selectedTour}
            onSelectTour={handleSelectTour}
          />
        )}

        <div className="mb-6 sm:mb-8 md:mb-10 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
              Live Preview
            </h2>
            <button
              onClick={() => setPreviewActive(!previewActive)}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors text-white font-medium text-sm sm:text-base ${
                previewActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              {previewActive ? (
                <>
                  <StopCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Stop Preview</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Start Preview</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-3 sm:p-4 md:p-6 border border-slate-800 w-full">
            <p className="text-slate-300 text-xs sm:text-sm md:text-base">
              {previewActive
                ? "The widget is now active in the bottom-right corner. Try interacting with it!"
                : "Click 'Start Preview' to see the widget in action on this page."}
            </p>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 md:mb-10 w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
            Installation Methods
          </h2>

          <div className="mb-5 sm:mb-6 md:mb-8 w-full">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <h3 className="text-base sm:text-lg md:text-xl font-medium text-white">
                Method 1: CDN Script Tag
              </h3>
              <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">
              Works with any HTML page or framework - no npm install needed.
            </p>
            <div className="w-full">
              <CodeBlock code={scriptEmbedCode} language="html" />
            </div>
          </div>

          <div className="mb-5 sm:mb-6 md:mb-8 w-full">
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-white mb-1.5 sm:mb-2">
              Method 2: Next.js Script Component
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">
              Optimized loading with Next.js Script component.
            </p>
            <div className="w-full">
              <CodeBlock code={nextjsScriptCode} language="typescript" />
            </div>
          </div>

          <div className="mb-5 sm:mb-6 md:mb-8 w-full">
            <h3 className="text-base sm:text-lg md:text-xl font-medium text-white mb-1.5 sm:mb-2">
              Method 3: Reusable React Component
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">
              Create a wrapper component for easier reuse.
            </p>
            <div className="w-full">
              <CodeBlock code={reactComponentCode} language="typescript" />
            </div>
          </div>
        </div>

        <InstallationGuide />

        <div className="mt-6 sm:mt-8 md:mt-10 bg-slate-900 rounded-lg p-3 sm:p-4 md:p-6 border border-slate-800 w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
            Configuration Options
          </h2>

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            {[
              { key: "tourId", desc: "The unique ID of the tour to display" },
              { key: "apiKey", desc: "Your TourFlow API key (found in Settings)" },
              { key: "theme", desc: "'light' or 'dark' (default: 'dark')" },
              { key: "position", desc: "'bottom-right', 'bottom-left', 'top-right', or 'top-left'" },
            ].map(({ key, desc }) => (
              <div key={key} className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-3 w-full break-words">
                <code className="text-purple-400 font-mono text-xs sm:text-sm break-all min-w-[80px] sm:min-w-[100px]">
                  {key}
                </code>
                <span className="text-slate-300 text-xs sm:text-sm break-words flex-1">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 bg-slate-900 rounded-lg p-3 sm:p-4 md:p-6 border border-slate-800 w-full">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4">
            CDN Links
          </h2>
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
            <div>
              <div className="text-slate-400 mb-1">JavaScript:</div>
              <code className="text-purple-400 font-mono text-xs sm:text-sm break-all block w-full overflow-x-auto">
                https://unpkg.com/tourflow-widget@1.0.6/dist/tourflow-widget.iife.js
              </code>
            </div>

            <div>
              <div className="text-slate-400 mb-1">CSS:</div>
              <code className="text-purple-400 font-mono text-xs sm:text-sm break-all block w-full overflow-x-auto">
                https://unpkg.com/tourflow-widget@1.0.6/dist/style.css
              </code>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-5 md:pt-6 border-t border-slate-800">
          <a
            href="/docs"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors text-xs sm:text-sm md:text-base"
          >
            View full documentation
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}