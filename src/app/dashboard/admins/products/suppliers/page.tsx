import React from 'react'

import { Metadata } from 'next'

import Suppliers from '@/components/dashboard/admins/products/suppliers/Suppliers'

export const metadata: Metadata = {
    title: 'Supplier Produk | POS System',
    description: 'Kelola supplier produk untuk sistem Point of Sale',
}

export default function page() {
    return (
        <Suppliers />
    )
}
