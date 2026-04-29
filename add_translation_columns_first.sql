-- =====================================================
-- إضافة أعمدة الترجمة أولاً قبل الترجمة
-- Add translation columns first before translating
-- =====================================================

-- إضافة أعمدة الترجمة لجدول pages
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- إضافة أعمدة الترجمة لجدول services  
ALTER TABLE services
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- إضافة أعمدة الترجمة لجدول specializations
ALTER TABLE specializations
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- إضافة أعمدة الترجمة لجدول clients
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- عرض الأعمدة المضافة للتأكيد
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('pages', 'services', 'specializations', 'clients')
    AND column_name IN ('name_en', 'description_en')
ORDER BY table_name, column_name;
