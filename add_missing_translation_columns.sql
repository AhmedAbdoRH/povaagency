-- Add English translation columns to client_content table
ALTER TABLE client_content ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE client_content ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English translation columns to banners table
ALTER TABLE banners ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE banners ADD COLUMN IF NOT EXISTS description_en TEXT;
