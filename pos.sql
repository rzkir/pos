-- ACCOUNTS TABLE FOR USER PROFILES
-- =============================================
-- Create enum type for account roles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'account_role'
    ) THEN
        CREATE TYPE account_role AS ENUM ('super-admins', 'admins', 'karyawan');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL, -- Supabase Auth user ID
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role account_role NOT NULL DEFAULT 'karyawan',
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_accounts_uid ON accounts(uid);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_updated_at 
    BEFORE UPDATE ON accounts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- In case the table existed before adding the role column, ensure it is present
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS role account_role NOT NULL DEFAULT 'karyawan';

-- Enable Row Level Security (RLS)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own accounts
CREATE POLICY "Users can view own accounts" ON accounts
    FOR SELECT USING (auth.uid() = uid);

-- Create policy for users to update their own accounts
CREATE POLICY "Users can update own accounts" ON accounts
    FOR UPDATE USING (auth.uid() = uid);

-- Create policy for users to insert their own accounts
CREATE POLICY "Users can insert own accounts" ON accounts
    FOR INSERT WITH CHECK (auth.uid() = uid);

-- Create policy for users to delete their own accounts
CREATE POLICY "Users can delete own accounts" ON accounts
    FOR DELETE USING (auth.uid() = uid);

-- Grant necessary permissions
GRANT ALL ON accounts TO authenticated;
GRANT USAGE ON SEQUENCE accounts_id_seq TO authenticated;

-- TABLE FOR Products Category
-- =============================================
CREATE TABLE IF NOT EXISTS product_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE FOR Product Types
-- =============================================
CREATE TABLE IF NOT EXISTS product_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE FOR Product Sizes
-- =============================================
CREATE TABLE IF NOT EXISTS product_sizes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for product_categories updated_at
CREATE TRIGGER update_product_categories_updated_at 
    BEFORE UPDATE ON product_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for product_types updated_at
CREATE TRIGGER update_product_types_updated_at 
    BEFORE UPDATE ON product_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for product_sizes updated_at
CREATE TRIGGER update_product_sizes_updated_at 
    BEFORE UPDATE ON product_sizes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for product_categories
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for product_categories (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view categories" ON product_categories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert categories" ON product_categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can update categories" ON product_categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can delete categories" ON product_categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

-- Grant permissions for product_categories
GRANT ALL ON product_categories TO authenticated;
GRANT USAGE ON SEQUENCE product_categories_id_seq TO authenticated;

-- Enable RLS for product_types
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;

-- Create policies for product_types (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view types" ON product_types
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert types" ON product_types
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can update types" ON product_types
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can delete types" ON product_types
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

-- Grant permissions for product_types
GRANT ALL ON product_types TO authenticated;
GRANT USAGE ON SEQUENCE product_types_id_seq TO authenticated;

-- Enable RLS for product_sizes
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for product_sizes (all authenticated users can read, only admins can modify)
CREATE POLICY "Anyone can view sizes" ON product_sizes
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert sizes" ON product_sizes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can update sizes" ON product_sizes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Admins can delete sizes" ON product_sizes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

-- Grant permissions for product_sizes
GRANT ALL ON product_sizes TO authenticated;
GRANT USAGE ON SEQUENCE product_sizes_id_seq TO authenticated;

-- TABLE FOR Products
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    uid UUID UNIQUE NOT NULL, -- Unique identifier for the product
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    category_id BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,
    type_id BIGINT REFERENCES product_types(id) ON DELETE SET NULL,
    size_id BIGINT REFERENCES product_sizes(id) ON DELETE SET NULL,
    barcode VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES accounts(uid) ON DELETE SET NULL, -- Who created this product
    updated_by UUID REFERENCES accounts(uid) ON DELETE SET NULL, -- Who last updated this product
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for products table
CREATE INDEX IF NOT EXISTS idx_products_uid ON products(uid);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_type_id ON products(type_id);
CREATE INDEX IF NOT EXISTS idx_products_size_id ON products(size_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_updated_by ON products(updated_by);

-- Create trigger for products updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

CREATE POLICY "Admins can view all products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Users can view products they created" ON products
    FOR SELECT USING (
        auth.role() = 'authenticated' 
        AND created_by = auth.uid()
    );

CREATE POLICY "Admins can insert products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Karyawan can insert products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role = 'karyawan'
        )
    );

CREATE POLICY "Admins can update all products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

CREATE POLICY "Users can update products they created" ON products
    FOR UPDATE USING (
        auth.role() = 'authenticated' 
        AND created_by = auth.uid()
    );

CREATE POLICY "Admins can delete products" ON products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM accounts 
            WHERE uid = auth.uid() 
            AND role IN ('super-admins', 'admins')
        )
    );

-- Grant permissions for products
GRANT ALL ON products TO authenticated;
GRANT USAGE ON SEQUENCE products_id_seq TO authenticated;