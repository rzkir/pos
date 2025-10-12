import React from 'react'

import { Metadata } from 'next'

import LocationsPage from '@/components/dashboard/admins/settings/locations/Branch'

export const metadata: Metadata = {
    title: 'Branches | POS System',
    description: 'Kelola Branches Perusahaan untuk sistem Point of Sale',
}

export default function page() {
    return (
        <LocationsPage />
    )
}
