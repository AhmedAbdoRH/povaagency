-- =====================================================
-- المرحلة 1: Extensions والجداول الأساسية
-- Stage 1: Extensions and Basic Tables
-- =====================================================

-- تفعيل UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. إنشاء جدول الفئات الرئيسية (Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. إنشاء جدول الفئات الفرعية (Subcategories)
-- =====================================================
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT,
    description_en TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. إنشاء جدول المنتجات/الخدمات (Services/Products)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    gallery TEXT[], -- Array of image URLs
    price NUMERIC,
    sale_price NUMERIC,
    has_multiple_sizes BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    weight DECIMAL(10,2),
    dimensions TEXT, -- مثل "30x20x15 سم"
    material TEXT,
    color TEXT,
    brand TEXT,
    dst_file_url TEXT NULL,
    emb_file_url TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. إنشاء جدول أحجام المنتجات (Product Sizes)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. إنشاء جدول صور المنتجات (Product Images)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. إنشاء جدول البانرات (Banners)
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
-- 7. إنشاء جدول إعدادات المتجر (Store Settings)
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
-- 8. إنشاء جدول الشهادات (Testimonials)
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_image_url TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

