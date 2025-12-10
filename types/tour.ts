// export interface Tour {
//     id: number;
//     name: string;
//     description: string;
//     steps: number;
//     status: "Active" | "Inactive";
//     stepDetails: stepDetail[];
// }

// export type stepDetail = {
//     id: number;
//     title: string;
//     description: string;
// };

export interface Step {
    id: number;
    tour_id: number;
    step_order: number;
    title: string;
    description: string;
    // target_element: string | null;
    completion_rate: number;
    created_at: string;
    updated_at: string;
}

export interface Tour {
    id: number;
    user_id: string;
    title: string;
    description: string;
    total_steps: number;
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
    tour_steps?: Step[]; // Optional: included when we fetch with steps
}

export interface CreateTourInput {
    title: string;
    description: string;
    status?: "active" | "inactive";
    steps?: Array<{
        title: string;
        description: string;
    }>;
}

export interface UpdateTourInput {
    title?: string;
    description?: string;
    status?: "active" | "inactive";
}

export interface CreateStepInput {
    title: string;
    description: string;
}

export interface UpdateStepInput {
    title?: string;
    description?: string;
    step_number?: number;
}

// export interface Tour {
//     id: string | number;
//     user_id: string;
//     status: "Active" | "Inactive";
//     title: string;
//     description: string;
//     total_steps: number;
//     created_at: string;
//     updated_at: string;
// }

// export type stepDetail = {
//     id: number;
//     title: string;
//     description: string;
// };
