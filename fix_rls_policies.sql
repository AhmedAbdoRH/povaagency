-- ═══════════════════════════════════════════════════════════════
-- إصلاح RLS Policies - السماح بالقراءة العامة
-- Fix RLS Policies - Allow Public Read Access
-- ═══════════════════════════════════════════════════════════════

-- ⚠️ هذا الملف يحل مشكلة 401 Unauthorized عند قراءة البيانات

-- ═══════════════════════════════════════════════════════════════
-- 1. حذف الـ Policies القديمة (إن وجدت)
-- ═══════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Public can view store settings" ON store_settings;
DROP POLICY IF EXISTS "Public can view pages" ON pages;
DROP POLICY IF EXISTS "Public can view active pages" ON pages;
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Public can view active banners" ON banners;
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Public can view active services" ON services;
DROP POLICY IF EXISTS "Public can view specializations" ON specializations;
DROP POLICY IF EXISTS "Public can view active specializations" ON specializations;
DROP POLICY IF EXISTS "Public can view clients" ON clients;
DROP POLICY IF EXISTS "Public can view active clients" ON clients;
DROP POLICY IF EXISTS "Public can view client content" ON client_content;
DROP POLICY IF EXISTS "Public can view active client content" ON client_content;

-- ═══════════════════════════════════════════════════════════════
-- 2. إنشاء Policies جديدة للقراءة العامة
-- ═══════════════════════════════════════════════════════════════

-- Store Settings (القراءة للجميع)
CREATE POLICY "Public can view store settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

-- Pages (القراءة للجميع)
CREATE POLICY "Public can view pages"
  ON pages FOR SELECT
  TO public
  USING (true);

-- Banners (القراءة للجميع)
CREATE POLICY "Public can view banners"
  ON banners FOR SELECT
  TO public
  USING (true);

-- Services (القراءة للجميع)
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  TO public
  USING (true);

-- Specializations (القراءة للجميع)
CREATE POLICY "Public can view specializations"
  ON specializations FOR SELECT
  TO public
  USING (true);

-- Clients (القراءة للجميع)
CREATE POLICY "Public can view clients"
  ON clients FOR SELECT
  TO public
  USING (true);

-- Client Content (القراءة للجميع)
CREATE POLICY "Public can view client content"
  ON client_content FOR SELECT
  TO public
  USING (true);

-- ═══════════════════════════════════════════════════════════════
-- 3. Policies للكتابة (المستخدمين المسجلين فقط)
-- ═══════════════════════════════════════════════════════════════

-- Store Settings
DROP POLICY IF EXISTS "Authenticated can manage store settings" ON store_settings;
CREATE POLICY "Authenticated can manage store settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pages
DROP POLICY IF EXISTS "Authenticated can manage pages" ON pages;
CREATE POLICY "Authenticated can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Banners
DROP POLICY IF EXISTS "Authenticated can manage banners" ON banners;
CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services
DROP POLICY IF EXISTS "Authenticated can manage services" ON services;
CREATE POLICY "Authenticated can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Specializations
DROP POLICY IF EXISTS "Authenticated can manage specializations" ON specializations;
CREATE POLICY "Authenticated can manage specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients
DROP POLICY IF EXISTS "Authenticated can manage clients" ON clients;
CREATE POLICY "Authenticated can manage clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Client Content
DROP POLICY IF EXISTS "Authenticated can manage client content" ON client_content;
CREATE POLICY "Authenticated can manage client content"
  ON client_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 4. التحقق من الـ Policies
-- ═══════════════════════════════════════════════════════════════

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════
-- ✅ بعد التنفيذ: جرب الموقع مرة أخرى
-- ✅ After execution: Try the website again
-- ═══════════════════════════════════════════════════════════════
