interface TourStep {
  id: string;
  title: string;
  content: string;
}

interface TourflowWidget {
  mountWidget: (config: {
    tour_id: string;
    supabaseUrl?: string;
    supabaseKey?: string;
    steps: TourStep[];
    startImmediately?: boolean;
    enableAnalytics?: boolean;
  }) => void;
}

interface Window {
  TourflowWidget?: TourflowWidget;
}
