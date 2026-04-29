-- Add English translation columns to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English translation columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English translation columns to specializations table
ALTER TABLE specializations ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE specializations ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add English translation columns to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS description_en TEXT;
