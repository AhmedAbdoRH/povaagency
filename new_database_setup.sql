-- =====================================================
-- إعداد قاعدة البيانات الجديد لموقع POVA Agency
-- New Database Setup for POVA Agency Website
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. إنشاء جدول الصفحات (Pages) - الأقسام الرئيسية
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT, -- الصورة الرئيسية المربعة (تُعرض في الموقع من الخارج)
    banner_url TEXT, -- البانر (يُعرض في الصفحة من الداخل)
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. إنشاء جدول الخدمات (Services) - المستوى الثاني
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. إنشاء جدول التخصصات (Specializations) - المستوى الثالث
-- =====================================================
CREATE TABLE IF NOT EXISTS specializations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. إنشاء جدول العملاء (Clients) - الكروت/المنتجات
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. إنشاء جدول محتوى العملاء (Client Content)
-- =====================================================
CREATE TABLE IF NOT EXISTS client_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    content_type TEXT NOT NULL DEFAULT 'image' CHECK (content_type IN ('image', 'video', 'text')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. إنشاء جدول البانرات (Banners) مع page_id
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'text', 'strip')),
    title TEXT,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- Strip banner specific properties
    strip_text_color TEXT,
    strip_background_color TEXT,
    strip_position TEXT CHECK (strip_position IN ('above_main', 'below_main')),
    -- Date range for banner display
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. إنشاء جدول إعدادات المتجر (Store Settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_name TEXT,
    store_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    og_image_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    -- Social Media URLs
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    snapchat_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    whatsapp_url TEXT,
    -- Contact Information
    phone TEXT,
    email TEXT,
    address TEXT,
    -- Theme Settings (JSON)
    theme_settings JSONB DEFAULT '{}',
    -- Additional Settings
    show_testimonials BOOLEAN DEFAULT false,
    currency TEXT DEFAULT 'EGP',
    language TEXT DEFAULT 'ar',
    timezone TEXT DEFAULT 'Africa/Cairo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. إنشاء جدول المستخدمين (User Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Egypt',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. إنشاء جدول المفضلة (Wishlist)
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    service_id TEXT, -- Will store client ID as text for flexibility
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);

-- =====================================================
-- إنشاء الفهارس (Indexes) لتحسين الأداء
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);
CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(display_order);

CREATE INDEX IF NOT EXISTS idx_services_page_id ON services(page_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

CREATE INDEX IF NOT EXISTS idx_specializations_service_id ON specializations(service_id);
CREATE INDEX IF NOT EXISTS idx_specializations_active ON specializations(is_active);

CREATE INDEX IF NOT EXISTS idx_clients_specialization_id ON clients(specialization_id);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);

CREATE INDEX IF NOT EXISTS idx_client_content_client_id ON client_content(client_id);
CREATE INDEX IF NOT EXISTS idx_client_content_active ON client_content(is_active);

CREATE INDEX IF NOT EXISTS idx_banners_page_id ON banners(page_id);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_type ON banners(type);

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);

-- =====================================================
-- إنشاء الدوال المساعدة (Helper Functions)
-- =====================================================

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- دالة إنشاء ملف تعريف المستخدم الجديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- إنشاء الـ Triggers
-- =====================================================

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specializations_updated_at
    BEFORE UPDATE ON specializations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_content_updated_at
    BEFORE UPDATE ON client_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- تفعيل Row Level Security (RLS)
-- =====================================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- إنشاء سياسات الأمان (Security Policies)
-- =====================================================

-- Pages policies
CREATE POLICY "Public can view active pages"
  ON pages FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services policies
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Specializations policies
CREATE POLICY "Public can view active specializations"
  ON specializations FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage specializations"
  ON specializations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Clients policies
CREATE POLICY "Public can view active clients"
  ON clients FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Client Content policies
CREATE POLICY "Public can view active client content"
  ON client_content FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage client content"
  ON client_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Banners policies
CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT
  TO public
  USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Store settings policies
CREATE POLICY "Public can view store settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can manage store settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- إدراج البيانات الافتراضية (Default Data)
-- =====================================================

-- إدراج إعدادات المتجر الافتراضية
INSERT INTO store_settings (
    id,
    store_name,
    store_description,
    meta_title,
    meta_description,
    phone,
    whatsapp_url,
    theme_settings,
    currency,
    language,
    timezone
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'POVA Agency',
    'وكالة تسويق رقمي متكاملة',
    'POVA | وكالة تسويق رقمي',
    'نقدم حلول تسويقية مبتكرة لتنمية أعمالك',
    '+20 100 646 4349',
    'https://wa.me/201006464349',
    '{
        "primaryColor": "#000000",
        "secondaryColor": "#1a1a1a",
        "fontFamily": "Cairo, sans-serif",
        "backgroundColor": "#000000",
        "backgroundGradient": ""
    }'::jsonb,
    'EGP',
    'ar',
    'Africa/Cairo'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- إنهاء الإعداد
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'تم إنشاء قاعدة البيانات الجديدة بنجاح!';
    RAISE NOTICE 'الجداول المنشأة: pages, services, specializations, clients, banners, store_settings, profiles, wishlist';
END $$;
