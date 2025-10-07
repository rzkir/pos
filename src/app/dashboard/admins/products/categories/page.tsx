import React from 'react'

import { Metadata } from 'next'

import Categories from '@/components/dashboard/admins/products/categories/Categories'

export const metadata: Metadata = {
    title: 'Kategori Produk | POS System',
    description: 'Kelola kategori produk untuk sistem Point of Sale',
}

export default function page() {
    return (
        <Categories />
    )
}
