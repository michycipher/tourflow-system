"use client";
import React, { useState } from "react";
import { Tour } from "@/types/tour";
import TourDetails from "@/components/dashboard/TourDetails";
import TourCard from "@/components/dashboard/TourCard";
import { Card, CardContent } from "@/components/ui/card";
import CreateTourDialog from "@/components/dashboard/CreateTourDialog";

const initialTours: Tour[] = [
    {
        id: 1,
        name: "Welcome Tour",
        description: "Introduce new users to the platform",
        steps: 5,
        status: "Active",
        stepDetails: [
            {
                id: 1,
                title: "Welcome!",
                description: "Welcome to our platform! Let us show you around.",
            },
            {
                id: 2,
                title: "Navigation",
                description:
                    "Use the sidebar to navigate between different sections.",
            },
            {
                id: 3,
                title: "Dashboard",
                description:
                    "This is your main dashboard where you can see all your data.",
            },
            {
                id: 4,
                title: "Settings",
                description: "Customize your experience in the settings panel.",
            },
            {
                id: 5,
                title: "Get Help",
                description:
                    "Need assistance? Click here to access our help center.",
            },
        ],
    },
    {
        id: 2,
        name: "Feature Discovery",
        description: "Show users advanced features",
        steps: 4,
        status: "Inactive",
        stepDetails: [
            {
                id: 1,
                title: "Advanced Search",
                description: "Learn how to use our powerful search features.",
            },
            {
                id: 2,
                title: "Integrations",
                description: "Connect with your favorite tools.",
            },
            {
                id: 3,
                title: "Analytics",
                description: "Dive deep into your data with analytics.",
            },
            {
                id: 4,
                title: "Automation",
                description: "Set up automated workflows.",
            },
        ],
    },
    {
        id: 3,
        name: "Onboarding Flow",
        description: "Complete onboarding for new accounts",
        steps: 5,
        status: "Active",
        stepDetails: [
            {
                id: 1,
                title: "Create Profile",
                description: "Set up your profile information.",
            },
            {
                id: 2,
                title: "Team Setup",
                description: "Invite your team members.",
            },
            {
                id: 3,
                title: "Preferences",
                description: "Configure your preferences.",
            },
            {
                id: 4,
                title: "First Project",
                description: "Create your first project.",
            },
            {
                id: 5,
                title: "Done!",
                description: "You are all set! Start exploring.",
            },
        ],
    },
    {
        id: 4,
        name: "habamsbn",
        description: "No description",
        steps: 0,
        status: "Inactive",
        stepDetails: [],
    },
];

export default function TourManagement() {
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [tours, setTours] = useState(initialTours);

    const handleCreateTour = (newTour: Omit<Tour, "id">) => {
        const tourWithId: Tour = {
            ...newTour,
            id: tours.length > 0 ? Math.max(...tours.map((t) => t.id)) + 1 : 1,
        };
        setTours([...tours, tourWithId]);
        // Optionally select the newly created tour
        setSelectedTour(tourWithId);
    };

    const handleUpdateTour = (updatedTour: Tour) => {
        setTours(tours.map((t) => (t.id === updatedTour.id ? updatedTour : t)));
        setSelectedTour(updatedTour);
    };

    return (
        // <div className="min-h-screen bg-[#0a0e1a] text-white p-4 md:p-6 lg:p-8">
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
                <CreateTourDialog onCreateTour={handleCreateTour} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tours List */}
                <div className="lg:col-span-1 space-y-4">
                    {tours.map((tour) => (
                        <TourCard
                            key={tour?.id}
                            selectedTour={selectedTour}
                            tour={tour}
                            setSelectedTour={setSelectedTour}
                        />
                    ))}
                </div>

                {/* Tour Details Panel */}
                <div className="lg:col-span-2">
                    {!selectedTour ? (
                        <Card className="bg-[#151b2e] border-[#1e2943] h-full min-h-[400px] flex items-center justify-center">
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
