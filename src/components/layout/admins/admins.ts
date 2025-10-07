import { SquareTerminal, Settings2, ShoppingCart, Package } from "lucide-react";

export const adminsNav = [
  {
    title: "Dashboard",
    url: "/dashboard/admins",
    icon: SquareTerminal,
    isActive: true,
    items: [{ title: "Ringkasan", url: "/dashboard/admins" }],
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
      { title: "Daftar Produk", url: "/dashboard/admins/products/products" },
      { title: "Kategori", url: "/dashboard/admins/products/categories" },
      { title: "Size", url: "/dashboard/admins/products/size" },
    ],
  },

  {
    title: "Pengaturan",
    url: "/dashboard/admins/settings",
    icon: Settings2,
    items: [
      { title: "Umum", url: "/dashboard/admins/settings" },
      { title: "Tim", url: "/dashboard/admins/settings/team" },
    ],
  },
];
