import React from 'react';
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

interface ModalFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingLocation: Branch | null;
    formData: {
        name: string;
        code: string;
        address: string;
        phone: string;
        email: string;
        manager_name: string;
    };
    setFormData: (data: {
        name: string;
        code: string;
        address: string;
        phone: string;
        email: string;
        manager_name: string;
    }) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting?: boolean;
}

export default function ModalForm({
    isOpen,
    onOpenChange,
    editingLocation,
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false
}: ModalFormProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {editingLocation ? "Edit Cabang" : "Tambah Cabang Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingLocation
                            ? "Ubah informasi cabang"
                            : "Tambahkan cabang baru ke sistem"
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Nama Cabang/Branch *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Branch Central"
                                required
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="code">Kode Cabang/Branch Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="Contoh: BRN001"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="address">Alamat</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Alamat lengkap"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="phone">Telepon</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Nomor telepon"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="manager_name">Nama Manager</Label>
                            <Input
                                id="manager_name"
                                value={formData.manager_name}
                                onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                                placeholder="Nama manager"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {editingLocation ? "Updating..." : "Creating..."}
                                </>
                            ) : (
                                editingLocation ? "Update" : "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
