"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/authStore";
import { ArrowLeftIcon } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message,
        });
        setLoading(false);
        return;
      }

      const user = data.user;

      if (!user) {
        toast.error("Login failed: no user returned");
        setLoading(false);
        return;
      }

      // fetch profile
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.warn(
          "No profile found or error fetching profile",
          profileError
        );
        setUser(user);
        setProfile(null);
      } else {
        setUser(user);
        setProfile(profileRow);
      }

      toast.success("Welcome back!", {
        description: `Signed in as ${email}`,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F17] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#0D131C] p-8 rounded-2xl shadow-xl border border-white/5 backdrop-blur">
        <Link
          href="/"
          className="text-gray-400 icon-hover flex items-center py-2"
        >
          <ArrowLeftIcon />
          <span className="text-gray-400 icon-hover ml-3">Back to home</span>
        </Link>

        <div className="py-4">
          <h2 className="text-4xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Login to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md bg-[#0A0F17] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-[#800080] focus:border-[#800080]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 rounded-md bg-[#0A0F17] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-[#800080] focus:border-[#800080]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 rounded-md shadow-md text-sm font-medium text-white bg-[#800080] hover:bg-[#9d00a8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-300">Don&#39;t have an account? </span>
            <Link
              href="/auth/signup"
              className="font-medium text-[#800080] hover:text-[#9d00a8]"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// 'use client'

// import { useState } from 'react'
// import { supabase } from '@/lib/supabase'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { toast } from 'sonner'
// import { useAuthStore } from '@/lib/store/authStore'
// import { ArrowLeftIcon } from 'lucide-react'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const setUser = useAuthStore((state) => state.setUser)

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })

//     if (error) {
//       toast.error('Login failed', {
//         description: error.message,
//       })
//       setLoading(false)
//     } else {
//       // Update auth store
//       setUser(data.user)

//       toast.success('Welcome back!', {
//         description: `Signed in as ${email}`,
//       })

//       // Successfully logged in
//       router.push('/dashboard')
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0A0F17] px-4">
//       <div className="max-w-md w-full space-y-8 bg-[#0D131C] p-8 rounded-2xl shadow-xl border border-white/5 backdrop-blur">

//           <Link href='/' className='text-gray-400 icon-hover flex items-center py-2'>
//           <ArrowLeftIcon />
//           <span className='text-gray-400 icon-hover ml-3'>Back to home</span>
//           </Link>

//         <div className='py-4'>
//           <h2 className="text-4xl font-bold text-white">
//             Welcome back
//           </h2>
//           <p className="mt-2 text-gray-400">
//             Login to access your dashboard
//           </p>
//         </div>

//         <form onSubmit={handleLogin} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-200">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 rounded-md bg-[#0A0F17] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-[#800080] focus:border-[#800080]"
//                 placeholder="you@example.com"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-200">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 block w-full px-3 py-2 rounded-md bg-[#0A0F17] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-[#800080] focus:border-[#800080]"
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-3.5 px-4 rounded-md shadow-md text-sm font-medium text-white bg-[#800080] hover:bg-[#9d00a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800080] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>

//           <div className="text-center text-sm">
//             <span className="text-gray-300">Don’t have an account? </span>
//             <Link href="/auth/signup" className="font-medium text-[#800080] hover:text-[#9d00a8]">
//               Sign up
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }
