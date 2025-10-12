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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowLeft, RefreshCw, Hash, X } from "lucide-react";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";

import Image from "next/image";

import Link from "next/link";

import { formatIdr } from "@/base/helper/formatIdr";

export default function CreateProducts() {
    const router = useRouter();

    const [categories, setCategories] = useState<ProductCategories[]>([]);

    const [sizes, setSizes] = useState<ProductSizes[]>([]);

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [locations, setLocations] = useState<Location[]>([]);

    const [submitting, setSubmitting] = useState(false);

    const [barcodeMode, setBarcodeMode] = useState<'auto' | 'manual'>('auto');

    const [skuMode, setSkuMode] = useState<'auto' | 'manual'>('auto');

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [uploadingImage, setUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        modal: "",
        stock: "",
        unit: "pcs",
        image_url: "",
        category_id: "",
        size_id: "",
        barcode: "",
        is_active: true,
        // Tambahan penting
        sku: "",
        min_stock: "",
        discount: "",
        description: "",
        supplier_id: "",
        location_id: "",
        expiration_date: "",
        tax: "",
    });

    const formatNumericInput = (value: string) => value.replace(/\D/g, "");

    const normalizeBarcode = (raw: string) => {
        const digits = raw.replace(/\D/g, "");
        if (digits.length >= 13) return digits.slice(-13);
        if (digits.length === 12 || digits.length === 8) return digits;
        return digits;
    };

    // Fetch related data
    const fetchData = async () => {
        try {
            const [categoriesRes, sizesRes, suppliersRes, locationsRes] = await Promise.all([
                fetch("/api/products/categories"),
                fetch("/api/products/sizes"),
                fetch("/api/products/suppliers"),
                fetch("/api/locations"),
            ]);

            const [categoriesData, sizesData, suppliersData, locationsData] = await Promise.all([
                categoriesRes.json(),
                sizesRes.json(),
                suppliersRes.json(),
                locationsRes.json(),
            ]);

            if (categoriesRes.ok) {
                setCategories(categoriesData.categories);
            }

            if (sizesRes.ok) {
                setSizes(sizesData.sizes);
            }

            if (suppliersRes.ok) {
                setSuppliers(suppliersData.suppliers || []);
            }

            if (locationsRes.ok) {
                setLocations(locationsData.locations || []);
            }
        } catch {
            toast.error("Failed to fetch data");
        }
    };

    // Generate barcode automatically
    const generateBarcode = useCallback(() => {
        // Generate numeric-only barcode (13 digits)
        const timestamp = Date.now().toString();
        const lastTen = timestamp.slice(-10);
        const randomThree = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const barcode = `${lastTen}${randomThree}`; // 13 digits
        setFormData(prev => ({ ...prev, barcode }));
    }, []);

    // Generate SKU automatically
    const generateSKU = useCallback(() => {
        // Generate SKU with format: SKU + timestamp + random
        const timestamp = Date.now().toString();
        const lastSix = timestamp.slice(-6);
        const randomTwo = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const sku = `SKU${lastSix}${randomTwo}`; // SKU + 8 characters
        setFormData(prev => ({ ...prev, sku }));
    }, []);


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

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            modal: "",
            stock: "",
            unit: "pcs",
            image_url: "",
            category_id: "",
            size_id: "",
            barcode: "",
            is_active: true,
            // Tambahan penting
            sku: "",
            min_stock: "",
            discount: "",
            description: "",
            supplier_id: "",
            location_id: "",
            expiration_date: "",
            tax: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        if (barcodeMode === 'auto') {
            generateBarcode();
        }
        if (skuMode === 'auto') {
            generateSKU();
        }
        toast.success("Form telah direset");
    };

    useEffect(() => {
        fetchData();

    }, []);

    useEffect(() => {
        // Generate initial barcode if auto mode
        if (barcodeMode === 'auto') {
            generateBarcode();
        }
    }, [barcodeMode, generateBarcode]);

    useEffect(() => {
        // Generate initial SKU if auto mode
        if (skuMode === 'auto') {
            generateSKU();
        }
    }, [skuMode, generateSKU]);

    // Create product
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

            // Generate SKU automatically if empty
            if (!finalFormData.sku || finalFormData.sku.trim() === '') {
                const timestamp = Date.now().toString();
                const lastSix = timestamp.slice(-6);
                const randomTwo = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                finalFormData.sku = `SKU${lastSix}${randomTwo}`;
            }

            // Coerce numeric fields to numbers before sending
            finalFormData.price = String(finalFormData.price || "");
            finalFormData.modal = String(finalFormData.modal || "");
            finalFormData.stock = String(finalFormData.stock || "");

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

            // Add timeout to avoid hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            let data: { error?: string; message?: string } | null = null;
            // Get current user for uid
            const supabase = createClient();
            const { data: auth } = await supabase.auth.getUser();
            const uid = auth.user?.id;

            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...finalFormData,
                    // ensure numeric values are numbers server-side
                    price: parseFloat(finalFormData.price as unknown as string),
                    stock: parseInt(finalFormData.stock as unknown as string, 10),
                    modal: parseFloat(finalFormData.modal as unknown as string),
                    // handle no_supplier case
                    supplier_id: finalFormData.supplier_id === "no_supplier" ? "" : finalFormData.supplier_id,
                    // handle location_id conversion to number
                    location_id: finalFormData.location_id ? parseInt(finalFormData.location_id, 10) : null,
                    uid,
                }),
                signal: controller.signal,
            }).catch(() => {
                // Network-level failure or aborted
                throw new Error("Request failed");
            }).finally(() => clearTimeout(timeoutId));

            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (response.ok) {
                toast.success("Product created successfully");
                router.push("/dashboard/admins/products/products");
            } else {
                const message = (data && (data.error || data.message)) || "Failed to create product";
                toast.error(message);
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                toast.error("Request timed out. Please try again.");
            } else {
                toast.error("Failed to create product");
            }
        } finally {
            setSubmitting(false);
        }
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
                                <BreadcrumbPage>Create Product</BreadcrumbPage>
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
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter product name"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="barcode">Barcode</Label>
                                        <div className="flex gap-1">
                                            <Select
                                                value={barcodeMode}
                                                onValueChange={(value: 'auto' | 'manual') => {
                                                    setBarcodeMode(value);
                                                    if (value === 'auto') {
                                                        generateBarcode();
                                                    } else {
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
                                                    const normalizedCode = normalizeBarcode(e.target.value);
                                                    setFormData({ ...formData, barcode: normalizedCode });
                                                }}
                                                placeholder={barcodeMode === 'auto' ? "Auto generated" : "Ketik barcode angka"}
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
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="grid gap-3">
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.price === "" ? "" : formatIdr(Number(formData.price))}
                                            onChange={(e) => {
                                                const digitsOnly = formatNumericInput(e.target.value);
                                                setFormData({ ...formData, price: digitsOnly });
                                            }}
                                            placeholder="Rp0"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="modal">Modal *</Label>
                                        <Input
                                            id="modal"
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.modal === "" ? "" : formatIdr(Number(formData.modal))}
                                            onChange={(e) => {
                                                const digitsOnly = formatNumericInput(e.target.value);
                                                setFormData({ ...formData, modal: digitsOnly });
                                            }}
                                            placeholder="Rp0"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-3">
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
                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={formData.category_id}
                                            onValueChange={(value) => {
                                                if (value === "__no_category__") {
                                                    toast.info("Harap tambahkan category terlebih dahulu");
                                                    setFormData({ ...formData, category_id: "" });
                                                    return;
                                                }
                                                setFormData({ ...formData, category_id: value });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={categories.length === 0 ? "Belum ada category" : "Select category"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.length === 0 ? (
                                                    <SelectItem value="__no_category__">
                                                        Tidak ada category - klik untuk info
                                                    </SelectItem>
                                                ) : (
                                                    categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {categories.length === 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Tidak ada data category. <Link href="/dashboard/admins/products/categories" className="underline underline-offset-4">Tambah category</Link>
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="size">Size</Label>
                                        <Select
                                            value={formData.size_id}
                                            onValueChange={(value) => {
                                                if (value === "__no_size__") {
                                                    toast.info("Harap tambahkan size terlebih dahulu");
                                                    setFormData({ ...formData, size_id: "" });
                                                    return;
                                                }
                                                setFormData({ ...formData, size_id: value });
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={sizes.length === 0 ? "Belum ada size" : "Select size"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sizes.length === 0 ? (
                                                    <SelectItem value="__no_size__">
                                                        Tidak ada size - klik untuk info
                                                    </SelectItem>
                                                ) : (
                                                    sizes.map((size) => (
                                                        <SelectItem key={size.id} value={size.id.toString()}>
                                                            {size.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-3 w-full">
                                        <Label htmlFor="unit">Unit *</Label>
                                        <Select
                                            value={formData.unit}
                                            onValueChange={(value) => setFormData({ ...formData, unit: value })}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pcs">Pcs</SelectItem>
                                                <SelectItem value="kg">Kg</SelectItem>
                                                <SelectItem value="liter">Liter</SelectItem>
                                                <SelectItem value="pack">Pack</SelectItem>
                                                <SelectItem value="botol">Botol</SelectItem>
                                                <SelectItem value="bungkus">Bungkus</SelectItem>
                                                <SelectItem value="box">Box</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Tambahan penting - Additional Fields */}
                                <div className="space-y-4">
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-medium mb-4">Additional Information</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="grid gap-3">
                                                <Label htmlFor="sku">SKU (Internal Code)</Label>
                                                <div className="flex gap-1">
                                                    <Select
                                                        value={skuMode}
                                                        onValueChange={(value: 'auto' | 'manual') => {
                                                            setSkuMode(value);
                                                            if (value === 'auto') {
                                                                generateSKU();
                                                            } else {
                                                                setFormData({ ...formData, sku: "" });
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
                                                        id="sku"
                                                        value={formData.sku}
                                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                                        placeholder={skuMode === 'auto' ? "Auto generated" : "Enter SKU code"}
                                                        disabled={skuMode === 'auto'}
                                                        className="flex-1"
                                                    />
                                                    {skuMode === 'auto' && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={generateSKU}
                                                            title="Generate new SKU"
                                                        >
                                                            <RefreshCw className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="min_stock">Minimum Stock</Label>
                                                <Input
                                                    id="min_stock"
                                                    type="number"
                                                    min="0"
                                                    value={formData.min_stock}
                                                    onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="discount">Discount (%)</Label>
                                                <Input
                                                    id="discount"
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={formData.discount}
                                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="tax">Tax Amount</Label>
                                                <Input
                                                    id="tax"
                                                    type="number"
                                                    min="0"
                                                    value={formData.tax}
                                                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="supplier">Supplier</Label>
                                                <Select
                                                    value={formData.supplier_id}
                                                    onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={suppliers.length === 0 ? "No suppliers" : "Select supplier"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="no_supplier">No supplier</SelectItem>
                                                        {suppliers.map((supplier) => (
                                                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                                {supplier.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="location_id">Cabang/Lokasi</Label>
                                                <Select
                                                    value={formData.location_id}
                                                    onValueChange={(value) => {
                                                        if (value === "no_location") {
                                                            toast.info("Harap tambahkan lokasi terlebih dahulu");
                                                            setFormData({ ...formData, location_id: "" });
                                                            return;
                                                        }
                                                        setFormData({ ...formData, location_id: value });
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder={locations.length === 0 ? "Belum ada lokasi" : "Pilih cabang/lokasi"} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {locations.length === 0 ? (
                                                            <SelectItem value="no_location">
                                                                Tidak ada lokasi - klik untuk info
                                                            </SelectItem>
                                                        ) : (
                                                            locations.map((location) => (
                                                                <SelectItem key={location.id} value={location.id.toString()}>
                                                                    {location.name} {location.code && `(${location.code})`}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {locations.length === 0 && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Tidak ada data lokasi. <Link href="/dashboard/admins/locations" className="underline underline-offset-4">Tambah lokasi</Link>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid gap-3">
                                                <Label htmlFor="expiration_date">Expiration Date</Label>
                                                <Input
                                                    id="expiration_date"
                                                    type="date"
                                                    value={formData.expiration_date}
                                                    onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-3 mt-4">
                                            <Label htmlFor="description">Description</Label>
                                            <textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Enter product description"
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="image">Product Image</Label>
                                    <div className="space-y-4">
                                        {/* Image Upload Input */}
                                        <div className="flex items-center gap-1">
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

                                        {/* Image Preview */}
                                        {imagePreview && (
                                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
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
                                            Select an image file (JPG, PNG, GIF). Max size: 5MB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={resetForm}
                                    >
                                        Reset Form
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.back()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={submitting || uploadingImage}>
                                            {submitting ? "Creating..." : uploadingImage ? "Uploading..." : "Create Product"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        }
                    </CardContent>
                </Card>
            </div>
        </SidebarInset>
    );
}
