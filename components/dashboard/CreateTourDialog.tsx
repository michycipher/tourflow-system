"use client";
import React, { useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/SidebarBtn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { createTour } from "@/lib/supabase";

interface StepInput {
    title: string;
    description: string;
}

interface CreateTourDialogProps {
    userId: string;
    onTourCreated: () => void; // Callback to refresh tours list
}

export default function CreateTourDialog({
    userId,
    onTourCreated,
}: CreateTourDialogProps) {
    const [open, setOpen] = useState(false);
    const [tourName, setTourName] = useState("");
    const [tourDescription, setTourDescription] = useState("");
    const [tourStatus, setTourStatus] = useState<"Active" | "Inactive">(
        "Inactive"
    );
    const [steps, setSteps] = useState<StepInput[]>([
        { title: "", description: "" },
    ]);
    const [errors, setErrors] = useState<{
        tourName?: string;
        tourDescription?: string;
        steps?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addStep = () => {
        setSteps([...steps, { title: "", description: "" }]);
        if (errors.steps) {
            setErrors({ ...errors, steps: undefined });
        }
    };

    const removeStep = (index: number) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    };

    const updateStep = (
        index: number,
        field: keyof StepInput,
        value: string
    ) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);

        if (errors.steps) {
            setErrors({ ...errors, steps: undefined });
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!tourName.trim()) {
            newErrors.tourName = "Tour name is required";
        }

        if (!tourDescription.trim()) {
            newErrors.tourDescription = "Tour description is required";
        }

        const validSteps = steps.filter(
            (step) => step.title.trim() && step.description.trim()
        );

        if (validSteps.length < 5) {
            newErrors.steps = `You need ${
                5 - validSteps.length
            } more complete step${
                5 - validSteps.length > 1 ? "s" : ""
            } (minimum 5 required)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {

            toast.error("Please fill in all required fields", {
                description: "Check the form for validation errors",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const validSteps = steps
                .filter((step) => step.title.trim() && step.description.trim())
                .map((step) => ({
                    title: step.title.trim(),
                    description: step.description.trim(),
                }));

            const { error } = await createTour(userId, {
                title: tourName.trim(),
                description: tourDescription.trim(),
                status: tourStatus.toLowerCase() as "active" | "inactive",
                steps: validSteps,
            });

            if (error) {
                throw new Error(error);
            }

            toast.success("Tour created successfully!", {
                description: `"${tourName}" has been added with ${validSteps.length} steps`,
            });

            // Reset form
            setTourName("");
            setTourDescription("");
            setTourStatus("Inactive");
            setSteps([{ title: "", description: "" }]);
            setErrors({});
            setOpen(false);

            // Trigger parent refresh
            onTourCreated();
        } catch (error: any) {
            console.error("Error creating tour:", error);
            toast.error("Failed to create tour", {
                description:
                    error.message || "Please try again or contact support",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        const hasData =
            tourName.trim() ||
            tourDescription.trim() ||
            steps.some((s) => s.title.trim() || s.description.trim());

        if (hasData) {
            const confirm = window.confirm(
                "Are you sure you want to cancel? All unsaved changes will be lost."
            );
            if (!confirm) return;
        }

        setTourName("");
        setTourDescription("");
        setTourStatus("Inactive");
        setSteps([{ title: "", description: "" }]);
        setErrors({});
        setOpen(false);
    };

    const validStepsCount = steps.filter(
        (step) => step.title.trim() && step.description.trim()
    ).length;

    const progressPercentage = (validStepsCount / 5) * 100;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="text-black font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tour
                </Button>
            </DialogTrigger>
            <DialogContent
                onEscapeKeyDown={handleCancel}
                onInteractOutside={(e) => {
                    const hasData =
                        tourName.trim() ||
                        tourDescription.trim() ||
                        steps.some(
                            (s) => s.title.trim() || s.description.trim()
                        );

                    if (hasData) {
                        e.preventDefault();
                        const confirm = window.confirm(
                            "Are you sure you want to cancel? All unsaved changes will be lost."
                        );
                        if (confirm) {
                            handleCancel();
                        }
                    }
                }}
                className="bg-sidebar border-[#1e2943] text-white max-w-[95vw] sm:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto"
            >
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl sm:text-2xl">
                        Create New Tour
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm sm:text-base">
                        Add a new onboarding tour with at least 5 steps
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
                    {/* Tour Name */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="tour-name"
                            className="text-white text-sm sm:text-base"
                        >
                            Tour Name *
                        </Label>
                        <Input
                            id="tour-name"
                            placeholder="e.g., Welcome Tour"
                            value={tourName}
                            onChange={(e) => {
                                setTourName(e.target.value);
                                if (errors.tourName) {
                                    setErrors({
                                        ...errors,
                                        tourName: undefined,
                                    });
                                }
                            }}
                            className={`bg-[#1e2943] border-primary! text-white placeholder:text-gray-500 ${
                                errors.tourName ? "border-red-500" : ""
                            }`}
                        />
                        {errors.tourName && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.tourName}
                            </p>
                        )}
                    </div>

                    {/* Tour Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="tour-description"
                            className="text-white text-sm sm:text-base"
                        >
                            Description *
                        </Label>
                        <Textarea
                            id="tour-description"
                            placeholder="Describe what this tour will help users learn..."
                            value={tourDescription}
                            onChange={(e) => {
                                setTourDescription(e.target.value);
                                if (errors.tourDescription) {
                                    setErrors({
                                        ...errors,
                                        tourDescription: undefined,
                                    });
                                }
                            }}
                            className={`bg-[#1e2943] border-primary! text-white placeholder:text-gray-500 min-h-20 ${
                                errors.tourDescription ? "border-red-500" : ""
                            }`}
                        />
                        {errors.tourDescription && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.tourDescription}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="tour-status"
                            className="text-white text-sm sm:text-base"
                        >
                            Status
                        </Label>
                        <Select
                            value={tourStatus}
                            onValueChange={(value: "Active" | "Inactive") =>
                                setTourStatus(value)
                            }
                        >
                            <SelectTrigger className="bg-[#1e2943] border-primary! text-white">
                                <SelectValue className="bg-sidebar! text-white" />
                            </SelectTrigger>
                            <SelectContent className="bg-sidebar! border-[#2a3654] text-white">
                                <SelectItem
                                    value="Active"
                                    className="bg-sidebar! hover:text-white/50!"
                                >
                                    Active
                                </SelectItem>
                                <SelectItem
                                    value="Inactive"
                                    className="bg-sidebar! hover:text-white/50!"
                                >
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Steps Section */}
                    <div className="space-y-4">
                        <div className="flex  flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <Label className="text-white text-base sm:text-lg">
                                Tour Steps *
                            </Label>
                            <div className="flex items-center gap-2 ">
                                <div className="text-xs sm:text-sm text-gray-400">
                                    {validStepsCount} / 5 steps completed
                                </div>
                                <div className="w-20 sm:w-24 h-2 bg-[#1e2943] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            validStepsCount >= 5
                                                ? "bg-green-500"
                                                : "bg-cyan-500"
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                progressPercentage,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {errors.steps && (
                            <Alert className="bg-red-500/10 border-red-500/20">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                                <AlertDescription className="text-red-400 text-xs sm:text-sm">
                                    {errors.steps}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-3">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800/50! rounded-lg p-3 sm:p-4 space-y-3"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-black font-semibold shrink-0 mt-1 text-sm sm:text-base">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-3 min-w-0">
                                            <Input
                                                placeholder="Step title"
                                                value={step.title}
                                                onChange={(e) =>
                                                    updateStep(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-[#0a0e1a] border-[#2a3654] text-white placeholder:text-gray-500 text-sm sm:text-base"
                                            />
                                            <Textarea
                                                placeholder="Step description"
                                                value={step.description}
                                                onChange={(e) =>
                                                    updateStep(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-[#0a0e1a] border-[#2a3654] text-white placeholder:text-gray-500 min-h-[60px] text-sm sm:text-base"
                                            />
                                        </div>
                                        {steps.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeStep(index)
                                                }
                                                className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={addStep}
                            className="w-full bg-bg-cyan-500/40 text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Step
                        </Button>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2! sm:gap-0">
                    <Button
                        type="button"
                        variant="cancel"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating..." : "Create Tour"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
