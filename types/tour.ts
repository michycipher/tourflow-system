export interface Tour {
    id: number;
    name: string;
    description: string;
    steps: number;
    status: "Active" | "Inactive";
    stepDetails: stepDetails[];
}

type stepDetails = {
    id: number;
    title: string;
    description: string;
};
