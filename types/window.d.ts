export interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
}

export interface TourConfig {
  tour_id?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  steps?: TourStep[];
}

declare global {
  interface Window {
    TourflowWidget?: {
      init: (config?: TourConfig) => Promise<void>;
      destroy: () => void;
      resume: () => void;
    };
  }
}