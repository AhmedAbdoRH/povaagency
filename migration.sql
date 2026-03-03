-- 1. Rename Categories to Pages
ALTER TABLE categories RENAME TO pages;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Rename Subcategories to Specializations
ALTER TABLE subcategories RENAME TO specializations;
ALTER TABLE specializations RENAME COLUMN category_id TO page_id;

-- 3. Create Clients Table (Replacing Products/Services concept)
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS for Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active clients" ON clients
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Authenticated can manage clients" ON clients
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Update Banners Table
ALTER TABLE banners ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES pages(id) ON DELETE SET NULL;
