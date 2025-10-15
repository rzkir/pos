"use client";

import React, { useState, useEffect } from "react";

import { formatDateTimeIndonesian } from "@/base/helper/formatDate";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

import { Plus, Edit, Trash2, Package } from "lucide-react";

import { toast } from "sonner";

export default function Sizes() {
    const [sizes, setSizes] = useState<ProductSizes[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingSizes, setEditingSizes] = useState<ProductSizes | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    // Fetch sizes
    const fetchSizes = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products/sizes");
            const data = await response.json();

            if (response.ok) {
                setSizes(data.sizes);
            } else {
                toast.error(data.error || "Failed to fetch sizes");
            }
        } catch {
            toast.error("Failed to fetch sizes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    // Create sizes
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/products/sizes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Sizes created successfully");
                setFormData({ name: "" });
                setIsCreateDialogOpen(false);
                fetchSizes();
            } else {
                toast.error(data.error || "Failed to create Sizes");
            }
        } catch {
            toast.error("Failed to create Sizes");
        }
    };

    // Update sizes
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSizes) return;

        try {
            const response = await fetch(`/api/products/sizes/${editingSizes.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Sizes updated successfully");
                setFormData({ name: "" });
                setEditingSizes(null);
                setIsEditDialogOpen(false);
                fetchSizes();
            } else {
                toast.error(data.error || "Failed to update Sizes");
            }
        } catch {
            toast.error("Failed to update Sizes");
        }
    };

    // Delete sizes
    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/products/sizes/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Sizes deleted successfully");
                fetchSizes();
            } else {
                toast.error(data.error || "Failed to delete Sizes");
            }
        } catch {
            toast.error("Failed to delete Sizes");
        }
    };

    // Open edit dialog
    const openEditDialog = (sizes: ProductSizes) => {
        setEditingSizes(sizes);
        setFormData({ name: sizes.name });
        setIsEditDialogOpen(true);
    };

    return (
        <section className="container">
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        <h1 className="text-2xl font-semibold">Product Sizes</h1>
                    </div>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Sizes
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Sizes</DialogTitle>
                                <DialogDescription>
                                    Add a new product sizes to organize your products.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Sizes Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ name: e.target.value })}
                                            placeholder="Enter Sizes name"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Sizes</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Loading sizes...
                                    </TableCell>
                                </TableRow>
                            ) : sizes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        No sizes found. Create your first sizes!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sizes.map((sizes) => (
                                    <TableRow key={sizes.id}>
                                        <TableCell className="font-medium">{sizes.id}</TableCell>
                                        <TableCell>{sizes.name}</TableCell>
                                        <TableCell>
                                            {sizes.created_at
                                                ? formatDateTimeIndonesian(sizes.created_at)
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(sizes)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Sizes</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete &quot;{sizes.name}&quot;?
                                                                This action cannot be undone and will fail if the sizes is being used by any products.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(sizes.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                Update the category information.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Category Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Category</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
