import React from 'react'

import { Metadata } from 'next'

import CompanyForm from '@/components/dashboard/admins/settings/profile/edit/CompanyForm'

export const metadata: Metadata = {
    title: 'Company Form | POS System',
    description: 'Create Company Form untuk sistem Point of Sale',
}

export default function page() {
    return (
        <CompanyForm />
    )
}