"use client"
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPasswordPage() {
    const { resetPassword, loadingLogin } = useAuth()
    const [email, setEmail] = useState("")

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email) return
        await resetPassword(email)
    }

    return (
        <main className="min-h-[100dvh] flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-md space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold">Forgot your password?</h1>
                    <p className="text-sm text-muted-foreground">Enter your email and we will send you a reset link.</p>
                </div>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button className="w-full h-10 rounded-md" type="submit" disabled={loadingLogin}>{loadingLogin ? 'SENDING...' : 'SEND RESET LINK'}</Button>
                </form>
                <p className="text-center text-sm text-muted-foreground">
                    Remembered it? <Link className="text-primary hover:underline" href="/signin">Back to sign in</Link>
                </p>
            </div>
        </main>
    )
}


