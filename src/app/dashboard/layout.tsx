"use client";

import { useAuth } from "@/context/AuthContext";

import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/signin');
        }
    }, [loading, user, router]);

    return (
        <SidebarProvider>
            <AppSidebar role={profile?.role} />
            <SidebarInset>
                <main className="flex-1">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
} 