"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        try {
            const cookie = typeof document !== 'undefined' ? document.cookie : '';
            const match = cookie.match(/(?:^|; )app-role=([^;]+)/);
            const role = match ? decodeURIComponent(match[1]) : null;
            if (role === 'karyawan') {
                router.replace('/dashboard/karyawan');
                return;
            }
            if (role === 'admins') {
                router.replace('/dashboard/admins');
                return;
            }
            if (role === 'super-admins') {
                router.replace('/dashboard/super-admins');
                return;
            }
        } catch { }
    }, [router]);

    return (
        <div className="text-sm text-muted-foreground">Mengarahkan ke dashboard Anda...</div>
    );
}
