import { SquareTerminal, Settings2, Shield, Users } from "lucide-react";

export const superAdminsNav = [
  {
    title: "Dashboard",
    url: "/dashboard/super-admins",
    icon: SquareTerminal,
    isActive: true,
    items: [{ title: "Ringkasan", url: "/dashboard/super-admins" }],
  },
  {
    title: "Manajemen Pengguna",
    url: "/dashboard/super-admins/users",
    icon: Users,
    items: [
      { title: "Semua Pengguna", url: "/dashboard/super-admins/users" },
      { title: "Peran & Akses", url: "/dashboard/super-admins/roles" },
    ],
  },
  {
    title: "Keamanan",
    url: "/dashboard/super-admins/security",
    icon: Shield,
    items: [
      { title: "Audit Log", url: "/dashboard/super-admins/security/audit" },
    ],
  },
  {
    title: "Pengaturan",
    url: "/dashboard/super-admins/settings",
    icon: Settings2,
    items: [{ title: "Umum", url: "/dashboard/super-admins/settings" }],
  },
];
