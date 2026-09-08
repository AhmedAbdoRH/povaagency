-- ═══════════════════════════════════════════════════════════════
-- إضافة دعم كامل للكافرات (Thumbnails) في قاعدة البيانات
-- Complete Thumbnail Support for Database
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. إضافة أعمدة الكافرات للجداول
-- ═══════════════════════════════════════════════════════════════

-- Services (الخدمات)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS primary_thumbnail_url TEXT;

COMMENT ON COLUMN services.primary_thumbnail_url IS 'رابط صورة الكافر الأساسية للخدمة (يمكن رفعها أو لصق رابط Google Drive)';

-- Specializations (التخصصات/الأقسام)
ALTER TABLE specializations 
ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;

COMMENT ON COLUMN specializations.video_thumbnail IS 'رابط صورة كافر الفيديو التعريفي (يمكن رفعها أو لصق رابط Google Drive)';

-- Client Content (محتوى العملاء)
ALTER TABLE client_content 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

COMMENT ON COLUMN client_content.thumbnail_url IS 'رابط صورة مصغرة للمحتوى (للفيديوهات خاصة)';

-- ═══════════════════════════════════════════════════════════════
-- 2. إضافة أعمدة إضافية للروابط الخارجية
-- ═══════════════════════════════════════════════════════════════

-- Pages (الصفحات)
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS primary_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS additional_videos JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN pages.drive_url IS 'رابط Google Drive للفيديو الأساسي';
COMMENT ON COLUMN pages.primary_thumbnail_url IS 'رابط صورة الكافر للفيديو الأساسي';
COMMENT ON COLUMN pages.additional_videos IS 'فيديوهات إضافية بصيغة JSON: [{"id":"","title":"","url":"","thumbnail_url":""}]';

-- Services (إضافة نفس الأعمدة)
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS additional_videos JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN services.drive_url IS 'رابط Google Drive للفيديو الأساسي';
COMMENT ON COLUMN services.additional_videos IS 'فيديوهات إضافية بصيغة JSON: [{"id":"","title":"","url":"","thumbnail_url":""}]';

-- Specializations (إضافة نفس الأعمدة)
ALTER TABLE specializations 
ADD COLUMN IF NOT EXISTS drive_url TEXT,
ADD COLUMN IF NOT EXISTS primary_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS additional_videos JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN specializations.drive_url IS 'رابط Google Drive للفيديو الأساسي';
COMMENT ON COLUMN specializations.primary_thumbnail_url IS 'رابط صورة الكافر للفيديو الأساسي';
COMMENT ON COLUMN specializations.additional_videos IS 'فيديوهات إضافية بصيغة JSON';

-- ═══════════════════════════════════════════════════════════════
-- 3. أمثلة على إضافة بيانات يدوياً
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ مثال 1: إضافة كافر لخدمة (Service)                         │
-- └─────────────────────────────────────────────────────────────┘

-- استبدل 'SERVICE_ID_HERE' بالـ ID الحقيقي من جدول services
-- استبدل الرابط بالرابط الحقيقي من Google Drive أو أي مصدر آخر

/*
UPDATE services 
SET 
    primary_thumbnail_url = 'https://drive.google.com/uc?export=view&id=YOUR_IMAGE_ID',
    drive_url = 'https://drive.google.com/file/d/YOUR_VIDEO_ID/view'
WHERE id = 'SERVICE_ID_HERE';
*/

-- ┌─────────────────────────────────────────────────────────────┐
-- │ مثال 2: إضافة كافر لتخصص (Specialization)                  │
-- └─────────────────────────────────────────────────────────────┘

/*
UPDATE specializations 
SET 
    video_thumbnail = 'https://drive.google.com/uc?export=view&id=YOUR_IMAGE_ID',
    drive_url = 'https://drive.google.com/file/d/YOUR_VIDEO_ID/view',
    primary_thumbnail_url = 'https://drive.google.com/uc?export=view&id=YOUR_IMAGE_ID'
WHERE id = 'SPECIALIZATION_ID_HERE';
*/

-- ┌─────────────────────────────────────────────────────────────┐
-- │ مثال 3: إضافة فيديوهات إضافية مع كافرات                    │
-- └─────────────────────────────────────────────────────────────┘

/*
UPDATE services 
SET additional_videos = '[
    {
        "id": "video1",
        "title": "فيديو توضيحي 1",
        "url": "https://drive.google.com/file/d/VIDEO_ID_1/view",
        "thumbnail_url": "https://drive.google.com/uc?export=view&id=THUMBNAIL_ID_1"
    },
    {
        "id": "video2",
        "title": "فيديو توضيحي 2",
        "url": "https://drive.google.com/file/d/VIDEO_ID_2/view",
        "thumbnail_url": "https://drive.google.com/uc?export=view&id=THUMBNAIL_ID_2"
    }
]'::jsonb
WHERE id = 'SERVICE_ID_HERE';
*/

-- ═══════════════════════════════════════════════════════════════
-- 4. دوال مساعدة لاستخراج روابط مباشرة من Google Drive
-- ═══════════════════════════════════════════════════════════════

-- دالة لتحويل رابط Google Drive عادي لرابط مباشر للصورة
CREATE OR REPLACE FUNCTION get_drive_direct_link(drive_url TEXT)
RETURNS TEXT AS $$
DECLARE
    file_id TEXT;
BEGIN
    -- استخراج File ID من الرابط
    file_id := substring(drive_url from '/d/([^/]+)');
    IF file_id IS NULL THEN
        file_id := substring(drive_url from '[?&]id=([^&]+)');
    END IF;
    
    IF file_id IS NOT NULL THEN
        RETURN 'https://drive.google.com/uc?export=view&id=' || file_id;
    ELSE
        RETURN drive_url;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ═══════════════════════════════════════════════════════════════
-- 5. عرض الجداول مع الأعمدة الجديدة
-- ═══════════════════════════════════════════════════════════════

-- عرض Services مع الكافرات
SELECT 
    id,
    name,
    drive_url,
    primary_thumbnail_url,
    CASE 
        WHEN primary_thumbnail_url IS NOT NULL THEN '✓ يوجد كافر'
        ELSE '✗ لا يوجد كافر'
    END as thumbnail_status
FROM services
ORDER BY created_at DESC
LIMIT 10;

-- عرض Specializations مع الكافرات
SELECT 
    id,
    name,
    drive_url,
    video_thumbnail,
    primary_thumbnail_url,
    CASE 
        WHEN video_thumbnail IS NOT NULL OR primary_thumbnail_url IS NOT NULL THEN '✓ يوجد كافر'
        ELSE '✗ لا يوجد كافر'
    END as thumbnail_status
FROM specializations
ORDER BY created_at DESC
LIMIT 10;

-- ═══════════════════════════════════════════════════════════════
-- 6. كيفية استخدام الروابط من Google Drive
-- ═══════════════════════════════════════════════════════════════

/*
📝 ملاحظات مهمة:

1️⃣ للحصول على رابط صورة من Google Drive:
   - ارفع الصورة على Google Drive
   - اضغط يمين > Get link > Anyone with the link can view
   - انسخ الرابط (مثال: https://drive.google.com/file/d/1AbCd123XyZ/view)
   - استخرج الـ ID (الجزء بين /d/ و /view)
   - استخدم الرابط المباشر: https://drive.google.com/uc?export=view&id=1AbCd123XyZ

2️⃣ أو استخدم الدالة المساعدة:
   SELECT get_drive_direct_link('https://drive.google.com/file/d/1AbCd123XyZ/view');

3️⃣ للفيديوهات، استخدم الرابط العادي:
   https://drive.google.com/file/d/YOUR_VIDEO_ID/view

4️⃣ يمكنك أيضاً استخدام روابط من مصادر أخرى:
   - ImgBB: https://i.ibb.co/xxxxx/image.jpg
   - Imgur: https://i.imgur.com/xxxxx.jpg
   - أي رابط مباشر آخر
*/

-- ═══════════════════════════════════════════════════════════════
-- ✅ تم! الآن يمكنك إضافة الكافرات يدوياً باستخدام UPDATE
-- ✅ Done! Now you can add thumbnails manually using UPDATE
-- ═══════════════════════════════════════════════════════════════
