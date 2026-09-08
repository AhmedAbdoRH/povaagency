-- ═══════════════════════════════════════════════════════════════
-- حذف قوي لجميع الـ RLS Policies
-- Force Delete All RLS Policies
-- ═══════════════════════════════════════════════════════════════

-- هذا السكريبت يحذف كل الـ policies بطريقة ديناميكية

DO $$
DECLARE
    pol RECORD;
BEGIN
    -- حذف كل الـ policies من الجداول العامة
    FOR pol IN 
        SELECT 
            schemaname,
            tablename,
            policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, 
            pol.schemaname, 
            pol.tablename
        );
        RAISE NOTICE 'Dropped policy: % on %.%', pol.policyname, pol.schemaname, pol.tablename;
    END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- إنشاء Policies جديدة نظيفة
-- ═══════════════════════════════════════════════════════════════

-- Banners
CREATE POLICY "public_read_banners"
  ON banners FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Client Content
CREATE POLICY "public_read_client_content"
  ON client_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_client_content"
  ON client_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients
CREATE POLICY "public_read_clients"
  ON clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Pages
CREATE POLICY "public_read_pages"
  ON pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services
CREATE POLICY "public_read_services"
  ON services FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Specializations
CREATE POLICY "public_read_specializations"
  ON specializations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Store Settings
CREATE POLICY "public_read_store_settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "auth_full_store_settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- التحقق من النتيجة
-- ═══════════════════════════════════════════════════════════════

SELECT 
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════
-- ✅ تم! يجب أن يكون لكل جدول policy واحدة للقراءة وواحدة للكتابة
-- ✅ Done! Each table should have exactly 2 policies (read + write)
-- ═══════════════════════════════════════════════════════════════
