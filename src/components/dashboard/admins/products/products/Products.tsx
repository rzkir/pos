"use client";

import React, { useState, useEffect } from "react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

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

import { Plus, Edit, Trash2, Package } from "lucide-react";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import Image from "next/image"

import { formatIdr } from "@/base/helper/formatIdr";

export default function Products() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch products
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



    // Delete product
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
        router.push(`/dashboard/admins/products/products/${newId}`);
    };

    const navigateToEdit = (productId: number) => {
        router.push(`/dashboard/admins/products/products/edit/${productId}`);
    };

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/dashboard/admins/products">
                                    Products
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Product List</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        <h1 className="text-2xl font-semibold">Products</h1>
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
                                    <TableCell colSpan={10} className="text-center py-8">
                                        Loading products...
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8">
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
        </SidebarInset>
    );
}