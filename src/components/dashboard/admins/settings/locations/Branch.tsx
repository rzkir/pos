"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import { Plus, Edit, Trash2, MapPin, Phone, Mail, User } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Location {
    id: number;
    name: string;
    code?: string;
    address?: string;
    phone?: string;
    email?: string;
    manager_name?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        manager_name: "",
    });

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/locations");
            const data = await response.json();

            if (response.ok) {
                setLocations(data.locations || []);
            } else {
                toast.error(data.error || "Failed to fetch locations");
            }
        } catch (error) {
            toast.error("Failed to fetch locations");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingLocation ? "/api/locations" : "/api/locations";
            const method = editingLocation ? "PUT" : "POST";

            const body = editingLocation
                ? { id: editingLocation.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(editingLocation ? "Location updated successfully" : "Location created successfully");
                setIsDialogOpen(false);
                resetForm();
                fetchLocations();
            } else {
                toast.error(data.error || "Failed to save location");
            }
        } catch (error) {
            toast.error("Failed to save location");
        }
    };

    const handleEdit = (location: Location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            code: location.code || "",
            address: location.address || "",
            phone: location.phone || "",
            email: location.email || "",
            manager_name: location.manager_name || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this location?")) {
            return;
        }

        try {
            const response = await fetch(`/api/locations?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Location deleted successfully");
                fetchLocations();
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to delete location");
            }
        } catch (error) {
            toast.error("Failed to delete location");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            address: "",
            phone: "",
            email: "",
            manager_name: "",
        });
        setEditingLocation(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Cabang/Lokasi</h1>
                    <p className="text-muted-foreground">Kelola cabang dan lokasi toko</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Lokasi
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingLocation ? "Edit Lokasi" : "Tambah Lokasi Baru"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingLocation
                                    ? "Ubah informasi lokasi cabang"
                                    : "Tambahkan lokasi cabang baru ke sistem"
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Cabang *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Contoh: Cabang Pusat"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Kode Cabang</Label>
                                    <Input
                                        id="code"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="Contoh: CAB001"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Alamat lengkap cabang"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Telepon</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Nomor telepon cabang"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Email cabang"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="manager_name">Nama Manager</Label>
                                    <Input
                                        id="manager_name"
                                        value={formData.manager_name}
                                        onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                                        placeholder="Nama manager cabang"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingLocation ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                    <Card key={location.id} className="relative">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">{location.name}</CardTitle>
                                    {location.code && (
                                        <Badge variant="secondary" className="mt-1">
                                            {location.code}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(location)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(location.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {location.address && (
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>{location.address}</span>
                                </div>
                            )}
                            {location.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>{location.phone}</span>
                                </div>
                            )}
                            {location.email && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>{location.email}</span>
                                </div>
                            )}
                            {location.manager_name && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{location.manager_name}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {locations.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Belum ada lokasi</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Mulai dengan menambahkan cabang atau lokasi pertama Anda
                        </p>
                        <Button onClick={openCreateDialog}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Lokasi Pertama
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
