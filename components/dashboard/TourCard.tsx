import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/SidebarBtn";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { Tour } from "@/types/tour";

const TourCard = ({
    tour,
    selectedTour,
    setSelectedTour,
}: {
    tour: Tour;
    selectedTour: Tour | null;
    setSelectedTour: (tour: Tour | null) => void;
}) => {
    const handleTourClick = (tour: Tour) => {
        setSelectedTour(tour);
    };

    return (
        <Card
            key={tour.id}
            className={`bg-sidebar cursor-pointer! transition-all border border-primary/40 hover:border-primary/90${
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
                            {tour.title}
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
                    <span className="text-gray-400">{tour.total_steps} steps</span>
                    <Badge
                        variant="outline"
                        className={`${
                            tour.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                    >
                        {tour.status}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

export default TourCard;
