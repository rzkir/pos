"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface DeleteModalProps {
    category: ProductCategories;
    onDelete: (id: number) => void;
    deleteLoading: number | null;
    disabled?: boolean;
}

export default function DeleteModal({
    category,
    onDelete,
    deleteLoading,
    disabled = false
}: DeleteModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={disabled}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;{category.name}&quot;?
                        This action cannot be undone and will fail if the category is being used by any products.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteLoading === category.id}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(category.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={deleteLoading === category.id}
                    >
                        {deleteLoading === category.id ? (
                            <>
                                <Spinner className="h-4 w-4 mr-2" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
