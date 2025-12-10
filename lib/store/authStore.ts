import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'

export interface Profile {
  id: string
  fullname?: string | null
  email?: string | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error('Failed to sign out', {
          description: error.message,
        })
        return
      }

      set({ user: null, profile: null })
      toast.success('Signed out successfully', {
        description: 'See you next time!',
      })

      // Redirect to login
      window.location.href = '/auth/login'
    } catch (err) {
      console.error(err)
      toast.error('An error occurred', {
        description: 'Please try again',
      })
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true })
      // Get the current user from supabase auth
      const { data: userData, error: userError } = await supabase.auth.getUser()

      const user = userData?.user ?? null

      if (userError) {
        console.error('getUser error', userError)
        set({ user: null, profile: null, loading: false })
        return
      }

      if (user) {
        // Fetch profile row from 'profiles' table
        const { data: profileRow, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          // If profile not found, keep profile null but still set user
          console.warn('profile fetch error', profileError)
          set({ user, profile: null, loading: false })
        } else {
          set({ user, profile: profileRow as Profile, loading: false })
        }
      } else {
        set({ user: null, profile: null, loading: false })
      }
    } catch (err) {
      console.error(err)
      set({ user: null, profile: null, loading: false })
    }
  },
}))





// import { create } from 'zustand'
// import { supabase } from '@/lib/supabase'
// import { User } from '@supabase/supabase-js'
// import { toast } from 'sonner'

// interface AuthState {
//   user: User | null
//   loading: boolean
//   setUser: (user: User | null) => void
//   setLoading: (loading: boolean) => void
//   signOut: () => Promise<void>
//   checkAuth: () => Promise<void>
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: true,

//   setUser: (user) => set({ user }),

//   setLoading: (loading) => set({ loading }),

//   // Sign out function
//   signOut: async () => {
//     try {
//       const { error } = await supabase.auth.signOut()

//       if (error) {
//         toast.error('Failed to sign out', {
//           description: error.message,
//         })
//         return
//       }

//       set({ user: null })
//       toast.success('Signed out successfully', {
//         description: 'See you next time!',
//       })

//       // Redirect to login
//       window.location.href = '/auth/login'
//     } catch (error) {
//       console.log(error)
//       toast.error('An error occurred', {
//         description: 'Please try again',
//       })
//     }
//   },

//   // Checking authentication status
//   checkAuth: async () => {
//     try {
//       set({ loading: true })
//       const { data: { user }, error } = await supabase.auth.getUser()

//       if (error) {
//         set({ user: null, loading: false })
//         return
//       }

//       set({ user, loading: false })
//     } catch (error) {
//       console.log(error)
//       set({ user: null, loading: false })
//     }
//   },
// }))