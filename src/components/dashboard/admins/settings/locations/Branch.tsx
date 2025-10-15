"use client";

import React, { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";

import { Plus, Edit, Trash2, MapPin, Phone, Mail, User, Search, Grid3X3, Table, Filter, X } from "lucide-react";

import ModalForm from "./modal/ModalForm";

import DeleteModal from "./modal/DeleteModal";

export default function LocationsPage() {
    const [branch, setBranch] = useState<Branch[]>([]);
    const [filteredBranch, setFilteredBranch] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Branch | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        manager_name: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Branch; direction: 'asc' | 'desc' } | null>(null);
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
            const response = await fetch("/api/branch");
            const data = await response.json();

            if (response.ok) {
                setBranch(data.branch || []);
                setFilteredBranch(data.branch || []);
            } else {
                toast.error(data.error || "Failed to fetch branch");
            }
        } catch {
            toast.error("Failed to fetch branch");
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort logic
    const applyFilters = useCallback(() => {
        let filtered = [...branch];

        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.phone && item.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.manager_name && item.manager_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply column filters
        Object.entries(columnFilters).forEach(([key, value]) => {
            if (value) {
                filtered = filtered.filter(item => {
                    const itemValue = item[key as keyof Branch];
                    return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
                });
            }
        });

        // Apply sorting
        if (sortConfig) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredBranch(filtered);
    }, [searchTerm, columnFilters, sortConfig, branch]);

    const handleSort = (key: keyof Branch) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setColumnFilters({
            name: '',
            code: '',
            address: '',
            phone: '',
            email: '',
            manager_name: ''
        });
        setSortConfig(null);
    };

    const updateColumnFilter = (key: keyof typeof columnFilters, value: string) => {
        setColumnFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingLocation ? "/api/branch" : "/api/branch";
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
                toast.success(editingLocation ? "Branch updated successfully" : "Branch created successfully");
                setIsDialogOpen(false);
                resetForm();
                fetchLocations();
            } else {
                toast.error(data.error || "Failed to save branch");
            }
        } catch {
            toast.error("Failed to save branch");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (location: Branch) => {
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

    const handleDeleteClick = (branch: Branch) => {
        setBranchToDelete(branch);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!branchToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/branch?id=${branchToDelete.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Branch deleted successfully");
                fetchLocations();
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to delete branch");
            }
        } catch {
            toast.error("Failed to delete branch");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
            setBranchToDelete(null);
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

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <section className="px-2 md:px-3 py-2">
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-md border gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">Cabang</h1>
                        <p className="text-sm text-muted-foreground">Kelola cabang dan lokasi toko</p>
                    </div>
                    <Button onClick={openCreateDialog} className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Cabang
                    </Button>
                </div>

                {/* Search and Filter Controls */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Cari cabang..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                            <div className="flex border rounded-md w-full sm:w-auto">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none flex-1 sm:flex-none"
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('table')}
                                    className="rounded-l-none flex-1 sm:flex-none"
                                >
                                    <Table className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Column Filters */}
                    {showFilters && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Filter Kolom</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={clearFilters}>
                                            <X className="h-4 w-4 mr-1" />
                                            Clear All
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="filter-name">Nama Cabang</Label>
                                        <Input
                                            id="filter-name"
                                            value={columnFilters.name}
                                            onChange={(e) => updateColumnFilter('name', e.target.value)}
                                            placeholder="Filter nama..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="filter-code">Kode Cabang</Label>
                                        <Input
                                            id="filter-code"
                                            value={columnFilters.code}
                                            onChange={(e) => updateColumnFilter('code', e.target.value)}
                                            placeholder="Filter kode..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="filter-address">Alamat</Label>
                                        <Input
                                            id="filter-address"
                                            value={columnFilters.address}
                                            onChange={(e) => updateColumnFilter('address', e.target.value)}
                                            placeholder="Filter alamat..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="filter-phone">Telepon</Label>
                                        <Input
                                            id="filter-phone"
                                            value={columnFilters.phone}
                                            onChange={(e) => updateColumnFilter('phone', e.target.value)}
                                            placeholder="Filter telepon..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="filter-email">Email</Label>
                                        <Input
                                            id="filter-email"
                                            value={columnFilters.email}
                                            onChange={(e) => updateColumnFilter('email', e.target.value)}
                                            placeholder="Filter email..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="filter-manager">Manager</Label>
                                        <Input
                                            id="filter-manager"
                                            value={columnFilters.manager_name}
                                            onChange={(e) => updateColumnFilter('manager_name', e.target.value)}
                                            placeholder="Filter manager..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Menampilkan {filteredBranch.length} dari {branch.length} cabang
                    </span>
                    {searchTerm || Object.values(columnFilters).some(v => v) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="h-4 w-4 mr-1" />
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Content based on view mode */}
                {viewMode === 'grid' ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredBranch.map((branch) => (
                            <Card key={branch.id} className="relative">
                                <CardHeader>
                                    <div className="flex flex-wrap justify-between">
                                        <CardTitle className="text-base sm:text-lg truncate">{branch.name}</CardTitle>
                                        {branch.code && (
                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                {branch.code}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {branch.address && (
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span className="break-words">{branch.address}</span>
                                        </div>
                                    )}
                                    {branch.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4 flex-shrink-0" />
                                            <span className="break-all">{branch.phone}</span>
                                        </div>
                                    )}
                                    {branch.email && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 flex-shrink-0" />
                                            <span className="break-all">{branch.email}</span>
                                        </div>
                                    )}
                                    {branch.manager_name && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{branch.manager_name}</span>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(branch)}
                                        className="h-8 w-8"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(branch)}
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Table View */
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="border-b">
                                        <tr>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[120px]"
                                                onClick={() => handleSort('name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="hidden sm:inline">Nama Cabang</span>
                                                    <span className="sm:hidden">Nama</span>
                                                    {sortConfig?.key === 'name' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[80px]"
                                                onClick={() => handleSort('code')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Kode
                                                    {sortConfig?.key === 'code' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[150px] hidden sm:table-cell"
                                                onClick={() => handleSort('address')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Alamat
                                                    {sortConfig?.key === 'address' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[100px]"
                                                onClick={() => handleSort('phone')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="hidden sm:inline">Telepon</span>
                                                    <span className="sm:hidden">Telp</span>
                                                    {sortConfig?.key === 'phone' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[120px] hidden md:table-cell"
                                                onClick={() => handleSort('email')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Email
                                                    {sortConfig?.key === 'email' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left p-2 sm:p-4 font-medium cursor-pointer hover:bg-background/50 min-w-[100px] hidden lg:table-cell"
                                                onClick={() => handleSort('manager_name')}
                                            >
                                                <div className="flex items-center gap-2">
                                                    Manager
                                                    {sortConfig?.key === 'manager_name' && (
                                                        <span className="text-xs">
                                                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="text-left p-2 sm:p-4 font-medium min-w-[80px]">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBranch.map((branch) => (
                                            <tr key={branch.id} className="border-b hover:bg-background/50">
                                                <td className="p-2 sm:p-4">
                                                    <div>
                                                        <div className="font-medium text-sm sm:text-base truncate">{branch.name}</div>
                                                        {branch.code && (
                                                            <Badge variant="secondary" className="mt-1 text-xs">
                                                                {branch.code}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-muted-foreground">
                                                    {branch.code || '-'}
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-muted-foreground hidden sm:table-cell">
                                                    <div className="truncate max-w-[150px]" title={branch.address || ''}>
                                                        {branch.address || '-'}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-muted-foreground">
                                                    <div className="truncate max-w-[100px]" title={branch.phone || ''}>
                                                        {branch.phone || '-'}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-muted-foreground hidden md:table-cell">
                                                    <div className="truncate max-w-[120px]" title={branch.email || ''}>
                                                        {branch.email || '-'}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:p-4 text-sm text-muted-foreground hidden lg:table-cell">
                                                    <div className="truncate max-w-[100px]" title={branch.manager_name || ''}>
                                                        {branch.manager_name || '-'}
                                                    </div>
                                                </td>
                                                <td className="p-2 sm:p-4">
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(branch)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(branch)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {filteredBranch.length === 0 && branch.length > 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Search className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Tidak ada cabang yang sesuai dengan filter yang dipilih
                            </p>
                            <Button variant="outline" onClick={clearFilters}>
                                <X className="h-4 w-4 mr-2" />
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {branch.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Belum ada cabang</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Mulai dengan menambahkan cabang atau cabang pertama Anda
                            </p>
                            <Button onClick={openCreateDialog}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Cabang Pertama
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <ModalForm
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingLocation={editingLocation}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />

            <DeleteModal
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                branchToDelete={branchToDelete}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </section>
    );
}
