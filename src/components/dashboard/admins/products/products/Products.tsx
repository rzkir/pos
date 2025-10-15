"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

import { Badge } from "@/components/ui/badge";

import { Plus, Edit, Trash2 } from "lucide-react";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import Image from "next/image"

import { formatIdr } from "@/base/helper/formatIdr";

export default function Products() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const productsRes = await fetch("/api/products");
            const productsData = await productsRes.json();

            if (productsRes.ok) {
                setProducts(productsData.products);
            } else {
                toast.error(productsData.error || "Failed to fetch products");
            }
        } catch {
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Product deleted successfully");
                fetchData();
            } else {
                toast.error(data.error || "Failed to delete product");
            }
        } catch {
            toast.error("Failed to delete product");
        }
    };

    const navigateToCreate = () => {
        const newId = Date.now().toString();
        router.push(`/dashboard/admins/products/${newId}`);
    };

    const navigateToEdit = (productId: number) => {
        router.push(`/dashboard/admins/products/edit/${productId}`);
    };

    return (
        <section className="px-2 md:px-3 py-2">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-md border gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">Produk</h1>
                        <p className="text-sm text-muted-foreground">Kelola produk</p>
                    </div>

                    <Button onClick={navigateToCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Modal</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead>Sold</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-8">
                                        Loading products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-8">
                                        No products found. Create your first product!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {product.image_url && (
                                                    <Image
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-8 h-8 rounded object-cover"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                                <span>{product.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatIdr(product.price)}</TableCell>
                                        <TableCell>{formatIdr(product.modal)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {product.unit || "pcs"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{product.sold}</TableCell>
                                        <TableCell>{product.product_categories?.name || "-"}</TableCell>
                                        <TableCell>{product.product_sizes?.name || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant={product.is_active ? "default" : "secondary"}>
                                                {product.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigateToEdit(product.id)}
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
                                                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete &quot;{product.name}&quot;?
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(product.id)}
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
            </div>
        </section>
    );
}