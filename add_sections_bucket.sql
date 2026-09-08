-- ═══════════════════════════════════════════════════════════════
-- إنشاء Storage Bucket للأقسام (sections/thumbnails)
-- Create storage bucket for section video thumbnails
-- ═══════════════════════════════════════════════════════════════

-- ملاحظة: هذا الأمر يُنفذ من Supabase Dashboard > Storage > New Bucket
-- أو يمكنك استخدام CLI: supabase storage bucket create sections

-- إذا أردت إنشاؤه via SQL، تحتاج لدور service_role (غير متاح مباشرة)

-- ═══════════════════════════════════════════════════════════════
-- إعدادات الـ Bucket المطلوبة:
-- ═══════════════════════════════════════════════════════════════
-- Bucket Name: sections
-- Public: Yes (علني للوصول للصور)
-- Allowed MIME Types: image/*
-- File Size Limit: 2MB (كافية للصور)
-- ═══════════════════════════════════════════════════════════════

-- التحقق من وجود الـ Bucket (إذا كان لديك صلاحية)
SELECT name, public
FROM storage.buckets
WHERE name = 'sections';

-- ═══════════════════════════════════════════════════════════════
-- إضافة Policy للـ Bucket (السماح للجميع بالقراءة)
-- ═══════════════════════════════════════════════════════════════

-- Policy للقراءة العامة
-- CREATE POLICY "Public Access" ON storage.objects
--   FOR SELECT
--   USING ( bucket_id = 'sections' );

-- Policy للـ Upload (للمستخدمين المسجلين فقط)
-- CREATE POLICY "Auth Upload" ON storage.objects
--   FOR INSERT
--   WITH CHECK ( bucket_id = 'sections' AND auth.role() = 'authenticated' );