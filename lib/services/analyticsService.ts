import { supabase } from '@/lib/supabase';

export interface WeeklyData {
  day: string;
  views: number;
}

export interface StepPerformanceData {
  step: string;
  views: number;
}

export interface TourStatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

export interface SkipRateData {
  step: string;
  rate: number;
}

export interface AnalyticsMetrics {
  totalViews: number;
  completionRate: number;
  avgTimeSpent: string;
}

// Type for metadata structure
interface StepMetadata {
  stepIndex?: number;
  stepId?: string;
  [key: string]: unknown;
}

export const analyticsService = {
  // Get analytics metrics
  async getAnalyticsMetrics(userId: string): Promise<AnalyticsMetrics> {
    try {
      // Get all tours for this user
      const { data: tours } = await supabase
        .from('tours')
        .select('id')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        return {
          totalViews: 0,
          completionRate: 0,
          avgTimeSpent: '0m 0s',
        };
      }

      const tourIds = tours.map(t => String(t.id));

      // Get total tour starts (views)
      const { data: tourStarts } = await supabase
        .from('tour_analytics')
        .select('id')
        .in('tour_id', tourIds)
        .eq('type', 'tour_started');

      const totalViews = tourStarts?.length || 0;

      // Get tour completions
      const { data: tourCompletions } = await supabase
        .from('tour_analytics')
        .select('id')
        .in('tour_id', tourIds)
        .eq('type', 'tour_completed');

      const completions = tourCompletions?.length || 0;
      const completionRate = totalViews > 0 ? (completions / totalViews) * 100 : 0;

      // Calculate average time spent (mock for now - you'd need to track duration)
      // You can enhance this by storing start/end timestamps and calculating duration
      const avgTimeSpent = '2m 34s';

      return {
        totalViews,
        completionRate: Math.round(completionRate),
        avgTimeSpent,
      };
    } catch (error) {
      console.error('Error fetching analytics metrics:', error);
      return {
        totalViews: 0,
        completionRate: 0,
        avgTimeSpent: '0m 0s',
      };
    }
  },

  // Get weekly active users
  async getWeeklyData(userId: string): Promise<WeeklyData[]> {
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('id')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        return [];
      }

      const tourIds = tours.map(t => String(t.id));

      // Get analytics for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: analytics } = await supabase
        .from('tour_analytics')
        .select('timestamp')
        .in('tour_id', tourIds)
        .eq('type', 'tour_started')
        .gte('timestamp', sevenDaysAgo.toISOString());

      // Group by day of week
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const viewsByDay: { [key: string]: number } = {
        Sun: 0,
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
      };

      analytics?.forEach(event => {
        const date = new Date(event.timestamp);
        const dayName = days[date.getDay()];
        viewsByDay[dayName]++;
      });

      // Return in Mon-Sun order
      const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return orderedDays.map(day => ({
        day,
        views: viewsByDay[day],
      }));
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      return [];
    }
  },

  // Get step performance (views per step)
  async getStepPerformance(userId: string): Promise<StepPerformanceData[]> {
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('id, total_steps')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        return [];
      }

      const tourIds = tours.map(t => String(t.id));
      const maxSteps = Math.max(...tours.map(t => t.total_steps || 0));

      const { data: analytics } = await supabase
        .from('tour_analytics')
        .select('metadata')
        .in('tour_id', tourIds)
        .in('type', ['step_viewed', 'step_completed']);

      // Count views per step
      const stepViews: { [key: number]: number } = {};

      analytics?.forEach(event => {
        if (event.metadata && typeof event.metadata === 'object') {
          const metadata = event.metadata as StepMetadata;
          const stepIndex = metadata.stepIndex;
          
          if (typeof stepIndex === 'number') {
            const stepNumber = stepIndex + 1;
            stepViews[stepNumber] = (stepViews[stepNumber] || 0) + 1;
          }
        }
      });

      // Create array for chart
      const result: StepPerformanceData[] = [];
      for (let i = 1; i <= Math.min(maxSteps, 5); i++) {
        result.push({
          step: `Step ${i}`,
          views: stepViews[i] || 0,
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching step performance:', error);
      return [];
    }
  },

  // Get tour status distribution
  async getTourStatus(userId: string): Promise<TourStatusData[]> {
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('status')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        return [];
      }

      const activeTours = tours.filter(t => t.status === 'active').length;
      const inactiveTours = tours.filter(t => t.status === 'inactive').length;

      return [
        { name: 'active', value: activeTours, color: '#9d00a8' },
        { name: 'inactive', value: inactiveTours, color: '#334155' },
      ];
    } catch (error) {
      console.error('Error fetching tour status:', error);
      return [];
    }
  },

  // Get step skip rates
  async getSkipRates(userId: string): Promise<SkipRateData[]> {
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('id, total_steps')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        return [];
      }

      const tourIds = tours.map(t => String(t.id));
      const maxSteps = Math.max(...tours.map(t => t.total_steps || 0));

      // Get all step views and skips
      const { data: analytics } = await supabase
        .from('tour_analytics')
        .select('type, metadata')
        .in('tour_id', tourIds)
        .in('type', ['step_viewed', 'step_skipped']);

      const stepViews: { [key: number]: number } = {};
      const stepSkips: { [key: number]: number } = {};

      analytics?.forEach(event => {
        if (event.metadata && typeof event.metadata === 'object') {
          const metadata = event.metadata as StepMetadata;
          const stepIndex = metadata.stepIndex;
          
          if (typeof stepIndex === 'number') {
            const stepNumber = stepIndex + 1;
            
            if (event.type === 'step_viewed') {
              stepViews[stepNumber] = (stepViews[stepNumber] || 0) + 1;
            } else if (event.type === 'step_skipped') {
              stepSkips[stepNumber] = (stepSkips[stepNumber] || 0) + 1;
            }
          }
        }
      });

      // Calculate skip rates
      const result: SkipRateData[] = [];
      for (let i = 1; i <= Math.min(maxSteps, 5); i++) {
        const views = stepViews[i] || 0;
        const skips = stepSkips[i] || 0;
        const total = views + skips;
        const skipRate = total > 0 ? (skips / total) * 100 : 0;

        result.push({
          step: `Step ${i}`,
          rate: Math.round(skipRate),
        });
      }

      return result;
    } catch (error) {
      console.error('Error fetching skip rates:', error);
      return [];
    }
  },
};