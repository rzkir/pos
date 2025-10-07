interface Products {
  id: number;
  uid: string;
  name: string;
  price: number;
  modal: number;
  stock: number;
  sold: number;
  image_url: string;
  category_id?: number;
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

interface ProductSizes {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface ProductWithRelations extends Products {
  product_categories?: { name: string };
  product_sizes?: { name: string };
}
