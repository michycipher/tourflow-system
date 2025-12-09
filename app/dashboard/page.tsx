"use client";
import { useEffect, useState } from "react";
import { supabase, signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/auth/login");
            } else {
                setUser(user);
                setLoading(false);
            }
        };

        checkUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/auth/login");
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-950 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.email?.split('@')[0] || 'user@mail.com'}!
                </h1>
                <p className="text-slate-400">
                    Here&#39;s what&#39;s happening with your tours today.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Completed Tours</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">7</div>
                    <div className="text-slate-400 text-sm">Total tours created</div>
                </div>

                {/* Total steps configured */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Steps</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-slate-400 text-sm">Total Steps Configure</div>
                </div>

                {/* Active Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-cyan-500" />
                        </div>
                        <div className="flex items-center text-emerald-500 text-sm">
                            <span className="mr-1">Active Tours</span>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">2</div>
                    <div className="text-slate-400 text-sm">Active Tours</div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tours */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Recent Tours</h2>
                        <Link href='/dashboard/tours' className="text-cyan-500 hover:text-cyan-400 text-sm flex items-center">
                            View All
                            <span className="ml-1">→</span>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {/* Welcome Tour */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                            <div>
                                <h3 className="text-white font-medium mb-1">Welcome Tour</h3>
                                <p className="text-slate-400 text-sm">5 steps</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
                                Active
                            </span>
                        </div>

                        {/* Feature Discovery */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                            <div>
                                <h3 className="text-white font-medium mb-1">Feature Discovery</h3>
                                <p className="text-slate-400 text-sm">5 steps</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-medium">
                                Inactive
                            </span>
                        </div>

                        {/* Onboarding Flow */}
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                            <div>
                                <h3 className="text-white font-medium mb-1">Onboarding Flow</h3>
                                <p className="text-slate-400 text-sm">5 steps</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Step Performance */}
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                    <h2 className="text-xl font-semibold text-white mb-6">Step Performance</h2>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Step 1</span>
                                <span className="text-slate-300 text-sm font-medium">95%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Step 2</span>
                                <span className="text-slate-300 text-sm font-medium">94%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Step 3</span>
                                <span className="text-slate-300 text-sm font-medium">94%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Step 4</span>
                                <span className="text-slate-300 text-sm font-medium">93%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full w-[95%]"></div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-300 text-sm">Step 5</span>
                                <span className="text-slate-300 text-sm font-medium">75%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full w-[75%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}