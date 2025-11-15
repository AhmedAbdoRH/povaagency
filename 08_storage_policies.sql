-- =====================================================
-- المرحلة 8: سياسات الأمان لـ Storage Buckets
-- Stage 8: Storage Buckets Security Policies
-- =====================================================

-- =====================================================
-- سياسات Bucket الصور العامة (images)
-- =====================================================

-- السماح للجميع بقراءة الصور
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'images');

-- السماح للمستخدمين المصادق عليهم برفع الصور
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images');

-- السماح للمستخدمين المصادق عليهم بتحديث صورهم
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'images' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين المصادق عليهم بحذف صورهم
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'images' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- =====================================================
-- سياسات Bucket صور المنتجات (products)
-- =====================================================

-- السماح للجميع بقراءة صور المنتجات
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'products');

-- السماح للمستخدمين المصادق عليهم برفع صور المنتجات
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'products');

-- السماح للمستخدمين المصادق عليهم بتحديث صور المنتجات
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
CREATE POLICY "Authenticated users can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'products' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'products' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين المصادق عليهم بحذف صور المنتجات
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;
CREATE POLICY "Authenticated users can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'products' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- =====================================================
-- سياسات Bucket البانرات (banners)
-- =====================================================

-- السماح للجميع بقراءة البانرات
DROP POLICY IF EXISTS "Public can view banners" ON storage.objects;
CREATE POLICY "Public can view banners"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'banners');

-- السماح للمستخدمين المصادق عليهم برفع البانرات
DROP POLICY IF EXISTS "Authenticated users can upload banners" ON storage.objects;
CREATE POLICY "Authenticated users can upload banners"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'banners');

-- السماح للمستخدمين المصادق عليهم بتحديث البانرات
DROP POLICY IF EXISTS "Authenticated users can update banners" ON storage.objects;
CREATE POLICY "Authenticated users can update banners"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'banners' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'banners' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين المصادق عليهم بحذف البانرات
DROP POLICY IF EXISTS "Authenticated users can delete banners" ON storage.objects;
CREATE POLICY "Authenticated users can delete banners"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'banners' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- =====================================================
-- سياسات Bucket الخدمات (services)
-- =====================================================

-- السماح للجميع بقراءة صور الخدمات
DROP POLICY IF EXISTS "Public can view service images" ON storage.objects;
CREATE POLICY "Public can view service images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'services');

-- السماح للمستخدمين المصادق عليهم برفع صور الخدمات
DROP POLICY IF EXISTS "Authenticated users can upload service images" ON storage.objects;
CREATE POLICY "Authenticated users can upload service images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'services');

-- السماح للمستخدمين المصادق عليهم بتحديث صور الخدمات
DROP POLICY IF EXISTS "Authenticated users can update service images" ON storage.objects;
CREATE POLICY "Authenticated users can update service images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'services' AND owner = auth.uid())
    WITH CHECK (bucket_id = 'services' AND owner = auth.uid());

-- السماح للمستخدمين المصادق عليهم بحذف صور الخدمات
DROP POLICY IF EXISTS "Authenticated users can delete service images" ON storage.objects;
CREATE POLICY "Authenticated users can delete service images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'services' AND owner = auth.uid());

-- =====================================================
-- سياسات Bucket التحميلات (downloads)
-- =====================================================

-- السماح للمستخدمين المصادق عليهم بقراءة الملفات
DROP POLICY IF EXISTS "Authenticated users can download files" ON storage.objects;
CREATE POLICY "Authenticated users can download files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'downloads');

-- السماح للمستخدمين المصادق عليهم برفع الملفات
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'downloads');

-- السماح للمستخدمين بتحديث ملفاتهم الخاصة
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
CREATE POLICY "Users can update their own files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'downloads' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'downloads' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين بحذف ملفاتهم الخاصة
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'downloads' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- =====================================================
-- سياسات Bucket الصور الشخصية (avatars)
-- =====================================================

-- السماح للجميع بقراءة الصور الشخصية
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

-- السماح للمستخدمين برفع صورهم الشخصية
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- السماح للمستخدمين بتحديث صورهم الشخصية
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'avatars' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'avatars' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين بحذف صورهم الشخصية
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- =====================================================
-- سياسات Bucket ملفات التصميم (designs)
-- =====================================================

-- السماح للمستخدمين المصادق عليهم بقراءة ملفات التصميم
DROP POLICY IF EXISTS "Authenticated users can view design files" ON storage.objects;
CREATE POLICY "Authenticated users can view design files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'designs');

-- السماح للمستخدمين المصادق عليهم برفع ملفات التصميم
DROP POLICY IF EXISTS "Authenticated users can upload design files" ON storage.objects;
CREATE POLICY "Authenticated users can upload design files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'designs');

-- السماح للمستخدمين بتحديث ملفات التصميم الخاصة بهم
DROP POLICY IF EXISTS "Users can update their own design files" ON storage.objects;
CREATE POLICY "Users can update their own design files"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'designs' AND owner IS NOT NULL AND owner = auth.uid()::text)
    WITH CHECK (bucket_id = 'designs' AND owner IS NOT NULL AND owner = auth.uid()::text);

-- السماح للمستخدمين بحذف ملفات التصميم الخاصة بهم
DROP POLICY IF EXISTS "Users can delete their own design files" ON storage.objects;
CREATE POLICY "Users can delete their own design files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'designs' AND owner IS NOT NULL AND owner = auth.uid()::text);

