import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  // Sign out function
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error('Failed to sign out', {
          description: error.message,
        })
        return
      }

      set({ user: null })
      toast.success('Signed out successfully', {
        description: 'See you next time!',
      })

      // Redirect to login
      window.location.href = '/auth/login'
    } catch (error) {
      console.log(error)
      toast.error('An error occurred', {
        description: 'Please try again',
      })
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      set({ loading: true })
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        set({ user: null, loading: false })
        return
      }

      set({ user, loading: false })
    } catch (error) {
      console.log(error)
      set({ user: null, loading: false })
    }
  },
}))