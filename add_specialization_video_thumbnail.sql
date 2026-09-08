-- ═══════════════════════════════════════════════════════════════
-- إضافة عمود video_thumbnail لجدول specializations
-- Enables direct file upload for section video thumbnails
-- ═══════════════════════════════════════════════════════════════

-- 1. إضافة العمود الجديد (إذا لم يكن موجود)
ALTER TABLE specializations 
ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;

-- 2. التحقق من وجود العمود
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'specializations' 
  AND column_name = 'video_thumbnail';

-- 3. عرض الأقسام مع الغلاف
SELECT 
    id,
    name,
    name_en,
    video_thumbnail,
    CASE 
        WHEN video_thumbnail IS NOT NULL THEN '✓ موجود'
        ELSE '✗ غير موجود'
    END as thumbnail_status,
    created_at
FROM specializations
ORDER BY created_at DESC
LIMIT 20;

-- 4. إحصائيات
SELECT 
    COUNT(*) as total_specializations,
    COUNT(video_thumbnail) as with_thumbnail,
    COUNT(*) - COUNT(video_thumbnail) as without_thumbnail
FROM specializations;

-- 5. التراجع (إذا احتجت)
-- ALTER TABLE specializations DROP COLUMN IF EXISTS video_thumbnail;