"use client";
import { Tour, Step } from "@/types/tour"; // Import from the correct location
import {
    Card,
    CardTitle,
    CardHeader,
    CardDescription,
    CardContent,
} from "../ui/card";
import { Button } from "../ui/SidebarBtn";
import { GripVertical } from "lucide-react";
import {
    AddStepDialog,
    EditStepDialog,
    DeleteStepDialog,
} from "@/components/dashboard/StepDialogs";
import { addStepToTour, updateStep, deleteStep } from "@/lib/supabase";
import { toast } from "sonner";

interface TourDetailsProps {
    selectedTour: Tour;
    onUpdateTour: (updatedTour: Tour) => void;
}

const TourDetails = ({ selectedTour, onUpdateTour }: TourDetailsProps) => {
    // Get user_id from the tour (since it's already loaded)
    const userId = selectedTour.user_id;

    const handleAddStep = async (
        newStep: Omit<
            Step,
            | "id"
            | "tour_id"
            | "step_number"
            | "completion_rate"
            | "created_at"
            | "updated_at"
        >
    ) => {
        const { data, error } = await addStepToTour(selectedTour.id, userId, {
            title: newStep.title,
            description: newStep.description,
            target_element: newStep.target_element || undefined,
        });

        if (error) {
            toast.error("Failed to add step", {
                description: error,
            });
            return;
        }

        if (data) {
            // Update the local tour with the new step
            const updatedSteps = [...(selectedTour.tour_steps || []), data];
            const updatedTour: Tour = {
                ...selectedTour,
                tour_steps: updatedSteps,
                total_steps: updatedSteps.length,
            };

            onUpdateTour(updatedTour);
            toast.success("Step added successfully!");
        }
    };

    const handleEditStep = async (
        stepId: number,
        updatedStepData: Partial<
            Omit<
                Step,
                | "id"
                | "tour_id"
                | "step_number"
                | "completion_rate"
                | "created_at"
                | "updated_at"
            >
        >
    ) => {
        const { data, error } = await updateStep(
            stepId,
            selectedTour.id,
            userId,
            {
                title: updatedStepData.title,
                description: updatedStepData.description,
                target_element: updatedStepData.target_element,
            }
        );

        console.log(data);

        if (error) {
            toast.error("Failed to update step", {
                description: error,
            });
            return;
        }

        if (data) {
            // Update the local tour with the edited step
            const updatedSteps = (selectedTour.tour_steps || []).map((step) =>
                step.id === stepId ? data : step
            );

            const updatedTour: Tour = {
                ...selectedTour,
                tour_steps: updatedSteps,
            };

            onUpdateTour(updatedTour);
            toast.success("Step updated successfully!");
        }
    };

    const handleDeleteStep = async (stepId: number) => {
        const { success, error } = await deleteStep(
            stepId,
            selectedTour.id,
            userId
        );

        if (error) {
            toast.error("Failed to delete step", {
                description: error,
            });
            return;
        }

        if (success) {
            // Update the local tour by removing the deleted step
            const updatedSteps = (selectedTour.tour_steps || []).filter(
                (step) => step.id !== stepId
            );

            const updatedTour: Tour = {
                ...selectedTour,
                tour_steps: updatedSteps,
                total_steps: updatedSteps.length,
            };

            onUpdateTour(updatedTour);
            toast.success("Step deleted successfully!");
        }
    };

    // Get steps array safely
    const steps = (selectedTour.tour_steps || []).sort(
        (a, b) => a.step_number - b.step_number
    );

    return (
        <Card className="bg-[#151b2e] border-[#1e2943]">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-white text-xl mb-1">
                            {selectedTour.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {selectedTour.description}
                        </CardDescription>
                    </div>
                    <AddStepDialog onAddStep={handleAddStep} />
                </div>
            </CardHeader>
            <CardContent>
                {steps.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>No steps added yet</p>
                        <p className="text-sm mt-2">
                            Click &quot;Add Step&quot; to create your first step
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {steps.map((step, index) => (
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
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500 text-black font-semibold shrink-0 mt-0.5">
                                        {step.step_number}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium mb-1">
                                            {step.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            {step.description}
                                        </p>
                                        {step.target_element && (
                                            <p className="text-cyan-400 text-xs mt-1 font-mono">
                                                {step.target_element}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditStepDialog
                                            step={step}
                                            stepNumber={step.step_number}
                                            onEditStep={handleEditStep}
                                        />
                                        <DeleteStepDialog
                                            stepTitle={step.title}
                                            stepNumber={step.step_number}
                                            totalSteps={steps.length}
                                            onDeleteStep={() =>
                                                handleDeleteStep(step.id)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TourDetails;
