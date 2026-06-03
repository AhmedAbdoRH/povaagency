-- تحديث جميع الفيديوهات الموجودة لتكون طولية بشكل افتراضي
-- Update all existing videos to be vertical by default

-- خطوة 1: تحديث جميع الفيديوهات التي is_vertical_video = NULL أو FALSE لتصبح TRUE
-- إلا إذا كنت تريد الإبقاء على بعضها عرضي

-- 1. تحديث الفيديوهات التي NULL (غير محددة) لتصبح طولية
UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video IS NULL;

-- 2. تحديث الفيديوهات التي FALSE (كانت عرضية) لتصبح طولية
-- ⚠️ تحذير: هذا سيحول جميع الفيديوهات العرضية لطولية
-- إذا كنت تريد الإبقاء على بعض الفيديوهات العرضية، احذف هذا الأمر
UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video = false;

-- تحقق من النتائج
SELECT 
  id,
  title,
  content_type,
  is_vertical_video,
  CASE 
    WHEN is_vertical_video = true THEN 'طولي (9:16)'
    WHEN is_vertical_video = false THEN 'عرضي (16:9)'
    ELSE 'غير محدد'
  END as orientation
FROM client_content
WHERE content_type = 'video'
ORDER BY created_at DESC;
