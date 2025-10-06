"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase";

import { Session, User } from "@supabase/supabase-js";

import type { AuthContextType, Accounts } from "@/types/accounts";

import { toast } from "sonner";

function showSuccess(message: string) {
    toast.success(message);
}

function showError(message: string) {
    toast.error(message);
}

function deriveDisplayNameFromEmail(email: string | null): string {
    if (!email) return 'User';
    const username = email.split('@')[0] || 'user';
    return username
        .split(/[._-]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Accounts | null>(null);

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // UI states
    const [showPassword, setShowPassword] = useState(false);

    const setShowPasswordHandler = (value: boolean | ((prev: boolean) => boolean)) => {
        if (typeof value === 'function') {
            setShowPassword(value);
        } else {
            setShowPassword(value);
        }
    };
    const [loadingLogin, setLoadingLogin] = useState(false);

    // Message states
    const [error, setError] = useState("");

    const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
    if (!supabaseRef.current) {
        supabaseRef.current = createClient();
    }
    const supabase = supabaseRef.current;
    const router = useRouter();

    const ACCOUNTS_TABLE = (process.env.NEXT_PUBLIC_TABLE_ACCOUNTS as string) || 'accounts';

    const getCachedProfile = useCallback((): Accounts | null => null, []);
    const setCachedProfile = useCallback(() => { /* no-op */ }, []);
    const clearCachedProfile = () => { /* no-op */ };

    // Use sessionStorage for short-lived, client-only data
    const getSessionValue = (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try { return window.sessionStorage.getItem(key); } catch { return null; }
    };
    const setSessionValue = (key: string, value: string) => {
        if (typeof window === 'undefined') return;
        try { window.sessionStorage.setItem(key, value); } catch { }
    };
    const deleteSessionValue = (key: string) => {
        if (typeof window === 'undefined') return;
        try { window.sessionStorage.removeItem(key); } catch { }
    };

    const resetState = () => {
        setProfile(null);
    };

    const clearForm = () => {
        setEmail("");
        setPassword("");
        setShowPassword(false);
        setError("");
    };

    const fetchProfile = useCallback(async () => {
        // Skip if already loaded for this user
        if (profile?.uid === user?.id) {
            return;
        }
        if (!user?.id) return;

        // Cache check
        const cached = getCachedProfile();
        if (cached) { setProfile(cached); return; }

        try {
            const { data: profileData, error: profileError } = await supabase
                .from(ACCOUNTS_TABLE)
                .select('*')
                .eq('uid', user?.id)
                .single();

            if (profileError) {
                resetState();
            } else {
                setProfile(profileData);
                setCachedProfile();
            }
        } catch {
            resetState();
        }
    }, [profile, user, supabase, ACCOUNTS_TABLE, getCachedProfile, setCachedProfile]);

    // Ensure an accounts row exists after authentication
    const createProfileIfMissing = useCallback(
        async (params?: { fullName?: string; role?: Accounts['role'] }) => {
            if (!user?.id) return;
            const tableName = (process.env.NEXT_PUBLIC_TABLE_ACCOUNTS as string) || 'accounts';
            const { data: existing } = await supabase
                .from(tableName)
                .select('uid')
                .eq('uid', user.id)
                .maybeSingle();
            if (existing?.uid) return;

            const pendingCookie = getSessionValue('pending_full_name');
            const display_name =
                params?.fullName ||
                pendingCookie ||
                ((user.user_metadata as Record<string, unknown>)?.full_name as string | undefined) ||
                deriveDisplayNameFromEmail(user.email ?? null);
            const insertBody: { uid: string; display_name: string; email: string; role?: Accounts['role'] } = {
                uid: user.id,
                display_name,
                email: user.email || '',
            };
            if (params?.role) insertBody.role = params.role;
            await supabase.from(tableName).insert(insertBody);
        },
        [supabase, user]
    );

    const refreshProfile = async () => {
        if (!user?.id) return;
        clearCachedProfile();
        await fetchProfile();
    };

    const handleLogin = async (email: string, password: string) => {
        setLoadingLogin(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const result = await res.json();

            if (!res.ok) {
                const errorMessage = result.error || "Login failed";
                setError(errorMessage);
                showError(errorMessage || "Login gagal");
            } else {
                showSuccess("Login berhasil");
                // Check user role and redirect accordingly
                const roleRes = await fetch("/api/profile/role", {
                    method: "GET",
                    credentials: "include",
                });

                if (roleRes.ok) {
                    const roleData = await roleRes.json();
                    if (roleData.role === "admin") {
                        window.location.href = "/dashboard";
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    // Fallback to home page if role check fails
                    window.location.href = "/";
                }
            }
        } catch {
            const errorMessage = "Something went wrong. Please try again.";
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoadingLogin(false);
        }
    };

    // New: sign in via Supabase directly so browser session is persisted
    const signIn = async (email: string, password: string) => {
        setLoadingLogin(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { setError(error.message || 'Login gagal'); showError(error.message || 'Login gagal'); return }
            // Apply pending full name from session to auth profile if missing
            try {
                const pendingFullName = getSessionValue('pending_full_name');
                if (pendingFullName) {
                    const { data: currentUser } = await supabase.auth.getUser();
                    const currentMetadata = (currentUser.user?.user_metadata || {}) as Record<string, unknown>;
                    if (!currentMetadata.full_name) {
                        await supabase.auth.updateUser({ data: { ...currentMetadata, full_name: pendingFullName } });
                    }
                    deleteSessionValue('pending_full_name');
                }
            } catch { }
            showSuccess("Login berhasil");
            await createProfileIfMissing();
            await fetchProfile();
            try {
                if (typeof document !== 'undefined') {
                    document.cookie = `app-auth=1; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
                }
            } catch { }
            // Redirect by role to dashboard subpaths
            try {
                const { data: authUser } = await supabase.auth.getUser();
                const uid = authUser.user?.id;
                let role: Accounts['role'] | undefined = undefined;
                if (uid) {
                    const { data: row } = await supabase
                        .from(ACCOUNTS_TABLE)
                        .select('role')
                        .eq('uid', uid)
                        .single();
                    role = row?.role as Accounts['role'] | undefined;
                }
                const target = role === 'karyawan'
                    ? '/dashboard/karyawan'
                    : role === 'admins'
                        ? '/dashboard/admins'
                        : role === 'super-admins'
                            ? '/dashboard/super-admins'
                            : '/dashboard';
                // Persist role for middleware-based routing
                try {
                    if (typeof document !== 'undefined' && role) {
                        document.cookie = `app-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}`;
                    }
                } catch { }
                if (router) router.replace(target); else window.location.href = target;
            } catch {
                if (router) router.replace('/dashboard'); else window.location.href = '/dashboard';
            }
        } catch {
            const msg = "Something went wrong. Please try again.";
            setError(msg);
            showError(msg);
        } finally {
            setLoadingLogin(false);
        }
    };

    // New: sign up then create profile row in accounts
    const signUp = async (params: { fullName: string; email: string; password: string; role?: Accounts['role'] }) => {
        const { fullName, email, password, role } = params;
        setLoadingLogin(true);
        setError("");
        try {
            // Save the full name temporarily in session to apply after auth
            setSessionValue('pending_full_name', fullName);
            const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fullName, email, password, role }) })
            const payload = await res.json()
            if (!res.ok) { setError(payload.error || 'Signup gagal'); showError(payload.error || 'Signup gagal'); return }
            showSuccess('Registration successful');
            window.location.href = '/signin';
        } catch {
            const msg = "Something went wrong. Please try again.";
            setError(msg);
            showError(msg);
        } finally {
            setLoadingLogin(false);
        }
    };

    // New: request password reset email
    const resetPassword = async (email: string) => {
        setLoadingLogin(true);
        setError("");
        try {
            const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/signin` : undefined;
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
            if (error) {
                setError(error.message);
                showError(error.message || 'Failed to send reset email');
                return;
            }
            showSuccess('Password reset email sent');
        } catch {
            const msg = 'Failed to send reset email';
            setError(msg);
            showError(msg);
        } finally {
            setLoadingLogin(false);
        }
    };

    useEffect(() => {
        const getSessionAndUser = async () => {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                setSession(sessionData.session);

                if (sessionData.session) {
                    const { data } = await supabase.auth.getUser();
                    if (data?.user) {
                        setUser(data.user);
                        // Fire-and-forget profile tasks to avoid blocking loading state
                        if (data.user.id) {
                            void createProfileIfMissing();
                            void fetchProfile();
                        }
                    } else {
                        setUser(null);
                        resetState();
                    }
                } else {
                    setUser(null);
                    resetState();
                }
            } finally {
                setLoading(false);
            }
        };
        getSessionAndUser();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session: Session | null) => {
            setSession(session);
            const { data } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
                if (data.user.id) {
                    // Do not block UI on these
                    void createProfileIfMissing();
                    void fetchProfile();
                }
            } else {
                setUser(null);
                resetState();
            }
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase, fetchProfile, createProfileIfMissing]);

    const logout = async () => {
        setLoading(true);
        try {
            await fetch("/api/logout", { method: "POST" });
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
            resetState();
            clearCachedProfile();
            showSuccess("Logout berhasil");
            // Clear auth cookie used by middleware
            try {
                if (typeof document !== 'undefined') {
                    document.cookie = 'app-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                    document.cookie = 'app-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                }
            } catch { }
        } catch {
            showError("Logout gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            logout,
            profile,
            refreshProfile,
            email,
            password,
            showPassword,
            loadingLogin,
            error,
            setEmail,
            setPassword,
            setShowPassword: setShowPasswordHandler,
            setError,
            handleLogin,
            signIn,
            signUp,
            resetPassword,
            clearForm
        }}>
            {children}
        </AuthContext.Provider>
    );
} 