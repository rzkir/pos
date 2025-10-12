"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, Package, Users, DollarSign } from "lucide-react";

export default function ManagerDashboard() {
    const { profile } = useAuth();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Dashboard Manager
                </h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Selamat datang, {profile?.display_name || "Manager"}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Penjualan Hari Ini
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 2,500,000</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Transaksi Hari Ini
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45</div>
                        <p className="text-xs text-muted-foreground">
                            +12% dari kemarin
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Produk Aktif
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            +3 produk baru
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Karyawan Aktif
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">
                            Semua hadir hari ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Reports */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Grafik Penjualan 7 Hari Terakhir</CardTitle>
                        <CardDescription>
                            Tren penjualan harian untuk minggu ini
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                                <p>Chart akan ditampilkan di sini</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Produk Terlaris</CardTitle>
                        <CardDescription>
                            Top 5 produk dengan penjualan tertinggi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Kopi Arabica
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        45 terjual
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Rp 125,000</div>
                            </div>
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Teh Hijau
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        38 terjual
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Rp 85,000</div>
                            </div>
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Sandwich
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        32 terjual
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">Rp 45,000</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Terbaru</CardTitle>
                        <CardDescription>
                            Update terbaru dari sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Transaksi baru</p>
                                    <p className="text-xs text-muted-foreground">
                                        Rp 75,000 - 2 menit yang lalu
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Stok diperbarui</p>
                                    <p className="text-xs text-muted-foreground">
                                        Kopi Arabica - 5 menit yang lalu
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Karyawan login</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ahmad - 10 menit yang lalu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifikasi Stok</CardTitle>
                        <CardDescription>
                            Produk dengan stok rendah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Teh Hijau</p>
                                    <p className="text-xs text-muted-foreground">Stok: 5 pcs</p>
                                </div>
                                <div className="text-sm text-red-500 font-medium">
                                    Stok Rendah
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Susu UHT</p>
                                    <p className="text-xs text-muted-foreground">Stok: 8 pcs</p>
                                </div>
                                <div className="text-sm text-yellow-500 font-medium">
                                    Perhatian
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
