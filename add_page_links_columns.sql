-- =====================================================
-- إضافة أعمدة روابط جوجل درايف ويوتيوب لجدول الصفحات (Pages)
-- Add Google Drive and YouTube links columns to pages table
-- =====================================================

ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS custom_links JSONB;

-- إضافة تعليقات توضيحية للأعمدة
COMMENT ON COLUMN pages.drive_url IS 'رابط مجلد أو ملفات Google Drive الخاصة بالخدمة';
COMMENT ON COLUMN pages.youtube_url IS 'رابط فيديو YouTube التعريفي الخاص بالخدمة';
COMMENT ON COLUMN pages.custom_links IS 'مصفوفة روابط إضافية مخصصة للخدمة بتنسيق JSON';
