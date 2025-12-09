"use client";
import React, { useState } from "react";
import { Plus, MoreVertical, GripVertical, Pencil, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/SidebarBtn";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tour } from "@/types/tour";

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

    const handleTourClick = (tour: Tour) => {
        setSelectedTour(tour);
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
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium self-start sm:self-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tour
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tours List */}
                <div className="lg:col-span-1 space-y-4">
                    {tours.map((tour) => (
                        <Card
                            key={tour.id}
                            className={`bg-[#151b2e] border-[#1e2943] cursor-pointer transition-all hover:border-cyan-500/50 ${
                                selectedTour?.id === tour.id
                                    ? "border-cyan-500 ring-1 ring-cyan-500/20"
                                    : ""
                            }`}
                            onClick={() => handleTourClick(tour)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-white text-lg mb-1">
                                            {tour.name}
                                        </CardTitle>
                                        <CardDescription className="text-gray-400 text-sm">
                                            {tour.description}
                                        </CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            asChild
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-white"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#1e2943] border-[#2a3654] text-white">
                                            <DropdownMenuItem className="hover:bg-[#2a3654]">
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-[#2a3654]">
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-[#2a3654] text-red-400">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400">
                                        {tour.steps} steps
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            tour.status === "Active"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                        }`}
                                    >
                                        {tour.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
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
                        <Card className="bg-[#151b2e] border-[#1e2943]">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-white text-xl mb-1">
                                            {selectedTour.name}
                                        </CardTitle>
                                        <CardDescription className="text-gray-400">
                                            {selectedTour.description}
                                        </CardDescription>
                                    </div>
                                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium self-start sm:self-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Step
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {selectedTour.stepDetails.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <p>No steps added yet</p>
                                        <p className="text-sm mt-2">
                                            Click &quot;Add Step&quot; to create
                                            your first step
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedTour.stepDetails.map(
                                            (step, index) => (
                                                <div
                                                    key={step.id}
                                                    className="bg-[#1e2943] rounded-lg p-4 hover:bg-[#242d47] transition-colors group"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 cursor-move text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                                                        >
                                                            <GripVertical className="w-4 h-4" />
                                                        </Button>
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-black font-semibold flex-shrink-0 mt-0.5">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white font-medium mb-1">
                                                                {step.title}
                                                            </h4>
                                                            <p className="text-gray-400 text-sm">
                                                                {
                                                                    step.description
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-white"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-400 hover:text-red-400"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
        // </div>
    );
}
