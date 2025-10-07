import React from 'react'

import { Metadata } from 'next'

import EditProducts from '@/components/dashboard/admins/products/products/edit/EditProducts'

export const metadata: Metadata = {
    title: 'Edit Products | POS System',
    description: 'Edit Products untuk sistem Point of Sale',
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function page({ params }: PageProps) {
    const { id } = await params
    return (
        <EditProducts id={id} />
    )
}
