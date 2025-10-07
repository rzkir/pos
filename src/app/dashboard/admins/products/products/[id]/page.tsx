import React from 'react'

import { Metadata } from 'next'

import CreateProducts from '@/components/dashboard/admins/products/products/create/CreateProducts'

export const metadata: Metadata = {
    title: 'Create Products | POS System',
    description: 'Create Products untuk sistem Point of Sale',
}

export default function page() {
    return (
        <CreateProducts />
    )
}
