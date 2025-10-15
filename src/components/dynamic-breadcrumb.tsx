"use client";

import React from "react";

import { usePathname } from "next/navigation";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { adminsNav } from "@/components/layout/admins/admins";

import { superAdminsNav } from "@/components/layout/super-admins/super-admins";

import { managerNav } from "@/components/layout/manager/manager";

import { karyawanNav } from "@/components/layout/karyawan/karyawan";

import { useAuth } from "@/context/AuthContext";

export function DynamicBreadcrumb() {
    const pathname = usePathname();
    const { profile } = useAuth();

    const getNavItems = () => {
        switch (profile?.role) {
            case 'super-admins':
                return superAdminsNav;
            case 'admins':
                return adminsNav;
            case 'manager':
                return managerNav;
            case 'karyawan':
                return karyawanNav;
            default:
                return adminsNav;
        }
    };

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const navItems = getNavItems();
        const pathSegments = pathname.split('/').filter(Boolean);

        const segments = pathSegments.filter(segment => segment !== 'dashboard');

        const breadcrumbs: BreadcrumbItem[] = [];

        if (segments.length === 0) {
            return [{ title: 'Dashboard' }];
        }

        // Find the matching navigation item
        const findNavItem = (items: Array<{ url: string, title: string, items?: Array<{ url: string, title: string }> }>, path: string): { url: string, title: string, subItem?: { url: string, title: string } } | null => {
            for (const item of items) {
                if (item.url === path) {
                    return item;
                }
                if (item.items) {
                    for (const subItem of item.items) {
                        if (subItem.url === path) {
                            return { ...item, subItem };
                        }
                    }
                }
            }
            return null;
        };

        // Try to find exact match first
        const matchedItem = findNavItem(navItems, pathname);

        if (matchedItem) {
            breadcrumbs.push({ title: matchedItem.title, href: matchedItem.url });

            if (matchedItem.subItem) {
                breadcrumbs.push({ title: matchedItem.subItem.title });
            }
        } else {
            // Fallback: generate breadcrumbs from path segments
            let currentPath = '';
            for (let i = 0; i < segments.length; i++) {
                currentPath += `/${segments[i]}`;
                const title = segments[i]
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                if (i === segments.length - 1) {
                    breadcrumbs.push({ title });
                } else {
                    breadcrumbs.push({ title, href: currentPath });
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                            {item.href && index < breadcrumbs.length - 1 ? (
                                <BreadcrumbLink href={item.href}>
                                    {item.title}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.title}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
