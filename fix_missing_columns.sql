-- =====================================================
-- Fix Missing Columns and Tables
-- =====================================================

-- 1. Add image_url and banner_url to pages table (if they don't exist)
DO $$
BEGIN
    -- Check and add image_url if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE pages ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to pages table';
    END IF;

    -- Check and add banner_url if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'banner_url'
    ) THEN
        ALTER TABLE pages ADD COLUMN banner_url TEXT;
        RAISE NOTICE 'Added banner_url column to pages table';
    END IF;

    -- Remove slug column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'slug'
    ) THEN
        ALTER TABLE pages DROP COLUMN slug;
        RAISE NOTICE 'Removed slug column from pages table';
    END IF;
END $$;

-- 2. Create client_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    content_type TEXT NOT NULL DEFAULT 'image' CHECK (content_type IN ('image', 'video', 'text')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for client_content
CREATE INDEX IF NOT EXISTS idx_client_content_client_id ON client_content(client_id);
CREATE INDEX IF NOT EXISTS idx_client_content_active ON client_content(is_active);

-- 4. Create trigger for client_content updated_at
DROP TRIGGER IF EXISTS update_client_content_updated_at ON client_content;
CREATE TRIGGER update_client_content_updated_at
    BEFORE UPDATE ON client_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable RLS for client_content
ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for client_content (drop if exists first)
DROP POLICY IF EXISTS "Public can view active client content" ON client_content;
DROP POLICY IF EXISTS "Authenticated can manage client content" ON client_content;

CREATE POLICY "Public can view active client content"
  ON client_content FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage client content"
  ON client_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('services', 'services', true) 
ON CONFLICT (id) DO NOTHING;

-- 8. Create storage policies (drop if exists first)
DROP POLICY IF EXISTS "Public can view services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload to services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update services bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete from services bucket" ON storage.objects;

CREATE POLICY "Public can view services bucket"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'services');

CREATE POLICY "Authenticated can upload to services bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated can update services bucket"
  ON storage.objects FOR UPDATE
  TO authenticated
  WITH CHECK (bucket_id = 'services');

CREATE POLICY "Authenticated can delete from services bucket"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'services');

DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
END $$;
