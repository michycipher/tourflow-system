import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    return { user, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}



import {
    CreateStepInput,
    CreateTourInput,
    UpdateStepInput,
    UpdateTourInput,
} from "@/types/tour";

// CREATE - Add a new tour with steps
export async function createTour(userId: string, tourData: CreateTourInput) {
    try {
        // First, create the tour
        const { data: tour, error: tourError } = await supabase
            .from("tours")
            .insert([
                {
                    user_id: userId,
                    title: tourData.title,
                    description: tourData.description,
                    status: tourData.status || "Inactive",
                    total_steps: tourData.steps?.length || 0,
                },
            ])
            .select()
            .single();

        if (tourError) throw tourError;

        // If steps are provided, create them
        if (tourData.steps && tourData.steps.length > 0) {
            const stepsToInsert = tourData.steps.map((step, index) => ({
                tour_id: tour.id,
                step_order: index + 1,
                title: step.title,
                description: step.description,
                completion_rate: 0,
            }));

            const { error: stepsError } = await supabase
                .from("tour_steps")
                .insert(stepsToInsert);

            if (stepsError) {
                // Rollback: delete the tour if steps creation fails
                await supabase.from("tours").delete().eq("id", tour.id);
                throw stepsError;
            }
        }

        return { data: tour, error: null };
    } catch (error: any) {
        console.error("Error creating tour:", error);
        return { data: null, error: error.message };
    }
}

// READ - Get all tours for a user (without steps)
export async function getUserTours(userId: string) {
    try {
        const { data, error } = await supabase
            .from("tours")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error fetching tours:", error);
        return { data: null, error: error.message };
    }
}

// READ - Get all tours with their steps
export async function getUserToursWithSteps(userId: string) {
    try {
        const { data, error } = await supabase
            .from("tours")
            .select(
                `
        *,
        tour_steps (*)
      `
            )
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error fetching tours with steps:", error);
        return { data: null, error: error.message };
    }
}

// READ - Get a single tour by ID with steps
export async function getTourById(tourId: number, userId: string) {
    try {
        const { data, error } = await supabase
            .from("tours")
            .select(
                `
        *,
        tour_steps (*)
      `
            )
            .eq("id", tourId)
            .eq("user_id", userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error fetching tour:", error);
        return { data: null, error: error.message };
    }
}

// UPDATE - Edit an existing tour (metadata only)
export async function updateTour(
    tourId: number,
    userId: string,
    updates: UpdateTourInput
) {
    try {
        const { data, error } = await supabase
            .from("tours")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", tourId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error updating tour:", error);
        return { data: null, error: error.message };
    }
}

// DELETE - Remove a tour (steps will be deleted via CASCADE if set up)
export async function deleteTour(tourId: number, userId: string) {
    try {
        // Just delete the tour - steps will be deleted automatically via CASCADE
        const { error } = await supabase
            .from("tours")
            .delete()
            .eq("id", tourId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error deleting tour:", error);
            throw error;
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting tour:", error);
        return { success: false, error: error.message };
    }
}

// UPDATE - Update tour status
export async function updateTourStatus(
    tourId: number,
    userId: string,
    status: "active" | "inactive"
) {
    try {
        const { data, error } = await supabase
            .from("tours")
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq("id", tourId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error updating tour status:", error);
        return { data: null, error: error.message };
    }
}

// ============= STEP OPERATIONS =============

// CREATE - Add a step to a tour
export async function addStepToTour(
    tourId: number,
    userId: string,
    stepData: CreateStepInput
) {
    try {
        // Verify tour ownership
        const { data: tour, error: tourError } = await supabase
            .from("tours")
            .select("id, total_steps")
            .eq("id", tourId)
            .eq("user_id", userId)
            .single();

        if (tourError || !tour)
            throw new Error("Tour not found or unauthorized");

        // Get the next step number
        const { data: existingSteps } = await supabase
            .from("tour_steps")
            .select("step_order")
            .eq("tour_id", tourId)
            .order("step_order", { ascending: false })
            .limit(1);

        const nextStepNumber =
            existingSteps && existingSteps.length > 0
                ? existingSteps[0].step_order + 1
                : 1;

        // Create the step
        const { data: step, error: stepError } = await supabase
            .from("tour_steps")
            .insert([
                {
                    tour_id: tourId,
                    step_order: nextStepNumber,
                    title: stepData.title,
                    description: stepData.description,
                    completion_rate: 0,
                },
            ])
            .select()
            .single();

        if (stepError) throw stepError;

        // Update tour's total_steps count
        await supabase
            .from("tours")
            .update({
                total_steps: tour.total_steps + 1,
                updated_at: new Date().toISOString(),
            })
            .eq("id", tourId);

        return { data: step, error: null };
    } catch (error: any) {
        console.error("Error adding step:", error);
        return { data: null, error: error.message };
    }
}

// READ - Get all steps for a tour
export async function getTourSteps(tourId: number) {
    try {
        const { data, error } = await supabase
            .from("tour_steps")
            .select("*")
            .eq("tour_id", tourId)
            .order("step_order", { ascending: true });

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error fetching steps:", error);
        return { data: null, error: error.message };
    }
}

// UPDATE - Update a specific step
export async function updateStep(
    stepId: number,
    tourId: number,
    userId: string,
    updates: UpdateStepInput
) {
    try {
        // Verify tour ownership
        const { error: tourError } = await supabase
            .from("tours")
            .select("id")
            .eq("id", tourId)
            .eq("user_id", userId)
            .single();

        if (tourError) throw new Error("Tour not found or unauthorized");

        const { data, error } = await supabase
            .from("tour_steps")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", stepId)
            .eq("tour_id", tourId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error updating step:", error);
        return { data: null, error: error.message };
    }
}

// DELETE - Remove a step from a tour
export async function deleteStep(
    stepId: number,
    tourId: number,
    userId: string
) {
    try {
        // Verify tour ownership
        const { data: tour, error: tourError } = await supabase
            .from("tours")
            .select("id, total_steps")
            .eq("id", tourId)
            .eq("user_id", userId)
            .single();

        if (tourError || !tour)
            throw new Error("Tour not found or unauthorized");

        // Delete the step
        const { error: deleteError } = await supabase
            .from("tour_steps")
            .delete()
            .eq("id", stepId)
            .eq("tour_id", tourId);

        if (deleteError) throw deleteError;

        // Update tour's total_steps count
        await supabase
            .from("tours")
            .update({
                total_steps: Math.max(0, tour.total_steps - 1),
                updated_at: new Date().toISOString(),
            })
            .eq("id", tourId);

        // Reorder remaining steps
        const { data: remainingSteps } = await getTourSteps(tourId);
        if (remainingSteps) {
            for (let i = 0; i < remainingSteps.length; i++) {
                await supabase
                    .from("tour_steps")
                    .update({ step_order: i + 1 })
                    .eq("id", remainingSteps[i].id);
            }
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error deleting step:", error);
        return { success: false, error: error.message };
    }
}

// UPDATE - Reorder steps
export async function reorderSteps(
    tourId: number,
    userId: string,
    stepIds: number[]
) {
    try {
        // Verify tour ownership
        const { error: tourError } = await supabase
            .from("tours")
            .select("id")
            .eq("id", tourId)
            .eq("user_id", userId)
            .single();

        if (tourError) throw new Error("Tour not found or unauthorized");

        // Update step numbers based on new order
        for (let i = 0; i < stepIds.length; i++) {
            await supabase
                .from("tour_steps")
                .update({
                    step_order: i + 1,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", stepIds[i])
                .eq("tour_id", tourId);
        }

        return { success: true, error: null };
    } catch (error: any) {
        console.error("Error reordering steps:", error);
        return { success: false, error: error.message };
    }
}

// UPDATE - Update step completion rate
export async function updateStepCompletionRate(
    stepId: number,
    completionRate: number
) {
    try {
        const { data, error } = await supabase
            .from("tour_steps")
            .update({
                completion_rate: completionRate,
                updated_at: new Date().toISOString(),
            })
            .eq("id", stepId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error: any) {
        console.error("Error updating completion rate:", error);
        return { data: null, error: error.message };
    }
}
