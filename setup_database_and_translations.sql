-- =====================================================
-- إعداد قاعدة البيانات وإضافة الترجمات الإنجليزية
-- Setup database and add English translations
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. إنشاء جدول الصفحات (Pages) - الأقسام الرئيسية
-- =====================================================
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
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
    name_en TEXT,
    description TEXT,
    description_en TEXT,
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
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. إنشاء جدول العملاء (Clients) - المستوى الرابع
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    image_url TEXT,
    logo_url TEXT,
    project_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. إنشاء جدول محتوى العملاء (Client Content)
-- =====================================================
CREATE TABLE IF NOT EXISTS client_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    video_url TEXT,
    content_type TEXT CHECK (content_type IN ('image', 'video', 'text')) DEFAULT 'image',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. إنشاء جدول البانرات (Banners)
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT CHECK (type IN ('image', 'text', 'strip')) DEFAULT 'image',
    title TEXT,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    strip_text_color TEXT,
    strip_background_color TEXT,
    strip_position TEXT CHECK (strip_position IN ('above_main', 'below_main')),
    page_id UUID REFERENCES pages(id) ON DELETE SET NULL
);

-- =====================================================
-- 7. إدخال بيانات الخدمات الأساسية
-- =====================================================
INSERT INTO pages (name, name_en, description, description_en, display_order) VALUES
('استراتيجية التسويق', 'Marketing Strategy', 'صياغة استراتيجيات تسويقية متكاملة توجه قرارات النمو وتمنح مشروعك مسارًا واضحًا وقابلًا للتنفيذ.', 'Formulating integrated marketing strategies that guide growth decisions and give your project a clear and executable path.', 1),
('صناعة المحتوى', 'Content Creation', 'إنتاج محتوى يعبّر عن هويتك ويخاطب جمهورك بالشكل المناسب لكل منصة ومرحلة من رحلة العميل.', 'Producing content that expresses your identity and addresses your audience appropriately for each platform and stage of the customer journey.', 2),
('تصوير الفيديو', 'Video Production', 'تنفيذ فيديوهات احترافية للإعلانات والمحتوى الترويجي والرسائل البصرية التي تعكس قيمة مشروعك.', 'Executing professional videos for advertisements, promotional content, and visual messages that reflect your project value.', 3),
('الإنتاج الإعلامي', 'Media Production', 'خدمات إنتاج متكاملة تشمل التخطيط والتنفيذ وما بعد الإنتاج لتقديم مخرجات جاهزة للنشر والتوزيع.', 'Integrated production services including planning, execution, and post-production to deliver outputs ready for publishing and distribution.', 4),
('بناء الهوية التجارية', 'Brand Identity', 'تصميم هوية بصرية متماسكة تمنح علامتك شخصية واضحة وتترك انطباعًا احترافيًا ومستدامًا.', 'Designing a cohesive visual identity that gives your brand a clear personality and leaves a professional and sustainable impression.', 5),
('تصميم المواقع', 'Website Design', 'تصميم وتطوير مواقع حديثة وسريعة ومقنعة تساعد على تحويل الزيارات إلى فرص وعملاء محتملين.', 'Designing and developing modern, fast, and impressive websites that help convert visits into opportunities and potential clients.', 6),
('حملات السوشيال ميديا', 'Social Media Campaigns', 'إدارة الحملات والمحتوى والإعلانات على منصات التواصل لبناء حضور فعّال وتحقيق نتائج قابلة للقياس.', 'Managing campaigns, content, and advertisements on social platforms to build effective presence and achieve measurable results.', 7),
('تصميم المنشورات', 'Post Design', 'ابتكار تصاميم منشورات احترافية ومتسقة مع الهوية لتدعم المحتوى وتزيد من قوة الحضور البصري.', 'Creating professional and identity-consistent post designs to support content and enhance visual presence power.', 8),
('التصوير الفوتوغرافي', 'Photography', 'تصوير احترافي للمنتجات والفرق والأحداث والمواد التسويقية بما يرفع جودة الانطباع البصري للمشروع.', 'Professional photography of products, teams, events, and marketing materials to elevate the visual impression quality of the project.', 9)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. إدخال الخدمات (Services) المرتبطة بالصفحات
-- =====================================================
INSERT INTO services (page_id, name, name_en, description, description_en, display_order)
SELECT 
    id,
    name,
    name_en,
    description,
    description_en,
    0
FROM pages
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. عرض البيانات المدخلة للتأكيد
-- =====================================================
SELECT 
    'pages' as table_name,
    name,
    name_en,
    LEFT(description, 50) as description_ar,
    LEFT(description_en, 50) as description_en
FROM pages 

UNION ALL

SELECT 
    'services' as table_name,
    name,
    name_en,
    LEFT(description, 50) as description_ar,
    LEFT(description_en, 50) as description_en
FROM services 

ORDER BY table_name, name;
