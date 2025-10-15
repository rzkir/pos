"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface FormModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    formData: { name: string };
    onFormDataChange: (data: { name: string }) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLoading: boolean;
}

export default function FormModal({
    isOpen,
    onOpenChange,
    mode,
    formData,
    onFormDataChange,
    onSubmit,
    submitLoading
}: FormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Create New Category' : 'Edit Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Add a new product category to organize your products.'
                            : 'Update the category information.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => onFormDataChange({ name: e.target.value })}
                                placeholder="Enter category name"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitLoading}>
                            {submitLoading ? (
                                <>
                                    <Spinner className="h-4 w-4 mr-2" />
                                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                mode === 'create' ? 'Create Category' : 'Update Category'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
