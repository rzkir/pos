import { SquareTerminal, ClipboardList, ShoppingCart } from "lucide-react";

export const karyawanNav = [
  {
    title: "Beranda",
    url: "/dashboard/karyawan",
    icon: SquareTerminal,
    items: [{ title: "Ringkasan", url: "/dashboard/karyawan" }],
  },
  {
    title: "Kasir",
    url: "/dashboard/karyawan/pos",
    icon: ShoppingCart,
    items: [{ title: "Transaksi", url: "/dashboard/karyawan/pos" }],
  },
  {
    title: "Tugas",
    url: "/dashboard/karyawan/tasks",
    icon: ClipboardList,
    items: [{ title: "Daftar Tugas", url: "/dashboard/karyawan/tasks" }],
  },
];
