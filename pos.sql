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

-- Create policy for users to read their own profile
CREATE POLICY "Users can view own profile" ON accounts
    FOR SELECT USING (auth.uid() = uid);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update own profile" ON accounts
    FOR UPDATE USING (auth.uid() = uid);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert own profile" ON accounts
    FOR INSERT WITH CHECK (auth.uid() = uid);

-- Create policy for users to delete their own profile
CREATE POLICY "Users can delete own profile" ON accounts
    FOR DELETE USING (auth.uid() = uid);

-- Grant necessary permissions
GRANT ALL ON accounts TO authenticated;
GRANT USAGE ON SEQUENCE accounts_id_seq TO authenticated;
