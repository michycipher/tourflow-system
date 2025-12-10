"use client";
import { Tour, stepDetail } from "@/types/tour";
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

interface TourDetailsProps {
    selectedTour: Tour;
    onUpdateTour: (updatedTour: Tour) => void;
}

const TourDetails = ({ selectedTour, onUpdateTour }: TourDetailsProps) => {
    const handleAddStep = (newStep: Omit<stepDetail, "id">) => {
        const newStepWithId: stepDetail = {
            id:
                selectedTour.stepDetails.length > 0
                    ? Math.max(...selectedTour.stepDetails.map((s) => s.id)) + 1
                    : 1,
            ...newStep,
        };

        const updatedTour: Tour = {
            ...selectedTour,
            stepDetails: [...selectedTour.stepDetails, newStepWithId],
            steps: selectedTour.stepDetails.length + 1,
        };

        onUpdateTour(updatedTour);
    };

    const handleEditStep = (
        stepId: number,
        updatedStep: Omit<stepDetail, "id">
    ) => {
        const updatedSteps = selectedTour.stepDetails.map((step) =>
            step.id === stepId ? { ...step, ...updatedStep } : step
        );

        const updatedTour: Tour = {
            ...selectedTour,
            stepDetails: updatedSteps,
        };

        onUpdateTour(updatedTour);
    };

    const handleDeleteStep = (stepId: number) => {
        const updatedSteps = selectedTour.stepDetails.filter(
            (step) => step.id !== stepId
        );

        const updatedTour: Tour = {
            ...selectedTour,
            stepDetails: updatedSteps,
            steps: updatedSteps.length,
        };

        onUpdateTour(updatedTour);
    };

    return (
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
                    <AddStepDialog onAddStep={handleAddStep} />
                </div>
            </CardHeader>
            <CardContent>
                {selectedTour.stepDetails.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>No steps added yet</p>
                        <p className="text-sm mt-2">
                            Click &quot;Add Step&quot; to create your first step
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selectedTour.stepDetails.map((step, index) => (
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
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium mb-1">
                                            {step.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditStepDialog
                                            step={step}
                                            stepNumber={index + 1}
                                            onEditStep={handleEditStep}
                                        />
                                        <DeleteStepDialog
                                            stepTitle={step.title}
                                            stepNumber={index + 1}
                                            totalSteps={
                                                selectedTour.stepDetails.length
                                            }
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
