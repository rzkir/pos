import React from 'react'

import { Metadata } from 'next'

import Type from '@/components/dashboard/admins/products/type/Type'

export const metadata: Metadata = {
    title: 'Tipe Produk | POS System',
    description: 'Kelola tipe produk untuk sistem Point of Sale',
}

export default function page() {
    return (
        <Type />
    )
}
