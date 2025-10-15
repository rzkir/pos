"use client";

import React, { useState, useEffect } from "react";

import { formatDateTimeIndonesian } from "@/base/helper/formatDate";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Plus, Edit } from "lucide-react";

import { toast } from "sonner";

import DeleteModal from "./modal/DeleteModal";
import FormModal from "./modal/FormModal";

export default function Categories() {
    const [categories, setCategories] = useState<ProductCategories[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [editingCategory, setEditingCategory] = useState<ProductCategories | null>(null);
    const [formData, setFormData] = useState({ name: "" });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/products/categories");
            const data = await response.json();

            if (response.ok) {
                setCategories(data.categories);
            } else {
                toast.error(data.error || "Failed to fetch categories");
            }
        } catch {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form submission for both create and edit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            if (dialogMode === 'create') {
                const response = await fetch("/api/products/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success("Category created successfully");
                    setFormData({ name: "" });
                    setIsDialogOpen(false);
                    fetchCategories();
                } else {
                    toast.error(data.error || "Failed to create category");
                }
            } else {
                if (!editingCategory) return;

                const response = await fetch(`/api/products/categories/${editingCategory.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    toast.success("Category updated successfully");
                    setFormData({ name: "" });
                    setEditingCategory(null);
                    setIsDialogOpen(false);
                    fetchCategories();
                } else {
                    toast.error(data.error || "Failed to update category");
                }
            }
        } catch {
            toast.error(dialogMode === 'create' ? "Failed to create category" : "Failed to update category");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete category
    const handleDelete = async (id: number) => {
        setDeleteLoading(id);
        try {
            const response = await fetch(`/api/products/categories/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Category deleted successfully");
                fetchCategories();
            } else {
                toast.error(data.error || "Failed to delete category");
            }
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setDeleteLoading(null);
        }
    };

    // Open create dialog
    const openCreateDialog = () => {
        setDialogMode('create');
        setEditingCategory(null);
        setFormData({ name: "" });
        setIsDialogOpen(true);
    };

    // Open edit dialog
    const openEditDialog = (category: ProductCategories) => {
        setDialogMode('edit');
        setEditingCategory(category);
        setFormData({ name: category.name });
        setIsDialogOpen(true);
    };

    return (
        <section className="px-2 md:px-3 py-2">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-md border gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">Products Category</h1>
                        <p className="text-sm text-muted-foreground">Kelola products category anda</p>
                    </div>

                    <Button
                        onClick={openCreateDialog}
                        disabled={submitLoading || deleteLoading !== null}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
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
                                        Loading categories...
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        No categories found. Create your first category!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.id}</TableCell>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>
                                            {category.created_at
                                                ? formatDateTimeIndonesian(category.created_at)
                                                : "-"
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(category)}
                                                    disabled={submitLoading || deleteLoading !== null}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <DeleteModal
                                                    category={category}
                                                    onDelete={handleDelete}
                                                    deleteLoading={deleteLoading}
                                                    disabled={submitLoading || deleteLoading !== null}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Form Modal */}
                <FormModal
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    mode={dialogMode}
                    formData={formData}
                    onFormDataChange={setFormData}
                    onSubmit={handleSubmit}
                    submitLoading={submitLoading}
                />
            </div>
        </section>
    );
}
