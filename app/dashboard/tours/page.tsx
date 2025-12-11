"use client";
import React, { useState, useEffect } from "react";
import { Tour } from "@/types/tour";
import TourDetails from "@/components/dashboard/TourDetails";
import TourCard from "@/components/dashboard/TourCard";
import { Card, CardContent } from "@/components/ui/card";
import CreateTourDialog from "@/components/dashboard/CreateTourDialog";
import { getUserToursWithSteps } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth"; // Create this hook as I showed earlier

export default function TourManagement() {
    const { user, loading: authLoading } = useAuth();
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTours = async () => {
        if (!user?.id) return;

        setLoading(true);
        const { data, error } = await getUserToursWithSteps(user.id);

        if (data) {
            setTours(data);
            console.log(data);
        } else if (error) {
            console.error("Error loading tours:", error);
        }

        setLoading(false);
    };

    // Load tours when component mounts or user changes
    useEffect(() => {
        console.log("👤 Current user ID:", user?.id);
        console.log("📋 Loaded tours:", tours);

        if (tours.length > 0) {
            tours.forEach((tour) => {
                console.log(`🎯 Tour: "${tour.title}" - ID: ${tour.id}`);
                console.log(`   Steps count: ${tour.tour_steps?.length || 0}`);
            });
        }
    }, [tours, user]);

    useEffect(() => {
        if (user?.id) {
            loadTours();
        }
    }, [user?.id]);

    const handleUpdateTour = (updatedTour: Tour) => {
        setTours(tours.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
        setSelectedTour(updatedTour);
    };

    // Show loading state
    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#110816]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800080] mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Show auth error
    if (!user) {
        return (
            <div className="mx-auto text-white">
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-gray-400">
                        Please log in to manage tours
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Tours
                    </h1>
                    <p className="text-gray-400">
                        Create and manage your onboarding tours.
                    </p>
                </div>
                <CreateTourDialog userId={user.id} onTourCreated={loadTours} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tours List */}
                <div className="lg:col-span-1 space-y-4">
                    {tours.length === 0 ? (
                        <Card className="bg-sidebar/90! border-primary/40 hover:border-primary/90!p-6">
                            <p className="text-gray-400 text-center">
                                No tours yet. Create your first tour!
                            </p>
                        </Card>
                    ) : (
                        tours.map((tour) => (
                            <TourCard
                                onTourUpdated={loadTours}
                                key={tour.id}
                                selectedTour={selectedTour}
                                tour={tour}
                                setSelectedTour={setSelectedTour}
                                userId={user?.id}
                            />
                        ))
                    )}
                </div>

                {/* Tour Details Panel */}
                <div className="lg:col-span-2">
                    {!selectedTour ? (
                        <Card className="bg-sidebar/90! border-primary/40 hover:border-primary/90! h-full min-h-[400px] flex items-center justify-center">
                            <CardContent>
                                <p className="text-gray-400 text-center">
                                    Select a tour to view and edit its steps
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <TourDetails
                            selectedTour={selectedTour}
                            onUpdateTour={handleUpdateTour}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
