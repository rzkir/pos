import { SquareTerminal, Settings2, ShoppingCart, Package } from "lucide-react";

export const adminsNav = [
  {
    title: "Dashboard",
    url: "/dashboard/admins",
    icon: SquareTerminal,
    items: [{ title: "Dashboard", url: "/dashboard/admins" }],
  },

  {
    title: "Penjualan",
    url: "/dashboard/admins/sales",
    icon: ShoppingCart,
    items: [
      { title: "Transaksi", url: "/dashboard/admins/sales" },
      { title: "Riwayat", url: "/dashboard/admins/sales/history" },
    ],
  },

  {
    title: "Produk",
    url: "/dashboard/admins/products",
    icon: Package,
    items: [
      {
        title: "Daftar Produk",
        url: "/dashboard/admins/products",
      },
      { title: "Kategori", url: "/dashboard/admins/products/categories" },
      { title: "Size", url: "/dashboard/admins/products/size" },
      { title: "Supplier", url: "/dashboard/admins/products/suppliers" },
    ],
  },

  {
    title: "Pengaturan",
    url: "/dashboard/admins/settings",
    icon: Settings2,
    items: [
      { title: "Profile", url: "/dashboard/admins/settings/profile" },
      { title: "Company", url: "/dashboard/admins/settings/company" },
      { title: "Branches", url: "/dashboard/admins/settings/branches" },
      { title: "Karyawan", url: "/dashboard/admins/settings/karyawan" },
    ],
  },
];
