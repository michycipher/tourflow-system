"use client";

import { useEffect, useRef } from "react";

interface WidgetScriptProps {
  tourId: string;
  apiKey?: string;
  theme?: "light" | "dark";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  autoStart?: boolean;
}

declare global {
  interface Window {
    React?: typeof import("react");
    ReactDOM?: typeof import("react-dom");
    TourFlow?: {
      mountWidget: (config: {
        tourId?: string;
        tour_id?: string;
        apiKey?: string;
        api_key?: string;
        theme?: string;
        position?: string;
        supabaseUrl?: string;
        supabaseKey?: string;
        steps?: any[]; // ← Add this
      }) => void;
      destroy?: () => void;
      start?: () => void;
    };
    __TOURFLOW_DISABLE_AUTOINIT?: boolean;
    supabase?: any; // For Supabase client
  }
}

export default function WidgetScript({
  tourId,
  apiKey = "demo_key",
  theme = "dark",
  position = "bottom-right",
  autoStart = true,
}: WidgetScriptProps) {
  const loaded = useRef(false);

  // Function to fetch steps from Supabase
  const fetchTourSteps = async (): Promise<any[]> => {
    try {
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error("Missing Supabase credentials");
        return [];
      }

      // Create Supabase client
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Fetch steps for this tour
      const { data, error } = await supabase
        .from("tour_steps")
        .select("*")
        .eq("tour_id", tourId)
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching steps:", error);
        return [];
      }

      console.log(`✅ Fetched ${data?.length || 0} steps for tour: ${tourId}`);
      return data || [];
    } catch (error) {
      console.error("Failed to fetch steps:", error);
      return [];
    }
  };

  useEffect(() => {
    if (loaded.current) return;

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error("Missing Supabase environment variables");
      return;
    }

    const ensureReact = () =>
      new Promise<void>((resolve) => {
        if (window.React && window.ReactDOM) {
          return resolve();
        }

        const reactScript = document.createElement("script");
        reactScript.src =
          "https://unpkg.com/react@18/umd/react.production.min.js";
        reactScript.crossOrigin = "anonymous";
        reactScript.onload = () => {

          const reactDomScript = document.createElement("script");
          reactDomScript.src =
            "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
          reactDomScript.crossOrigin = "anonymous";
          reactDomScript.onload = () => {
            resolve();
          };
          document.head.appendChild(reactDomScript);
        };

        document.head.appendChild(reactScript);
      });

    const ensureStyles = () => {
      if (document.getElementById("tourflow-styles")) {
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://unpkg.com/tourflow-widget@1.0.6/dist/style.css";
      link.id = "tourflow-styles";
      document.head.appendChild(link);
    };

    const ensureWidget = () =>
      new Promise<void>((resolve, reject) => {
        window.__TOURFLOW_DISABLE_AUTOINIT = true;
        
        const existingContainer = document.getElementById('__tourflow_widget_root');
        if (existingContainer) {
          existingContainer.remove();
          console.log('🧹 Removed existing widget container');
        }

        if (window.TourFlow) {
          if (window.TourFlow.destroy) {
            window.TourFlow.destroy();
          }
          return resolve();
        }

        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/tourflow-widget@1.0.6/dist/tourflow-widget.iife.js";
        script.id = "tourflow-script";
        
        script.setAttribute('data-tour-id', tourId);
        script.setAttribute('data-api-key', apiKey);
        script.setAttribute('data-theme', theme);
        script.setAttribute('data-position', position);
        if (SUPABASE_URL) script.setAttribute('data-supabase-url', SUPABASE_URL);
        if (SUPABASE_KEY) script.setAttribute('data-supabase-key', SUPABASE_KEY);
        script.setAttribute('data-disable-autostart', 'true');

        script.onload = () => {
          resolve();
        };

        script.onerror = () => {
          reject();
        };

        document.body.appendChild(script);
      });

    const initWidget = async () => { // ← Make this async
      
      if (!window.TourFlow) {
        console.error("TourFlow widget not loaded");
        return;
      }

      if (window.TourFlow.destroy) {
        window.TourFlow.destroy();
      }

      try {
        // 1. First, fetch steps from Supabase
        const steps = await fetchTourSteps();
        
        console.log(`Initializing widget with ${steps.length} steps for tour: ${tourId}`);

        // 2. Then initialize widget WITH the fetched steps
        const config = {
          tour_id: tourId,
          api_key: apiKey,
          theme: theme,
          position: position,
          supabaseUrl: SUPABASE_URL,
          supabaseKey: SUPABASE_KEY,
          steps: steps, // ← CRITICAL: Pass fetched steps!
        };
        
        window.TourFlow.mountWidget(config);

        const tourFlowWithStart = window.TourFlow as typeof window.TourFlow & {
          start?: () => void;
        };
        
        if (autoStart && tourFlowWithStart.start) {
          tourFlowWithStart.start();
        }
      } catch (err) {
        console.error("Error initializing widget:", err);
      }
    };

    const load = async () => {
      loaded.current = true;

      try {
        ensureStyles();
        await ensureReact();
        await ensureWidget();
        await initWidget(); // ← Await the async init
        
      } catch (error) {
        console.error("Failed to load widget:", error);
      }
    };

    load();

    return () => {
      console.log('🧹 Cleaning up widget...');
      if (window.TourFlow?.destroy) {
        try {
          window.TourFlow.destroy();
        } catch (err) {
          console.error("Error destroying widget:", err);
        }
      }
      const widgetContainer = document.getElementById('__tourflow_widget_root');
      if (widgetContainer) {
        widgetContainer.remove();
      }
      delete window.__TOURFLOW_DISABLE_AUTOINIT;
    };
  }, [tourId, apiKey, theme, position, autoStart]);

  return null;
}