import React from 'react'

import { Metadata } from 'next'

import Size from '@/components/dashboard/admins/products/size/Size'

export const metadata: Metadata = {
    title: 'Ukuran Produk | POS System',
    description: 'Kelola ukuran produk untuk sistem Point of Sale',
}

export default function page() {
    return (
        <Size />
    )
}
