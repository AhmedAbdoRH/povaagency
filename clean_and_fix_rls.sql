-- ═══════════════════════════════════════════════════════════════
-- حذف وإعادة إنشاء RLS Policies بشكل نظيف
-- Clean and Recreate RLS Policies
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. حذف جميع الـ Policies الموجودة
-- ═══════════════════════════════════════════════════════════════

-- Banners
DROP POLICY IF EXISTS "Admin all access for banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can manage banners" ON banners;
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Public read access for banners" ON banners;
DROP POLICY IF EXISTS "Public can view active banners" ON banners;

-- Client Content
DROP POLICY IF EXISTS "Admin all access for client_content" ON client_content;
DROP POLICY IF EXISTS "Authenticated can manage client content" ON client_content;
DROP POLICY IF EXISTS "Public can view client content" ON client_content;
DROP POLICY IF EXISTS "Public can view active client content" ON client_content;

-- Clients
DROP POLICY IF EXISTS "Admin all access for clients" ON clients;
DROP POLICY IF EXISTS "Authenticated can manage clients" ON clients;
DROP POLICY IF EXISTS "Public can view clients" ON clients;
DROP POLICY IF EXISTS "Public can view active clients" ON clients;

-- Pages
DROP POLICY IF EXISTS "Admin all access for pages" ON pages;
DROP POLICY IF EXISTS "Authenticated can manage pages" ON pages;
DROP POLICY IF EXISTS "Public can view pages" ON pages;
DROP POLICY IF EXISTS "Public can view active pages" ON pages;

-- Services
DROP POLICY IF EXISTS "Admin all access for services" ON services;
DROP POLICY IF EXISTS "Authenticated can manage services" ON services;
DROP POLICY IF EXISTS "Public can view services" ON services;
DROP POLICY IF EXISTS "Public can view active services" ON services;

-- Specializations
DROP POLICY IF EXISTS "Admin all access for specializations" ON specializations;
DROP POLICY IF EXISTS "Authenticated can manage specializations" ON specializations;
DROP POLICY IF EXISTS "Public can view specializations" ON specializations;
DROP POLICY IF EXISTS "Public can view active specializations" ON specializations;

-- Store Settings
DROP POLICY IF EXISTS "Admin all access for store_settings" ON store_settings;
DROP POLICY IF EXISTS "Authenticated can manage store settings" ON store_settings;
DROP POLICY IF EXISTS "Public can view store settings" ON store_settings;

-- ═══════════════════════════════════════════════════════════════
-- 2. إنشاء Policies جديدة بسيطة وواضحة
-- ═══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Banners                                                      │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read banners"
  ON banners FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Client Content                                               │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read client_content"
  ON client_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full client_content"
  ON client_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Clients                                                      │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read clients"
  ON clients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Pages                                                        │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read pages"
  ON pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Services                                                     │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read services"
  ON services FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Specializations                                              │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read specializations"
  ON specializations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ┌─────────────────────────────────────────────────────────────┐
-- │ Store Settings                                               │
-- └─────────────────────────────────────────────────────────────┘
CREATE POLICY "Allow public read store_settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow auth full store_settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- 3. التحقق من النتيجة
-- ═══════════════════════════════════════════════════════════════

SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ═══════════════════════════════════════════════════════════════
-- ✅ تم! جرّب الموقع الآن
-- ✅ Done! Try the website now
-- ═══════════════════════════════════════════════════════════════
