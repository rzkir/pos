"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Save, RefreshCw, Hash, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";

interface EditProductsProps {
    id: string;
}

export default function EditProducts({ id }: EditProductsProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<ProductCategories[]>([]);
    const [sizes, setSizes] = useState<ProductSizes[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [barcodeMode, setBarcodeMode] = useState<'auto' | 'manual'>('manual');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        modal: "",
        stock: "",
        image_url: "",
        category_id: "",

        size_id: "",
        barcode: "",
        is_active: true,
    });

    // Fetch product data and related data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [productRes, categoriesRes, sizesRes] = await Promise.all([
                fetch(`/api/products/${id}`),
                fetch("/api/products/categories"),
                fetch("/api/products/sizes"),
            ]);

            const [productData, categoriesData, sizesData] = await Promise.all([
                productRes.json(),
                categoriesRes.json(),
                sizesRes.json(),
            ]);

            if (productRes.ok) {
                const product = productData.product;
                setFormData({
                    name: product.name,
                    price: product.price.toString(),
                    modal: product.modal.toString(),
                    stock: product.stock.toString(),
                    image_url: product.image_url || "",
                    category_id: product.category_id?.toString() || "",

                    size_id: product.size_id?.toString() || "",
                    barcode: product.barcode || "",
                    is_active: product.is_active,
                });
                // Set barcode mode based on existing barcode
                setBarcodeMode(product.barcode ? 'manual' : 'auto');
            } else {
                toast.error(productData.error || "Failed to fetch product");
                router.push("/dashboard/admins/products");
            }

            if (categoriesRes.ok) {
                setCategories(categoriesData.categories);
            }



            if (sizesRes.ok) {
                setSizes(sizesData.sizes);
            }
        } catch {
            toast.error("Failed to fetch data");
            router.push("/dashboard/admins/products");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchData();
    }, [id, fetchData]);

    // Generate barcode automatically
    const generateBarcode = () => {
        // Generate numeric-only barcode (13 digits)
        const timestamp = Date.now().toString();
        const lastTen = timestamp.slice(-10);
        const randomThree = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const barcode = `${lastTen}${randomThree}`;
        setFormData({ ...formData, barcode });
    };

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to Supabase Storage
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploadingImage(true);
            const supabase = createClient();

            // Generate unique filename
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            const fileExt = file.name.split('.').pop();
            const fileName = `product_${timestamp}_${random}.${fileExt}`;

            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Failed to upload image");
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    // Update product
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Generate barcode automatically if empty
            const finalFormData = { ...formData };
            if (!finalFormData.barcode || finalFormData.barcode.trim() === '') {
                const timestamp = Date.now().toString();
                const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
                finalFormData.barcode = `BC${timestamp.slice(-8)}${random}`;
            }

            // Upload image if selected
            if (selectedImage) {
                const imageUrl = await uploadImage(selectedImage);
                if (imageUrl) {
                    finalFormData.image_url = imageUrl;
                } else {
                    toast.error("Failed to upload image");
                    return;
                }
            }

            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Product updated successfully");
                router.push("/dashboard/admins/products");
            } else {
                toast.error(data.error || "Failed to update product");
            }
        } catch {
            toast.error("Failed to update product");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
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
                                    <BreadcrumbPage>Edit Product</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                            <p>Loading product data...</p>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        );
    }

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
                                <BreadcrumbPage>Edit Product</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            <h1 className="text-2xl font-semibold">Edit Product</h1>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>
                            Update the product details. Product ID: {id}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Product Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="barcode">Barcode</Label>
                                    <div className="flex gap-2">
                                        <Select
                                            value={barcodeMode}
                                            onValueChange={(value: 'auto' | 'manual') => {
                                                setBarcodeMode(value);
                                                if (value === 'auto') {
                                                    generateBarcode();
                                                } else if (!formData.barcode) {
                                                    setFormData({ ...formData, barcode: "" });
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="auto">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4" />
                                                        Auto
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="manual">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-4 w-4" />
                                                        Manual
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            id="barcode"
                                            value={formData.barcode}
                                            onChange={(e) => {
                                                const digitsOnly = e.target.value.replace(/\D/g, "");
                                                setFormData({ ...formData, barcode: digitsOnly });
                                            }}
                                            placeholder={barcodeMode === 'auto' ? "Auto generated" : "Enter numeric barcode (auto-generated if empty)"}
                                            disabled={barcodeMode === 'auto'}
                                            className="flex-1"
                                        />

                                        {barcodeMode === 'auto' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={generateBarcode}
                                                title="Generate new barcode"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {barcodeMode === 'manual'
                                            ? "Leave empty to auto-generate barcode"
                                            : "Barcode will be generated automatically"
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="modal">Modal *</Label>
                                    <Input
                                        id="modal"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.modal}
                                        onChange={(e) => setFormData({ ...formData, modal: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="stock">Stock *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="size">Size</Label>
                                    <Select
                                        value={formData.size_id}
                                        onValueChange={(value) => setFormData({ ...formData, size_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem key={size.id} value={size.id.toString()}>
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Product Image</Label>
                                <div className="space-y-4">
                                    {/* Current Image Display */}
                                    {formData.image_url && !imagePreview && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Current image:</p>
                                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                                                <Image
                                                    src={formData.image_url}
                                                    alt="Current product"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Upload Input */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="cursor-pointer"
                                                disabled={uploadingImage}
                                            />
                                        </div>
                                        {selectedImage && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={removeImage}
                                                disabled={uploadingImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* New Image Preview */}
                                    {imagePreview && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">New image preview:</p>
                                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Status */}
                                    {uploadingImage && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                            Uploading image...
                                        </div>
                                    )}

                                    {/* Help Text */}
                                    <p className="text-xs text-muted-foreground">
                                        Select a new image file (JPG, PNG, GIF). Max size: 5MB. Leave empty to keep current image.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting || uploadingImage}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {submitting ? "Updating..." : uploadingImage ? "Uploading..." : "Update Product"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}
