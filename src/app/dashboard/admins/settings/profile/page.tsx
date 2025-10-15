import React from 'react'

import { Metadata } from 'next'

import ProfileLayout from '@/components/dashboard/admins/settings/profile/ProfileLayout'

export const metadata: Metadata = {
    title: 'Profile | POS System',
    description: 'Kelola profile untuk sistem Point of Sale',
}

export default function page() {
    return (
        <ProfileLayout />
    )
}
