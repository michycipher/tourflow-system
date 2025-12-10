export interface Tour {
    id: number;
    name: string;
    description: string;
    steps: number;
    status: "Active" | "Inactive";
    stepDetails: stepDetail[];
}

export type stepDetail = {
    id: number;
    title: string;
    description: string;
};
