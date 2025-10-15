import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

import { formatIdr } from '@/base/helper/formatIdr'

export interface ViewModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: ProductWithRelations | null
}

const ViewModal: React.FC<ViewModalProps> = ({ open, onOpenChange, product }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Detail Produk</DialogTitle>
                    <DialogDescription>
                        Informasi lengkap produk.
                    </DialogDescription>
                </DialogHeader>

                {!product ? (
                    <div className="py-8 text-center text-muted-foreground">No product selected</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1 flex items-start justify-center">
                            {product.image_url ? (
                                <Image
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-32 h-32 rounded object-cover border"
                                    width={256}
                                    height={256}
                                />
                            ) : (
                                <div className="w-32 h-32 rounded border flex items-center justify-center text-sm text-muted-foreground">
                                    No Image
                                </div>
                            )}
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Nama</div>
                                <div className="font-medium">{product.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Harga</div>
                                    <div className="font-medium">{formatIdr(product.price)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Modal</div>
                                    <div className="font-medium">{formatIdr(product.modal)}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Stok</div>
                                    <div className="font-medium">{product.stock}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Terjual</div>
                                    <div className="font-medium">{product.sold}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Unit</div>
                                    <Badge variant="outline">{product.unit || 'pcs'}</Badge>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-sm text-muted-foreground">Kategori</div>
                                    <div className="font-medium">{product.product_categories?.name || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Size</div>
                                    <div className="font-medium">{product.product_sizes?.name || '-'}</div>
                                </div>
                            </div>
                            {product.description && (
                                <div>
                                    <div className="text-sm text-muted-foreground">Deskripsi</div>
                                    <div className="text-sm whitespace-pre-wrap">{product.description}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ViewModal
