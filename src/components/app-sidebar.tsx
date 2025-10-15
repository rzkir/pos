"use client"

import * as React from "react"

import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import { NavUser } from "@/components/nav-user"

import { TeamSwitcher } from "@/components/team-switcher"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { superAdminsNav } from "@/components/layout/super-admins/super-admins"

import { adminsNav } from "@/components/layout/admins/admins"

import { managerNav } from "@/components/layout/manager/manager"

import { karyawanNav } from "@/components/layout/karyawan/karyawan"

import { useAuth } from "@/context/AuthContext"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "Company",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Branches.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Karyawan.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ role, ...props }: React.ComponentProps<typeof Sidebar> & { role?: 'super-admins' | 'admins' | 'manager' | 'karyawan' }) {
  const { user: authUser, profile } = useAuth()
  // Choose nav items based on role with safe fallback
  const navForRole = React.useMemo(() => {
    switch (role) {
      case 'super-admins':
        return superAdminsNav;
      case 'admins':
        return adminsNav;
      case 'manager':
        return managerNav;
      case 'karyawan':
        return karyawanNav;
      default:
        return adminsNav; // default fallback
    }
  }, [role]);

  const navUserData = React.useMemo(() => {
    const nameFromProfile = profile?.display_name
    const emailFromProfile = profile?.email || authUser?.email || data.user.email
    const nameFromEmail = (emailFromProfile || '').split('@')[0] || data.user.name
    return {
      name: nameFromProfile || nameFromEmail,
      email: emailFromProfile || data.user.email,
      avatar: profile?.photo_url || data.user.avatar,
    }
  }, [profile, authUser])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navForRole} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUserData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}