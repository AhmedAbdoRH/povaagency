-- Add missing description_en and name_en columns to pages table
-- Fixes: "Could not find the 'description_en' column of 'pages' in the schema cache"

BEGIN;

ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Add similar columns to related tables if needed
ALTER TABLE services
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE specializations
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE clients
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

COMMIT;
