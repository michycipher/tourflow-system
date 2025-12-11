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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/SidebarBtn";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Edit, Power } from "lucide-react";
import { Tour } from "@/types/tour";
import { deleteTour, updateTourStatus, updateTour } from "@/lib/supabase";

const TourCard = ({
    tour,
    selectedTour,
    setSelectedTour,
    onTourUpdated,
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
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [editTitle, setEditTitle] = useState(tour.title);
    const [editDescription, setEditDescription] = useState(tour.description);
    const [editErrors, setEditErrors] = useState({ title: "", description: "" });

    const handleTourClick = (tour: Tour) => {
        setSelectedTour(tour);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const { error } = await deleteTour(tour.id, userId);

            if (error) {
                console.error("Error deleting tour:", error);
                alert("Failed to delete tour. Please try again.");
            } else {
                if (selectedTour?.id === tour.id) {
                    setSelectedTour(null);
                }
                onTourUpdated();
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
                onTourUpdated();
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsUpdatingStatus(false);
            setStatusDialogOpen(false);
        }
    };

    const handleEdit = () => {
        // Reset form with current tour data
        setEditTitle(tour.title);
        setEditDescription(tour.description);
        setEditErrors({ title: "", description: "" });
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        // Validate
        const errors = { title: "", description: "" };
        let hasError = false;

        if (!editTitle.trim()) {
            errors.title = "Tour title is required";
            hasError = true;
        }

        if (!editDescription.trim()) {
            errors.description = "Tour description is required";
            hasError = true;
        }

        if (hasError) {
            setEditErrors(errors);
            return;
        }

        setIsEditing(true);
        try {
            const { error } = await updateTour(tour.id, userId, {
                title: editTitle.trim(),
                description: editDescription.trim(),
            });

            if (error) {
                console.error("Error updating tour:", error);
                alert("Failed to update tour. Please try again.");
            } else {
                // Update selected tour if this was the selected one
                if (selectedTour?.id === tour.id) {
                    setSelectedTour({
                        ...tour,
                        title: editTitle.trim(),
                        description: editDescription.trim(),
                    });
                }
                onTourUpdated();
                setEditDialogOpen(false);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsEditing(false);
        }
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

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="bg-sidebar border-[#2a3654] sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-white">Edit Tour</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Update the title and description of your tour.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title" className="text-white">
                                Tour Title *
                            </Label>
                            <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => {
                                    setEditTitle(e.target.value);
                                    if (editErrors.title) {
                                        setEditErrors({ ...editErrors, title: "" });
                                    }
                                }}
                                placeholder="Enter tour title"
                                className="bg-sidebar-accent border-gray-600 text-white placeholder:text-gray-500"
                                disabled={isEditing}
                            />
                            {editErrors.title && (
                                <p className="text-sm text-red-400">{editErrors.title}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-white">
                                Description *
                            </Label>
                            <Textarea
                                id="edit-description"
                                value={editDescription}
                                onChange={(e) => {
                                    setEditDescription(e.target.value);
                                    if (editErrors.description) {
                                        setEditErrors({ ...editErrors, description: "" });
                                    }
                                }}
                                placeholder="Enter tour description"
                                rows={4}
                                className="bg-sidebar-accent border-gray-600 text-white placeholder:text-gray-500 resize-none"
                                disabled={isEditing}
                            />
                            {editErrors.description && (
                                <p className="text-sm text-red-400">{editErrors.description}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={isEditing}
                            className="text-white hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={isEditing}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isEditing ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="bg-sidebar border-[#2a3654]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                            Delete Tour
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete &quot;{tour.title}&quot;? This action
                            cannot be undone. All steps and analytics data will be permanently
                            removed.
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
                                : `Activating "${tour.title}" will make it visible to visitors on your website.`}
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
                                : "Activate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TourCard;
