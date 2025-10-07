"use client"
import React, { useState } from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export default function SignInPage() {
    const { signIn, loadingLogin } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email || !password) return
        await signIn(email, password)
    }
    return (
        <main className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 bg-background">
            {/* Left visual/marketing column */}
            <section className="relative hidden lg:flex items-center justify-center p-10">
                <div className="absolute inset-0 rounded-[28px] bg-secondary/50" />
                <div className="relative z-10 max-w-xl w-full space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-card">
                        <Image
                            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop"
                            alt="Travel hero"
                            width={1200}
                            height={900}
                            className="h-[320px] w-full object-cover"
                            priority
                        />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">Secure Your Next Adventure</h1>
                        <p className="text-muted-foreground">
                            Discover the vibrant culture, stunning beaches, and lush landscapes of Bali,
                            the perfect getaway for relaxation and exploration.
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

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium" htmlFor="email">Email / Phone</label>
                            <Input id="email" type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        <Button className="w-full h-10 rounded-md" type="submit" disabled={loadingLogin}>{loadingLogin ? 'LOGGING IN...' : 'LOG IN'}</Button>
                    </form>

                    <div className='flex justify-between items-center mt-4'>
                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account Traveling?{' '}
                            <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                        </p>

                        <div className="flex items-center justify-between">
                            <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
