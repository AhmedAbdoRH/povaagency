-- =====================================================
-- إضافة محتوى مباشر للتخصصات (Specialization Content)
-- Add Direct Content to Specializations without Clients
-- =====================================================

-- 1. إنشاء جدول محتوى التخصصات المباشر
CREATE TABLE IF NOT EXISTS specialization_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
    title TEXT,
    title_en TEXT,
    description TEXT,
    description_en TEXT,
    image_url TEXT,
    video_url TEXT,
    content_type TEXT CHECK (content_type IN ('image', 'video', 'text')) DEFAULT 'image',
    is_vertical_video BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إضافة Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_spec_content_specialization_id 
ON specialization_content(specialization_id);

CREATE INDEX IF NOT EXISTS idx_spec_content_active 
ON specialization_content(is_active);

CREATE INDEX IF NOT EXISTS idx_spec_content_featured 
ON specialization_content(is_featured);

CREATE INDEX IF NOT EXISTS idx_spec_content_display_order 
ON specialization_content(display_order);

-- 3. إضافة RLS Policies
ALTER TABLE specialization_content ENABLE ROW LEVEL SECURITY;

-- Policy للقراءة العامة للمحتوى النشط
CREATE POLICY "Allow public read access to active specialization content"
ON specialization_content FOR SELECT
USING (is_active = true);

-- Policy للإدمن للإدارة الكاملة
CREATE POLICY "Allow admin full access to specialization content"
ON specialization_content FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- 4. إضافة Comments للتوضيح
COMMENT ON TABLE specialization_content IS 'محتوى مباشر للتخصصات (كروت/صور/فيديوهات) بدون الحاجة لإنشاء عملاء';
COMMENT ON COLUMN specialization_content.specialization_id IS 'ربط المحتوى بالتخصص (مثل: حملات السوشيال ميديا)';
COMMENT ON COLUMN specialization_content.content_type IS 'نوع المحتوى: صورة، فيديو، أو نص';
COMMENT ON COLUMN specialization_content.is_vertical_video IS 'هل الفيديو عمودي (للموبايل) أم أفقي';
COMMENT ON COLUMN specialization_content.is_featured IS 'محتوى مميز يظهر في الصفحة الرئيسية';

-- 5. Function لحذف المحتوى القديم تلقائياً بعد فترة (اختياري)
CREATE OR REPLACE FUNCTION cleanup_old_specialization_content()
RETURNS void AS $$
BEGIN
    DELETE FROM specialization_content
    WHERE created_at < NOW() - INTERVAL '1 year'
    AND is_active = false;
END;
$$ LANGUAGE plpgsql;

-- 6. عرض البيانات للتأكد من إنشاء الجدول
SELECT 
    'specialization_content' as table_name,
    COUNT(*) as total_records
FROM specialization_content;
