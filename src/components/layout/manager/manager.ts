import {
  SquareTerminal,
  Settings2,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
} from "lucide-react";

export const managerNav = [
  {
    title: "Dashboard",
    url: "/dashboard/manager",
    icon: SquareTerminal,
    items: [{ title: "Ringkasan", url: "/dashboard/manager" }],
  },

  {
    title: "Penjualan",
    url: "/dashboard/manager/sales",
    icon: ShoppingCart,
    items: [
      { title: "Transaksi", url: "/dashboard/manager/sales" },
      { title: "Riwayat", url: "/dashboard/manager/sales/history" },
      { title: "Laporan", url: "/dashboard/manager/sales/reports" },
    ],
  },

  {
    title: "Produk",
    url: "/dashboard/manager/products",
    icon: Package,
    items: [
      { title: "Daftar Produk", url: "/dashboard/manager/products/products" },
      { title: "Kategori", url: "/dashboard/manager/products/categories" },
      { title: "Size", url: "/dashboard/manager/products/size" },
      { title: "Supplier", url: "/dashboard/manager/products/suppliers" },
    ],
  },

  {
    title: "Karyawan",
    url: "/dashboard/manager/employees",
    icon: Users,
    items: [
      { title: "Daftar Karyawan", url: "/dashboard/manager/employees" },
      { title: "Jadwal Kerja", url: "/dashboard/manager/employees/schedule" },
    ],
  },

  {
    title: "Laporan",
    url: "/dashboard/manager/reports",
    icon: BarChart3,
    items: [
      { title: "Penjualan", url: "/dashboard/manager/reports/sales" },
      { title: "Stok", url: "/dashboard/manager/reports/inventory" },
      { title: "Karyawan", url: "/dashboard/manager/reports/employees" },
    ],
  },

  {
    title: "Pengaturan",
    url: "/dashboard/manager/settings",
    icon: Settings2,
    items: [
      { title: "Profile", url: "/dashboard/manager/settings/profile" },
      { title: "Cabang", url: "/dashboard/manager/settings/branch" },
    ],
  },
];
