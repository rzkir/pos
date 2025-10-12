interface Products {
  id: number;
  uid: string;
  name: string;
  price: number;
  modal: number;
  stock: number;
  sold: number;
  unit: string;
  image_url: string;
  category_id?: number;
  size_id?: number;
  barcode: string;
  is_active: boolean;
  // Tambahan penting
  sku?: string; // kode unik internal produk (bisa beda dengan barcode)
  min_stock?: number; // batas minimal stok untuk notifikasi restock
  discount?: number; // diskon per produk (% atau nominal)
  description?: string; // deskripsi singkat produk
  supplier_id?: number; // relasi ke supplier
  location_id?: number; // lokasi penyimpanan (jika multi-outlet)
  expiration_date?: string; // tanggal kadaluarsa (jika produk makanan/obat)
  tax?: number; // pajak per produk (jika ada)
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductCategories {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductSizes {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface Supplier {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

interface Branch {
  id: number;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductWithRelations extends Products {
  product_categories?: { name: string };
  product_sizes?: { name: string };
  suppliers?: { name: string };
}
