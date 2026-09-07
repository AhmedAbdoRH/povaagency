-- Add video links columns to services and specializations tables
-- This mirrors the existing structure in pages table for consistency

-- Add columns to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS custom_links JSONB;

-- Add columns to specializations table
ALTER TABLE specializations
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS custom_links JSONB;

-- Add comments for documentation
COMMENT ON COLUMN services.drive_url IS 'رابط مجلد أو ملفات Google Drive الخاصة بالخدمة';
COMMENT ON COLUMN services.youtube_url IS 'رابط فيديو YouTube التعريفي الخاص بالخدمة';
COMMENT ON COLUMN services.custom_links IS 'مصفوفة روابط إضافية مخصصة للخدمة بتنسيق JSON';

COMMENT ON COLUMN specializations.drive_url IS 'رابط مجلد أو ملفات Google Drive الخاصة بالقسم';
COMMENT ON COLUMN specializations.youtube_url IS 'رابط فيديو YouTube التعريفي الخاص بالقسم';
COMMENT ON COLUMN specializations.custom_links IS 'مصفوفة روابط إضافية مخصصة للقسم بتنسيق JSON';
