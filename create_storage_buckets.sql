-- ═══════════════════════════════════════════════════════════════
-- إنشاء Storage Buckets وإعداد Policies
-- Create Storage Buckets and Setup Policies
-- ═══════════════════════════════════════════════════════════════

-- ⚠️ ملاحظة: هذا السكريبت يحتاج صلاحيات service_role
-- يمكنك تنفيذه من SQL Editor في Supabase Dashboard

-- ═══════════════════════════════════════════════════════════════
-- 1. إنشاء الـ Buckets (إذا لم تكن موجودة)
-- ═══════════════════════════════════════════════════════════════

-- Bucket للخدمات (Services)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'services',
    'services',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Bucket للأقسام/التخصصات (Sections/Specializations)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'sections',
    'sections',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Bucket للبانرات (Banners)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'banners',
    'banners',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE
SET 
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- ═══════════════════════════════════════════════════════════════
-- 2. حذف الـ Policies القديمة
-- ═══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public can view services" ON storage.objects;
DROP POLICY IF EXISTS "Auth can upload services" ON storage.objects;
DROP POLICY IF EXISTS "Auth can update services" ON storage.objects;
DROP POLICY IF EXISTS "Auth can delete services" ON storage.objects;

DROP POLICY IF EXISTS "Public can view sections" ON storage.objects;
DROP POLICY IF EXISTS "Auth can upload sections" ON storage.objects;
DROP POLICY IF EXISTS "Auth can update sections" ON storage.objects;
DROP POLICY IF EXISTS "Auth can delete sections" ON storage.objects;

DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Auth can delete banners" ON storage.objects;

-- ═══════════════════════════════════════════════════════════════
-- 3. إنشاء Policies جديدة للـ Storage
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Services Bucket Policies                                     │
-- └─────────────────────────────────────────────────────────────┘

-- القراءة العامة
CREATE POLICY "public_read_services_storage"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services');

-- الرفع للمستخدمين المسجلين
CREATE POLICY "auth_upload_services_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'services');

-- التحديث للمستخدمين المسجلين
CREATE POLICY "auth_update_services_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'services')
WITH CHECK (bucket_id = 'services');

-- الحذف للمستخدمين المسجلين
CREATE POLICY "auth_delete_services_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'services');

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Sections Bucket Policies                                     │
-- └─────────────────────────────────────────────────────────────┘

CREATE POLICY "public_read_sections_storage"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'sections');

CREATE POLICY "auth_upload_sections_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'sections');

CREATE POLICY "auth_update_sections_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'sections')
WITH CHECK (bucket_id = 'sections');

CREATE POLICY "auth_delete_sections_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'sections');

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Banners Bucket Policies                                      │
-- └─────────────────────────────────────────────────────────────┘

CREATE POLICY "public_read_banners_storage"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banners');

CREATE POLICY "auth_upload_banners_storage"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "auth_update_banners_storage"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners')
WITH CHECK (bucket_id = 'banners');

CREATE POLICY "auth_delete_banners_storage"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners');

-- ═══════════════════════════════════════════════════════════════
-- 4. التحقق من الـ Buckets
-- ═══════════════════════════════════════════════════════════════

SELECT 
    id,
    name,
    public,
    file_size_limit / 1024 / 1024 as max_size_mb,
    allowed_mime_types,
    created_at
FROM storage.buckets
WHERE id IN ('services', 'sections', 'banners')
ORDER BY name;

-- ═══════════════════════════════════════════════════════════════
-- 5. التحقق من الـ Policies
-- ═══════════════════════════════════════════════════════════════

SELECT 
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;

-- ═══════════════════════════════════════════════════════════════
-- ✅ تم! الآن يمكن رفع الصور من الأدمن
-- ✅ Done! Now you can upload images from admin panel
-- ═══════════════════════════════════════════════════════════════

/*
📝 ملاحظات:
- إذا ظهرت رسالة "permission denied" عند إنشاء الـ buckets
  يعني لازم تعملهم من Dashboard يدوياً:
  
  1. Supabase Dashboard → Storage
  2. New bucket
  3. Name: services (اجعله Public ✓)
  4. كرر للـ sections و banners
  
- بعد إنشاء الـ buckets، نفّذ باقي السكريبت للـ Policies
*/
