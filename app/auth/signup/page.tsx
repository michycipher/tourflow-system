'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/authStore'
import { ArrowLeftIcon, AlertCircle } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const router = useRouter()
  const { setUser, setProfile } = useAuthStore()

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate full name (at least 2 characters, letters and spaces only)
  const validateFullName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]{2,}$/
    return nameRegex.test(name.trim())
  }

  // Handle input changes with real-time validation
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFullName(value)
    
    if (value && !validateFullName(value)) {
      setErrors(prev => ({ ...prev, fullName: 'Please enter a valid name (letters only, min 2 characters)' }))
    } else {
      setErrors(prev => ({ ...prev, fullName: '' }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (value && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    if (value && value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }

    // Also check confirm password match if it has a value
    if (confirmPassword && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    } else if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    
    if (value && value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }))
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Final validation before submission
    let hasErrors = false
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
      hasErrors = true
    } else if (!validateFullName(fullName)) {
      newErrors.fullName = 'Please enter a valid name (letters only, min 2 characters)'
      hasErrors = true
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
      hasErrors = true
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
      hasErrors = true
    }

    if (!password) {
      newErrors.password = 'Password is required'
      hasErrors = true
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      hasErrors = true
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      setLoading(false)
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          }
        }
      })

      if (error) {
        toast.error('Signup failed', {
          description: error.message,
        })
        setLoading(false)
        return
      }

      const user = data.user

      if (!user) {
        toast.error('Signup failed: no user returned')
        setLoading(false)
        return
      }

      // Update auth store with user
      setUser(user)

      // Try to fetch profile (it should be created by trigger)
      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.warn('Profile not found yet, will be created by trigger', profileError)
        setProfile(null)
      } else {
        setProfile(profileRow)
      }

      toast.success('Account created!', {
        description: 'Welcome to TourFlow',
      })

      // Wait a bit to ensure auth state is fully set before redirecting
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      toast.error('An error occurred', {
        description: 'Please try again',
      })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F17] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#0D131C] p-8 rounded-2xl shadow-xl border border-white/5 backdrop-blur">

        <Link href="/" className="text-gray-400 icon-hover flex items-center py-2">
          <ArrowLeftIcon />
          <span className="text-gray-400 icon-hover ml-3">Back to home</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-400">
            Get started with your onboarding dashboard
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={handleFullNameChange}
                className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.fullName 
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
                }`}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <div className="mt-1 flex items-center text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.email 
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <div className="mt-1 flex items-center text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="mt-1 flex items-center text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword 
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center text-xs text-red-400">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded-md shadow-md text-sm font-medium text-white bg-[#800080] hover:bg-[#9d00a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800080] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-300">Already have an account? </span>
            <Link href="/auth/login" className="font-medium text-[#800080] hover:text-[#9d00a8]">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}








// 'use client'

// import { useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { toast } from 'sonner'
// import { useAuthStore } from '@/lib/store/authStore'
// import { ArrowLeftIcon, AlertCircle } from 'lucide-react'

// export default function SignupPage() {
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [errors, setErrors] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
  
//   const router = useRouter()
//   const setUser = useAuthStore((state) => state.setUser)

//   // Validate email format
//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     return emailRegex.test(email)
//   }

//   // Validate full name (at least 2 characters, letters and spaces only)
//   const validateFullName = (name: string) => {
//     const nameRegex = /^[a-zA-Z\s]{2,}$/
//     return nameRegex.test(name.trim())
//   }

//   // Handle input changes with real-time validation
//   const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setFullName(value)
    
//     if (value && !validateFullName(value)) {
//       setErrors(prev => ({ ...prev, fullName: 'Please enter a valid name (letters only, min 2 characters)' }))
//     } else {
//       setErrors(prev => ({ ...prev, fullName: '' }))
//     }
//   }

//   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setEmail(value)
    
//     if (value && !validateEmail(value)) {
//       setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
//     } else {
//       setErrors(prev => ({ ...prev, email: '' }))
//     }
//   }

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setPassword(value)
    
//     if (value && value.length < 6) {
//       setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
//     } else {
//       setErrors(prev => ({ ...prev, password: '' }))
//     }

//     // Also check confirm password match if it has a value
//     if (confirmPassword && value !== confirmPassword) {
//       setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
//     } else if (confirmPassword) {
//       setErrors(prev => ({ ...prev, confirmPassword: '' }))
//     }
//   }

//   const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     setConfirmPassword(value)
    
//     if (value && value !== password) {
//       setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
//     } else {
//       setErrors(prev => ({ ...prev, confirmPassword: '' }))
//     }
//   }

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     // Final validation before submission
//     let hasErrors = false
//     const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' }

//     if (!fullName.trim()) {
//       newErrors.fullName = 'Full name is required'
//       hasErrors = true
//     } else if (!validateFullName(fullName)) {
//       newErrors.fullName = 'Please enter a valid name (letters only, min 2 characters)'
//       hasErrors = true
//     }

//     if (!email.trim()) {
//       newErrors.email = 'Email is required'
//       hasErrors = true
//     } else if (!validateEmail(email)) {
//       newErrors.email = 'Please enter a valid email address'
//       hasErrors = true
//     }

//     if (!password) {
//       newErrors.password = 'Password is required'
//       hasErrors = true
//     } else if (password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters'
//       hasErrors = true
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//       hasErrors = true
//     }

//     if (hasErrors) {
//       setErrors(newErrors)
//       setLoading(false)
//       toast.error('Please fix the errors in the form')
//       return
//     }

//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           full_name: fullName.trim(),
//         }
//       }
//     })

//     if (error) {
//       toast.error('Signup failed', {
//         description: error.message,
//       })
//       setLoading(false)
//     } else {
//       // Update auth store
//       setUser(data.user)

//       toast.success('Account created!', {
//         description: 'Welcome to TourFlow',
//       })

//       setTimeout(() => {
//         router.push('/dashboard')
//       }, 1000)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0A0F17] px-4">
//       <div className="max-w-md w-full space-y-8 bg-[#0D131C] p-8 rounded-2xl shadow-xl border border-white/5 backdrop-blur">

//         <Link href='/' className='text-gray-400 icon-hover flex items-center py-2'>
//           <ArrowLeftIcon />
//           <span className='text-gray-400 icon-hover ml-3'>Back to home</span>
//         </Link>

//         <div>
//           <h2 className="text-4xl font-bold text-white">
//             Create your account
//           </h2>
//           <p className="mt-2 text-gray-400">
//             Get started with your onboarding dashboard
//           </p>
//         </div>

//         <form onSubmit={handleSignup} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             {/* Full Name */}
//             <div>
//               <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
//                 Full Name
//               </label>
//               <input
//                 id="fullName"
//                 type="text"
//                 required
//                 value={fullName}
//                 onChange={handleFullNameChange}
//                 className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
//                   errors.fullName 
//                     ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
//                     : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
//                 }`}
//                 placeholder="John Doe"
//               />
//               {errors.fullName && (
//                 <div className="mt-1 flex items-center text-xs text-red-400">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {errors.fullName}
//                 </div>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={handleEmailChange}
//                 className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
//                   errors.email 
//                     ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
//                     : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
//                 }`}
//                 placeholder="you@example.com"
//               />
//               {errors.email && (
//                 <div className="mt-1 flex items-center text-xs text-red-400">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {errors.email}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 value={password}
//                 onChange={handlePasswordChange}
//                 className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
//                   errors.password 
//                     ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
//                     : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
//                 }`}
//                 placeholder="••••••••"
//               />
//               {errors.password && (
//                 <div className="mt-1 flex items-center text-xs text-red-400">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {errors.password}
//                 </div>
//               )}
//             </div>

//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 required
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 className={`mt-1 block w-full px-3 py-2 bg-[#1a1f2e] border rounded-md shadow-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
//                   errors.confirmPassword 
//                     ? 'border-red-400 focus:ring-red-400 focus:border-red-400' 
//                     : 'border-gray-600 focus:ring-[#800080] focus:border-transparent'
//                 }`}
//                 placeholder="••••••••"
//               />
//               {errors.confirmPassword && (
//                 <div className="mt-1 flex items-center text-xs text-red-400">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {errors.confirmPassword}
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-3.5 px-4 rounded-md shadow-md text-sm font-medium text-white bg-[#800080] hover:bg-[#9d00a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800080] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
//           >
//             {loading ? 'Creating account...' : 'Sign up'}
//           </button>

//           <div className="text-center text-sm">
//             <span className="text-gray-300">Already have an account? </span>
//             <Link href="/auth/login" className="font-medium text-[#800080] hover:text-[#9d00a8]">
//               Login
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
