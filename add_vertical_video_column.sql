-- Add is_vertical_video column to client_content table
ALTER TABLE client_content ADD COLUMN IF NOT EXISTS is_vertical_video BOOLEAN DEFAULT false;
