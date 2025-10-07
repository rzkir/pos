interface Products {
  id: number;
  uid: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id?: number;
  type_id?: number;
  size_id?: number;
  barcode: string;
  is_active: boolean;
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

interface ProductTypes {
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
