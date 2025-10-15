
'use client';

import React from 'react';

import Link from 'next/link';

import Image from 'next/image';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center px-6 md:px-10 py-16 bg-background">
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground/80 px-3 py-1 text-xs font-medium">
            Sistem Manajemen Perusahaan
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
            Holla, Welcome Back
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl">
            Kelola operasi bisnis Anda secara terpusat: produk, cabang, karyawan, dan proses harian—tanpa ribet.
          </p>

          <div className="mt-8">
            <Link
              href="/signin"
              className="inline-flex items-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div className="mx-auto w-full max-w-md md:max-w-lg">
            <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-border bg-card">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&auto=format&fit=crop&w=1200"
                alt="Business management illustration"
                width={900}
                height={700}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}