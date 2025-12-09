"use client";
import { useEffect, useState } from "react";
import { supabase, signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

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
        <div className="p-8">
            <div className="bg-slate-900 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                    Welcome to Your Dashboard! 🎉
                </h2>
                <p className="text-slate-300 mb-4">
                    Authentication is working! You&apos;re logged in as:{" "}
                    <strong>{user?.email}</strong>
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Tours</h3>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm opacity-90">
                            Total tours created
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">Steps</h3>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm opacity-90">
                            Total steps configured
                        </p>
                    </div>

                    <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <h3 className="text-lg font-semibold mb-2">
                            Completions
                        </h3>
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm opacity-90">Tour completions</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
