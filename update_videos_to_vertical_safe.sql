-- تحديث آمن: فقط الفيديوهات الغير محددة (NULL) تصبح طولية
-- Safe update: Only unspecified videos (NULL) become vertical
-- الفيديوهات العرضية الموجودة (FALSE) تبقى كما هي

-- تحديث فقط الفيديوهات التي is_vertical_video = NULL
UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video IS NULL;

-- تحقق من النتائج
SELECT 
  id,
  title,
  content_type,
  is_vertical_video,
  CASE 
    WHEN is_vertical_video = true THEN '✅ طولي (9:16)'
    WHEN is_vertical_video = false THEN '📺 عرضي (16:9)'
    ELSE '❓ غير محدد'
  END as orientation,
  created_at
FROM client_content
WHERE content_type = 'video'
ORDER BY created_at DESC;

-- إحصائيات
SELECT 
  is_vertical_video,
  COUNT(*) as count,
  CASE 
    WHEN is_vertical_video = true THEN 'طولي'
    WHEN is_vertical_video = false THEN 'عرضي'
    ELSE 'غير محدد'
  END as orientation_name
FROM client_content
WHERE content_type = 'video'
GROUP BY is_vertical_video;
