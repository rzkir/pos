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
  sku?: string;
  min_stock?: number;
  discount?: number;
  description?: string;
  supplier_id?: number;
  location_id?: number;
  expiration_date?: string;
  tax?: number;
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
