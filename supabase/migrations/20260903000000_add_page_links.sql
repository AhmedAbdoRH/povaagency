-- Add Google Drive and YouTube links columns to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS custom_links JSONB;
