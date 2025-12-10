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
    React?: typeof import('react');
    ReactDOM?: typeof import('react-dom');
    TourFlow?: {
      init: (config: {
        tourId: string;
        apiKey?: string;
        theme?: string;
        position?: string;
      }) => void;
      destroy?: () => void;
      start?: () => void;
    };
  }
}

export default function WidgetScript({
  tourId,
  apiKey = "demo_key",
  theme = "dark",
  position = "bottom-right",
  autoStart = true,
}: WidgetScriptProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const loadWidget = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/tourflow-widget@1.0.2/dist/style.css";
      link.id = "tourflow-styles";

      const reactScript = document.createElement("script");
      reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
      reactScript.crossOrigin = "anonymous";
      reactScript.id = "react-cdn";

      const reactDomScript = document.createElement("script");
      reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
      reactDomScript.crossOrigin = "anonymous";
      reactDomScript.id = "react-dom-cdn";

      const widgetScript = document.createElement("script");
      widgetScript.src = "https://unpkg.com/tourflow-widget@1.0.2/dist/tourflow-widget.iife.js";
      widgetScript.id = "tourflow-script";

      widgetScript.onload = () => {
        scriptLoaded.current = true;
        console.log("TourFlow widget loaded");

        setTimeout(() => {
          if (window.TourFlow) {
            try {
              window.TourFlow.init({
                tourId,
                apiKey,
                theme,
                position,
              });
              console.log("TourFlow initialized successfully");

              if (autoStart && window.TourFlow.start) {
                window.TourFlow.start();
              }
            } catch (error) {
              console.error("TourFlow initialization error:", error);
            }
          } else {
            console.warn("TourFlow not available on window object");
          }
        }, 200);
      };

      widgetScript.onerror = () => {
        console.error("Failed to load TourFlow widget");
      };

      // Check if scripts already exist
      const existingReact = document.getElementById("react-cdn");
      const existingReactDom = document.getElementById("react-dom-cdn");
      const existingWidget = document.getElementById("tourflow-script");
      const existingStyles = document.getElementById("tourflow-styles");

      if (!existingStyles) {
        document.head.appendChild(link);
      }

      if (!existingReact && !existingReactDom) {
        document.head.appendChild(reactScript);
        
        reactScript.onload = () => {
          console.log("React loaded");
          document.head.appendChild(reactDomScript);
          
          reactDomScript.onload = () => {
            console.log("ReactDOM loaded");
            if (!existingWidget) {
              document.body.appendChild(widgetScript);
            }
          };
        };
      } else if (!existingWidget && window.React && window.ReactDOM) {
        document.body.appendChild(widgetScript);
      } else if (window.TourFlow) {
        window.TourFlow.init({
          tourId,
          apiKey,
          theme,
          position,
        });
      }
    };

    loadWidget();

    return () => {
      if (window.TourFlow?.destroy) {
        try {
          window.TourFlow.destroy();
        } catch (error) {
          console.error("Error destroying TourFlow:", error);
        }
      }
    };
  }, [tourId, apiKey, theme, position, autoStart]);

  return null;
}