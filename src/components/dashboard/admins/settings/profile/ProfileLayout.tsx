"use client"

import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type OwnerInfo = { uid: string; display_name: string; email: string; role: string }

type CompanyProfile = {
    id?: number
    company_name: string
    logo_url?: string | null
    npwp?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
    website?: string | null
    business_type?: string | null
    owner_name?: string | null
    owner_uid?: string | null
    founded_at?: string | null // ISO date string
    created_at?: string
    updated_at?: string
    owner?: OwnerInfo | null
}

export default function ProfileLayout() {
    const [loading, setLoading] = useState(true)
    // const [saving] = useState(false)
    const [profile, setProfile] = useState<CompanyProfile | null>(null)
    const [editing] = useState(false)

    const initial: CompanyProfile = useMemo(() => ({
        company_name: '',
        logo_url: '',
        npwp: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        business_type: '',
        owner_name: '',
        owner_uid: '',
        founded_at: '',
    }), [])

    useEffect(() => {
        let mounted = true
        const run = async () => {
            try {
                const res = await fetch('/api/company-profile', { cache: 'no-store' })
                const payload = await res.json()
                if (res.ok && payload?.data) {
                    if (mounted) setProfile(payload.data as CompanyProfile)
                } else {
                    if (mounted) setProfile(initial)
                }
            } catch {
                if (mounted) setProfile(initial)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        run()
        return () => { mounted = false }
    }, [initial])

    // No inline submit in read-only view

    if (loading) {
        return (
            <section className='px-2 md:px-3 py-2'>
                <div className="space-y-4">
                    <h1 className='text-xl font-semibold'>Company Profile</h1>
                    <p className='text-sm text-muted-foreground'>Memuat data...</p>
                </div>
            </section>
        )
    }

    const value = profile || initial

    return (
        <section className='px-2 md:px-3 py-2'>
            <div className="space-y-4 max-w-3xl">
                <h1 className='text-xl font-semibold'>Company Profile</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Perusahaan</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className='pt-6'>
                        {(!editing) && (
                            <div className='space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <Field label='Nama Perusahaan' value={value.company_name || '-'} />
                                    <Field label='NPWP' value={value.npwp || '-'} />
                                    <Field label='Telepon' value={value.phone || '-'} />
                                    <Field label='Email' value={value.email || '-'} />
                                    <Field label='Website' value={value.website || '-'} />
                                    <Field label='Jenis Usaha' value={value.business_type || '-'} />
                                    <Field label='Nama Pemilik' value={value.owner_name || '-'} />
                                    <Field label='Tahun Berdiri' value={value.founded_at || '-'} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Alamat Kantor Pusat</Label>
                                    <p className='text-sm whitespace-pre-line'>{value.address || '-'}</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <Field label='URL Logo' value={value.logo_url || '-'} />
                                    <div className='space-y-2'>
                                        <Label>Owner (UID Akun)</Label>
                                        <p className='text-sm'>{value.owner_uid || '-'}</p>
                                        {value.owner ? (
                                            <p className='text-xs text-muted-foreground'>
                                                Owner: {value.owner.display_name} ({value.owner.email}) — {value.owner.role}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='pt-2'>
                                    <Link href={`/dashboard/admins/settings/profile/${value.id ?? 1}`}>
                                        <Button type='button'>Edit</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

function Field(props: { label: string; value: string }) {
    const { label, value } = props
    return (
        <div className='space-y-2'>
            <Label>{label}</Label>
            <p className='text-sm'>{value || '-'}</p>
        </div>
    )
}

