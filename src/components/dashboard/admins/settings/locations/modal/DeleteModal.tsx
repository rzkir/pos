"use client";

import React from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    branchToDelete: Branch | null;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteModal({
    isOpen,
    onOpenChange,
    branchToDelete,
    onConfirm,
    isDeleting
}: DeleteModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Konfirmasi Hapus Cabang
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus cabang <strong>&ldquo;{branchToDelete?.name}&rdquo;</strong>?
                        Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait cabang ini.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Menghapus...
                            </>
                        ) : (
                            "Hapus"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
