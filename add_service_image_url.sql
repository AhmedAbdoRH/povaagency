-- =====================================================
-- Add image_url column to services table
-- =====================================================

DO $$
BEGIN
    -- Check and add image_url if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'services' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE services ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url column to services table';
    END IF;
END $$;
