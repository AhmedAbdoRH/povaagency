-- =====================================================
-- Migration Script: Add missing columns to existing tables
-- =====================================================

-- Add is_active column to pages if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE pages ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to pages';
    END IF;
END $$;

-- Add display_order column to pages if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'display_order'
    ) THEN
        ALTER TABLE pages ADD COLUMN display_order INTEGER DEFAULT 0;
        RAISE NOTICE 'Added display_order column to pages';
    END IF;
END $$;

-- Add updated_at column to pages if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE pages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to pages';
    END IF;
END $$;

-- Create services table if it doesn't exist
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update specializations table to use service_id instead of page_id
DO $$
BEGIN
    -- Check if service_id column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'specializations' AND column_name = 'service_id'
    ) THEN
        -- Add service_id column
        ALTER TABLE specializations ADD COLUMN service_id UUID REFERENCES services(id) ON DELETE CASCADE;
        
        -- If there's existing page_id, we'll need to migrate data
        -- First, create a default service for each page
        INSERT INTO services (page_id, name, description)
        SELECT DISTINCT page_id, 'General Service', 'Default service for this page'
        FROM specializations
        WHERE page_id IS NOT NULL
        ON CONFLICT DO NOTHING;
        
        -- Update specializations to link to the new service
        UPDATE specializations s
        SET service_id = (
            SELECT id FROM services sv 
            WHERE sv.page_id = s.page_id 
            LIMIT 1
        )
        WHERE s.page_id IS NOT NULL;
        
        -- Now we can drop the old page_id column (optional, keeping for now for safety)
        -- ALTER TABLE specializations DROP COLUMN IF EXISTS page_id;
        
        RAISE NOTICE 'Added service_id column to specializations and migrated data';
    END IF;
END $$;

-- Add missing columns to specializations
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'specializations' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE specializations ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added is_active column to specializations';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'specializations' AND column_name = 'display_order'
    ) THEN
        ALTER TABLE specializations ADD COLUMN display_order INTEGER DEFAULT 0;
        RAISE NOTICE 'Added display_order column to specializations';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'specializations' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE specializations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to specializations';
    END IF;
END $$;

-- Add missing columns to clients
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE clients ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to clients';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'project_url'
    ) THEN
        ALTER TABLE clients ADD COLUMN project_url TEXT;
        RAISE NOTICE 'Added project_url column to clients';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'display_order'
    ) THEN
        ALTER TABLE clients ADD COLUMN display_order INTEGER DEFAULT 0;
        RAISE NOTICE 'Added display_order column to clients';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE clients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to clients';
    END IF;
END $$;

-- Add missing columns to banners
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banners' AND column_name = 'page_id'
    ) THEN
        ALTER TABLE banners ADD COLUMN page_id UUID REFERENCES pages(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added page_id column to banners';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'banners' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE banners ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to banners';
    END IF;
END $$;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_services_page_id ON services(page_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_specializations_service_id ON specializations(service_id);
CREATE INDEX IF NOT EXISTS idx_banners_page_id ON banners(page_id);

-- Create trigger for services updated_at
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Add policies for services
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
END $$;
