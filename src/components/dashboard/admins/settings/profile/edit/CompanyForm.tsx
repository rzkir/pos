"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

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
    founded_at?: string | null
    created_at?: string
    updated_at?: string
    owner?: OwnerInfo | null
}

export default function CompanyForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<CompanyProfile | null>(null)

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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return
        setSaving(true)
        try {
            const res = await fetch('/api/company-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: profile.company_name,
                    logo_url: profile.logo_url || null,
                    npwp: profile.npwp || null,
                    address: profile.address || null,
                    phone: profile.phone || null,
                    email: profile.email || null,
                    website: profile.website || null,
                    business_type: profile.business_type || null,
                    owner_name: profile.owner_name || null,
                    owner_uid: profile.owner_uid || null,
                    founded_at: profile.founded_at || null,
                }),
            })
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}))
                toast.error(payload?.error || 'Gagal menyimpan profil perusahaan')
                return
            }
            toast.success('Profil perusahaan berhasil disimpan')
            router.push('/dashboard/admins/settings/profile')
        } catch {
            toast.error('Terjadi kesalahan saat menyimpan')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <section className='px-2 md:px-3 py-2'>
                <div className="space-y-4">
                    <h1 className='text-xl font-semibold'>Edit Company Profile</h1>
                    <p className='text-sm text-muted-foreground'>Memuat data...</p>
                </div>
            </section>
        )
    }

    const value = profile || initial

    return (
        <section className='px-2 md:px-3 py-2'>
            <div className="space-y-4 max-w-3xl">
                <h1 className='text-xl font-semibold'>Edit Company Profile</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Form Perusahaan</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className='pt-6'>
                        <form onSubmit={onSubmit} className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>Nama Perusahaan</Label>
                                    <Input value={value.company_name}
                                        onChange={e => setProfile({ ...(value), company_name: e.target.value })}
                                        required />
                                </div>
                                <div className='space-y-2'>
                                    <Label>NPWP</Label>
                                    <Input value={value.npwp || ''}
                                        onChange={e => setProfile({ ...(value), npwp: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Telepon</Label>
                                    <Input value={value.phone || ''}
                                        onChange={e => setProfile({ ...(value), phone: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Email</Label>
                                    <Input type='email' value={value.email || ''}
                                        onChange={e => setProfile({ ...(value), email: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Website</Label>
                                    <Input value={value.website || ''}
                                        onChange={e => setProfile({ ...(value), website: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Jenis Usaha</Label>
                                    <Input value={value.business_type || ''}
                                        onChange={e => setProfile({ ...(value), business_type: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Nama Pemilik</Label>
                                    <Input value={value.owner_name || ''}
                                        onChange={e => setProfile({ ...(value), owner_name: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Tahun Berdiri</Label>
                                    <Input type='date' value={value.founded_at || ''}
                                        onChange={e => setProfile({ ...(value), founded_at: e.target.value })} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label>Alamat Kantor Pusat</Label>
                                <Textarea rows={4} value={value.address || ''}
                                    onChange={e => setProfile({ ...(value), address: e.target.value })} />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label>URL Logo</Label>
                                    <Input value={value.logo_url || ''}
                                        onChange={e => setProfile({ ...(value), logo_url: e.target.value })} />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Owner (UID Akun)</Label>
                                    <Input placeholder='uid pengguna (opsional)'
                                        value={value.owner_uid || ''}
                                        onChange={e => setProfile({ ...(value), owner_uid: e.target.value })} />
                                    {value.owner ? (
                                        <p className='text-xs text-muted-foreground'>
                                            Owner: {value.owner.display_name} ({value.owner.email}) — {value.owner.role}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className='pt-2'>
                                <Button type='submit' disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                {' '}
                                <Button type='button' variant='secondary' onClick={() => router.push('/dashboard/admins/settings/profile')} disabled={saving}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
