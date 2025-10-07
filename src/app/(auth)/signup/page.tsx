"use client"
import React, { useState } from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { Input } from '@/components/ui/input'

import { PasswordInput } from '@/components/ui/password-input'

import { Button } from '@/components/ui/button'

import { useAuth } from '@/context/AuthContext'

export default function SignUpPage() {
    const { signUp, loadingLogin } = useAuth()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email || !password || !fullName || !confirmPassword) return
        if (password !== confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        await signUp({ fullName, email, password })
    }
    return (
        <main className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-background">
            {/* Left visual/marketing column (reused) */}
            <section className="relative hidden lg:flex items-center justify-center p-10">
                <div className="absolute inset-0 rounded-[28px] bg-secondary/50" />
                <div className="relative z-10 max-w-xl w-full space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-card">
                        <Image
                            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1800&auto=format&fit=crop"
                            alt="Travel hero"
                            width={1200}
                            height={900}
                            className="h-[320px] w-full object-cover"
                            priority
                        />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
                        <p className="text-muted-foreground">
                            Join and access exclusive travel deals, manage bookings, and plan trips with ease.
                        </p>
                    </div>
                </div>
            </section>

            {/* Right form column */}
            <section className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="relative size-10 overflow-hidden rounded-full">
                            <Image src="/next.svg" alt="Logo" fill className="object-contain p-1" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Traveling</p>
                            <p className="text-lg font-semibold">Welcome to <span className="text-primary">Traveling</span></p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                            <Input id="name" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="password">Password</label>
                            <PasswordInput
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                showPassword={showPassword}
                                onToggleVisibility={() => setShowPassword(!showPassword)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm Password</label>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                showPassword={showConfirmPassword}
                                onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>
                        <Button className="w-full h-10 rounded-md" type="submit" disabled={loadingLogin}>{loadingLogin ? 'CREATING...' : 'CREATE ACCOUNT'}</Button>
                    </form>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-primary hover:underline">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    )
}