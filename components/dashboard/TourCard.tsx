// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Button } from "../ui/SidebarBtn";
// import { Badge } from "@/components/ui/badge";
// import { MoreVertical } from "lucide-react";
// import { Tour } from "@/types/tour";

// const TourCard = ({
//     tour,
//     selectedTour,
//     setSelectedTour,
// }: {
//     tour: Tour;
//     selectedTour: Tour | null;
//     setSelectedTour: (tour: Tour | null) => void;
// }) => {
//     const handleTourClick = (tour: Tour) => {
//         setSelectedTour(tour);
//     };

//     return (
//         <Card
//             key={tour.id}
//             className={`bg-sidebar cursor-pointer! transition-all border border-primary/40 hover:border-primary/90${
//                 selectedTour?.id === tour.id
//                     ? "border-cyan-500 ring-1 ring-cyan-500/20"
//                     : ""
//             }`}
//             onClick={() => handleTourClick(tour)}
//         >
//             <CardHeader className="pb-3">
//                 <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                         <CardTitle className="text-white text-lg mb-1">
//                             {tour.title}
//                         </CardTitle>
//                         <CardDescription className="text-gray-400 text-sm">
//                             {tour.description}
//                         </CardDescription>
//                     </div>
//                     <DropdownMenu>
//                         <DropdownMenuTrigger
//                             asChild
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 className="h-8 w-8 text-gray-400 hover:text-white"
//                             >
//                                 <MoreVertical className="w-4 h-4" />
//                             </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="bg-sidebar/90! border-[#2a3654] text-white">
//                             <DropdownMenuItem className="hover:bg-primary!">
//                                 Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem className="hover:bg-primary!">
//                                 Duplicate
//                             </DropdownMenuItem>
//                             <DropdownMenuItem className="hover:bg-primary! text-red-400">
//                                 Delete
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                 </div>
//             </CardHeader>
//             <CardContent className="pt-0">
//                 <div className="flex items-center gap-2 text-sm">
//                     <span className="text-gray-400">{tour.total_steps} steps</span>
//                     <Badge
//                         variant="outline"
//                         className={`${
//                             tour.status === "active"
//                                 ? "bg-green-500/10 text-green-500 border-green-500/20"
//                                 : "bg-gray-500/10 text-gray-400 border-gray-500/20"
//                         }`}
//                     >
//                         {tour.status}
//                     </Badge>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default TourCard;


// TourCard.tsx
import { useState } from "react";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/SidebarBtn";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Copy, Edit, Power } from "lucide-react";
import { Tour } from "@/types/tour";
import { deleteTour, updateTourStatus } from "@/lib/supabase"; // Your database functions

const TourCard = ({
    tour,
    selectedTour,
    setSelectedTour,
    onTourUpdated, // Callback to refresh tours list
    userId,
}: {
    tour: Tour;
    selectedTour: Tour | null;
    setSelectedTour: (tour: Tour | null) => void;
    onTourUpdated: () => void;
    userId: string;
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const handleTourClick = (tour: Tour) => {
        setSelectedTour(tour);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {

            console.log(userId);
            console.log(tour.id)
            const { error, success } = await deleteTour(tour.id, userId);

            console.log(success);


            if (error) {
                console.error("Error deleting tour:", error);
                alert("Failed to delete tour. Please try again.");
            } else {
                // Clear selection if this tour was selected
                if (selectedTour?.id === tour.id) {
                    setSelectedTour(null);
                }
                onTourUpdated(); // Refresh the tours list
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleStatusToggle = async () => {
        setIsUpdatingStatus(true);
        const newStatus = tour.status === "active" ? "inactive" : "active";

        try {
            const { error } = await updateTourStatus(tour.id, userId, newStatus);

            if (error) {
                console.error("Error updating status:", error);
                alert("Failed to update tour status. Please try again.");
            } else {
                onTourUpdated(); // Refresh the tours list
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsUpdatingStatus(false);
            setStatusDialogOpen(false);
        }
    };

    const handleDuplicate = async () => {
        // TODO: Implement duplicate functionality
        alert("Duplicate functionality coming soon!");
    };

    const handleEdit = () => {
        // TODO: Implement edit functionality
        alert("Edit functionality coming soon!");
    };

    return (
        <>
            <Card
                key={tour.id}
                className={`bg-sidebar cursor-pointer transition-all border border-primary/40 hover:border-primary/90 ${
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
                            <DropdownMenuContent className="bg-sidebar/90 border-[#2a3654] text-white">
                                <DropdownMenuItem
                                    className="hover:bg-primary cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit();
                                    }}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-primary cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setStatusDialogOpen(true);
                                    }}
                                >
                                    <Power className="w-4 h-4 mr-2" />
                                    {tour.status === "active" ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-primary cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicate();
                                    }}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="hover:bg-red-600 text-red-400 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
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


            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-sidebar border-[#2a3654]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Delete Tour
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete &quot;{tour.title}&quot;? This action cannot be
                            undone. All steps and analytics data will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete Tour"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Status Change Dialog */}
            <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogContent className="bg-sidebar border-[#2a3654]">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            {tour.status === "active" ? "Deactivate" : "Activate"} Tour
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {tour.status === "active"
                                ? `Deactivating "${tour.title}" will stop it from appearing on your website. You can reactivate it anytime.`
                                : `Activating "${tour.title}" will make it visible to visitors on your website.`
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setStatusDialogOpen(false)}
                            disabled={isUpdatingStatus}
                            className="text-white hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusToggle}
                            disabled={isUpdatingStatus}
                            className={`${
                                tour.status === "active"
                                    ? "bg-orange-600 hover:bg-orange-700"
                                    : "bg-green-600 hover:bg-green-700"
                            } text-white`}
                        >
                            {isUpdatingStatus
                                ? "Updating..."
                                : tour.status === "active"
                                    ? "Deactivate"
                                    : "Activate"
                            }
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TourCard;
