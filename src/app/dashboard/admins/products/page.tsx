import React from 'react'

import { Metadata } from 'next'

import Products from '@/components/dashboard/admins/products/products/Products'

export const metadata: Metadata = {
    title: 'Produk | POS System',
    description: 'Kelola produk untuk sistem Point of Sale',
}

export default function page() {
    return (
        <Products />
    )
}