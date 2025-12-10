import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalTours: number;
  totalSteps: number;
  activeTours: number;
  totalUsers: number;
}

export interface RecentTour {
  id: string;
  title: string;
  total_steps: number;
  status: 'active' | 'inactive';
}

export interface StepPerformance {
  step_number: number;
  completion_rate: number;
}

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get total tours for this user
      const { count: totalTours } = await supabase
        .from('tours')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get active tours for this user
      const { count: activeTours } = await supabase
        .from('tours')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Get total steps across all user's tours
      const { data: tours } = await supabase
        .from('tours')
        .select('total_steps')
        .eq('user_id', userId);

      const totalSteps = tours?.reduce((sum, tour) => sum + (tour.total_steps || 0), 0) || 0;

      // Get total users from profiles table (synced with auth.users)
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error counting users:', usersError);
      }

      return {
        totalTours: totalTours || 0,
        totalSteps,
        activeTours: activeTours || 0,
        totalUsers: totalUsers || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalTours: 0,
        totalSteps: 0,
        activeTours: 0,
        totalUsers: 0,
      };
    }
  },

  // Get recent tours
  async getRecentTours(userId: string, limit: number = 3): Promise<RecentTour[]> {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('id, title, total_steps, status')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching recent tours:', error);
      return [];
    }
  },

  // Get average step performance across all tours
  async getAverageStepPerformance(userId: string): Promise<StepPerformance[]> {
    try {
      const { data: tours } = await supabase
        .from('tours')
        .select('id')
        .eq('user_id', userId);

      if (!tours || tours.length === 0) {
        // Return default 5 steps with sample data for demo
        return [
          { step_number: 1, completion_rate: 95 },
          { step_number: 2, completion_rate: 94 },
          { step_number: 3, completion_rate: 94 },
          { step_number: 4, completion_rate: 93 },
          { step_number: 5, completion_rate: 75 },
        ];
      }

      const tourIds = tours.map(t => t.id);

      const { data, error } = await supabase
        .from('tour_steps')
        .select('step_number, completion_rate')
        .in('tour_id', tourIds)
        .order('step_number', { ascending: true });

      if (error) throw error;

      // Calculate average completion rate per step number
      const stepMap = new Map<number, number[]>();

      data?.forEach(step => {
        if (!stepMap.has(step.step_number)) {
          stepMap.set(step.step_number, []);
        }
        stepMap.get(step.step_number)?.push(step.completion_rate);
      });

      const averages: StepPerformance[] = [];
      
      // If we have data, calculate averages
      if (stepMap.size > 0) {
        stepMap.forEach((rates, stepNumber) => {
          const avg = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
          averages.push({ 
            step_number: stepNumber, 
            completion_rate: Math.round(avg * 100) / 100 
          });
        });
        
        return averages.sort((a, b) => a.step_number - b.step_number);
      } else {
        // Return sample data if no steps exist yet
        return [
          { step_number: 1, completion_rate: 95 },
          { step_number: 2, completion_rate: 94 },
          { step_number: 3, completion_rate: 94 },
          { step_number: 4, completion_rate: 93 },
          { step_number: 5, completion_rate: 75 },
        ];
      }
    } catch (error) {
      console.error('Error fetching average step performance:', error);
      return [
        { step_number: 1, completion_rate: 95 },
        { step_number: 2, completion_rate: 94 },
        { step_number: 3, completion_rate: 94 },
        { step_number: 4, completion_rate: 93 },
        { step_number: 5, completion_rate: 75 },
      ];
    }
  },
};