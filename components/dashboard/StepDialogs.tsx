"use client";
import React, { useState } from "react";
import { Plus, Trash2, Pencil, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/SidebarBtn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Step } from "@/types/tour";
import { toast } from "sonner";

// ============================================
// ADD STEP DIALOG
// ============================================
export interface AddStepDialogProps {
    onAddStep: (
        step: Omit<
            Step,
            | "id"
            | "tour_id"
            | "step_number"
            | "completion_rate"
            | "created_at"
            | "updated_at"
        >
    ) => void;
}

export function AddStepDialog({ onAddStep }: AddStepDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) {
            newErrors.title = "Step title is required";
        }

        if (!description.trim()) {
            newErrors.description = "Step description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        onAddStep({
            title: title.trim(),
            description: description.trim(),
        });

        toast.success("Step added successfully!");

        // Reset form
        setTitle("");
        setDescription("");
        setErrors({});
        setOpen(false);
    };

    const handleCancel = () => {
        const hasData = title.trim() || description.trim();

        if (hasData) {
            const confirm = window.confirm(
                "Are you sure you want to cancel? All unsaved changes will be lost."
            );
            if (!confirm) return;
        }

        setTitle("");
        setDescription("");
        setErrors({});
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                </Button>
            </DialogTrigger>
            <DialogContent
                className="bg-sidebar border-[#1e2943] text-white max-w-[95vw] sm:max-w-lg"
                onEscapeKeyDown={(e) => {
                    const hasData = title.trim() || description.trim();
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
            >
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                        Add New Step
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Add a new step to your tour
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Step Title */}
                    <div className="space-y-2">
                        <Label htmlFor="step-title" className="text-white">
                            Step Title *
                        </Label>
                        <Input
                            id="step-title"
                            placeholder="e.g., Welcome to Dashboard"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) {
                                    setErrors({ ...errors, title: undefined });
                                }
                            }}
                            className={`bg-[#1e2943] border-[#2a3654] text-white placeholder:text-gray-500 ${
                                errors.title ? "border-red-500" : ""
                            }`}
                        />
                        {errors.title && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Step Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="step-description"
                            className="text-white"
                        >
                            Step Description *
                        </Label>
                        <Textarea
                            id="step-description"
                            placeholder="Describe what users should do in this step..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) {
                                    setErrors({
                                        ...errors,
                                        description: undefined,
                                    });
                                }
                            }}
                            className={`bg-[#1e2943] border-[#2a3654] text-white placeholder:text-gray-500 min-h-[100px] ${
                                errors.description ? "border-red-500" : ""
                            }`}
                        />
                        {errors.description && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2! sm:gap-0">
                    <Button
                        type="button"
                        variant="cancel"
                        onClick={handleCancel}
                        className="border-[#2a3654] text-gray-400 hover:bg-[#1e2943] hover:text-white w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium w-full sm:w-auto"
                    >
                        Add Step
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ============================================
// EDIT STEP DIALOG
// ============================================
interface EditStepDialogProps {
    step: Step;
    stepNumber: number;
    onEditStep: (stepId: number, updatedStep: Omit<Step, "id">) => void;
}

export function EditStepDialog({
    step,
    stepNumber,
    onEditStep,
}: EditStepDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(step.title);
    const [description, setDescription] = useState(step.description);
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});

    // Update local state when step prop changes
    React.useEffect(() => {
        setTitle(step.title);
        setDescription(step.description);
    }, [step]);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!title.trim()) {
            newErrors.title = "Step title is required";
        }

        if (!description.trim()) {
            newErrors.description = "Step description is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        onEditStep(step.id, {
            ...step, // ← Spread first (gets all existing properties)
            title: title.trim(), // ← Then override with new values
            description: description.trim(),
        });

        toast.success("Step updated successfully!");
        setOpen(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setTitle(step.title);
        setDescription(step.description);
        setErrors({});
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400  cursor-pointer"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent
                className="bg-sidebar border-primary/60 text-white max-w-[95vw] sm:max-w-lg"
                onEscapeKeyDown={(e) => {
                    e.preventDefault();
                    handleCancel();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                        Edit Step {stepNumber}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Update the step details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Step Title */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-step-title" className="text-white">
                            Step Title *
                        </Label>
                        <Input
                            id="edit-step-title"
                            placeholder="e.g., Welcome to Dashboard"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) {
                                    setErrors({ ...errors, title: undefined });
                                }
                            }}
                            className={`bg-[#1e2943] border-[#2a3654] text-white placeholder:text-gray-500 ${
                                errors.title ? "border-red-500" : ""
                            }`}
                        />
                        {errors.title && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Step Description */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="edit-step-description"
                            className="text-white"
                        >
                            Step Description *
                        </Label>
                        <Textarea
                            id="edit-step-description"
                            placeholder="Describe what users should do in this step..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) {
                                    setErrors({
                                        ...errors,
                                        description: undefined,
                                    });
                                }
                            }}
                            className={`bg-[#1e2943] border-[#2a3654] text-white placeholder:text-gray-500 min-h-[100px] ${
                                errors.description ? "border-red-500" : ""
                            }`}
                        />
                        {errors.description && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                {errors.description}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-4! bg-sidebar! sm:gap-0">
                    <Button
                        type="button"
                        variant="cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium w-full sm:w-auto"
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ============================================
// DELETE STEP DIALOG
// ============================================
interface DeleteStepDialogProps {
    stepTitle: string;
    stepNumber: number;
    totalSteps: number;
    onDeleteStep: () => void;
}

export function DeleteStepDialog({
    stepTitle,
    stepNumber,
    totalSteps,
    onDeleteStep,
}: DeleteStepDialogProps) {
    const canDelete = totalSteps > 5;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!canDelete}
                    title={
                        !canDelete
                            ? "Cannot delete - minimum 5 steps required"
                            : "Delete step"
                    }
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#151b2e] border-[#1e2943] text-white max-w-[95vw] sm:max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                        Delete Step {stepNumber}?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete &quot;{stepTitle}
                        &quot;? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <AlertDialogCancel className="border-[#2a3654] bg-transparent text-gray-400 hover:bg-[#1e2943] hover:text-white w-full sm:w-auto mt-0">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            onDeleteStep();
                            toast.success("Step deleted successfully!");
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                    >
                        Delete Step
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
