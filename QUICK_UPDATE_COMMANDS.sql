-- ═══════════════════════════════════════════════════════════════
-- تحديث سريع: جعل جميع الفيديوهات طولية افتراضياً
-- Quick Update: Make all videos vertical by default
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ الخيار 1: التحديث الآمن (موصى به)                         │
-- │ Safe Update - Only updates NULL values to vertical         │
-- └─────────────────────────────────────────────────────────────┘

-- تحديث الفيديوهات غير المحددة فقط
UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video IS NULL;


-- ┌─────────────────────────────────────────────────────────────┐
-- │ الخيار 2: التحديث الشامل (تحويل الكل لطولي)               │
-- │ Full Update - Converts ALL videos to vertical              │
-- └─────────────────────────────────────────────────────────────┘

-- ⚠️ تحذير: سيحول جميع الفيديوهات (حتى العرضية) لطولية
-- نفذ هذين الأمرين فقط إذا كنت متأكد

UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video IS NULL;

UPDATE client_content 
SET is_vertical_video = true
WHERE content_type = 'video' 
  AND is_vertical_video = false;


-- ┌─────────────────────────────────────────────────────────────┐
-- │ التحقق من النتائج                                          │
-- │ Verify Results                                              │
-- └─────────────────────────────────────────────────────────────┘

-- عرض جميع الفيديوهات
SELECT 
  id,
  title,
  is_vertical_video,
  CASE 
    WHEN is_vertical_video = true THEN '📱 طولي (9:16)'
    WHEN is_vertical_video = false THEN '💻 عرضي (16:9)'
    ELSE '❓ غير محدد'
  END as display_mode,
  created_at
FROM client_content
WHERE content_type = 'video'
ORDER BY created_at DESC;

-- إحصائيات
SELECT 
  CASE 
    WHEN is_vertical_video = true THEN '📱 طولي'
    WHEN is_vertical_video = false THEN '💻 عرضي'
    ELSE '❓ NULL'
  END as video_type,
  COUNT(*) as total_count
FROM client_content
WHERE content_type = 'video'
GROUP BY is_vertical_video
ORDER BY total_count DESC;


-- ┌─────────────────────────────────────────────────────────────┐
-- │ تحديثات يدوية (إذا احتجت)                                 │
-- │ Manual Updates (if needed)                                  │
-- └─────────────────────────────────────────────────────────────┘

-- تحويل فيديو معين لطولي
-- UPDATE client_content 
-- SET is_vertical_video = true
-- WHERE id = 'PASTE_VIDEO_ID_HERE';

-- تحويل فيديو معين لعرضي
-- UPDATE client_content 
-- SET is_vertical_video = false
-- WHERE id = 'PASTE_VIDEO_ID_HERE';


-- ┌─────────────────────────────────────────────────────────────┐
-- │ التراجع عن التحديث (إذا لزم الأمر)                        │
-- │ Rollback (if needed)                                        │
-- └─────────────────────────────────────────────────────────────┘

-- إعادة الكل لـ NULL
-- UPDATE client_content 
-- SET is_vertical_video = NULL
-- WHERE content_type = 'video';

-- ═══════════════════════════════════════════════════════════════
-- ✅ بعد التنفيذ: افتح الموقع وتحقق من معارض الأعمال
-- ✅ After execution: Open website and check work galleries
-- ═══════════════════════════════════════════════════════════════
