-- =====================================================
-- المرحلة 6: إدراج البيانات الافتراضية
-- Stage 6: Insert Default Data
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
    'POVA',
    'شركة تسويق إلكتروني متكاملة تقدم خدمات تحليل البيانات، تصميم الهوية البصرية، كتابة المحتوى الإبداعي، التصوير الفوتوغرافي، الموشن جرافيك، إدارة الحملات الإعلانية وإدارة وسائل التواصل الاجتماعي',
    'POVA | شركة تسويق متكاملة لتصميم الهوية وإنتاج المحتوى والإعلانات',
    'POVA شركة تسويق إلكتروني متكاملة تقدم خدمات تحليل البيانات، تصميم الهوية البصرية، كتابة المحتوى الإبداعي، التصوير الفوتوغرافي، الموشن جرافيك، إدارة الحملات الإعلانية وإدارة وسائل التواصل الاجتماعي لنجاح علامتك التجارية.',
    '+20 100 646 4349',
    'https://wa.me/message/IUSOLSYPTTE6G1',
    '{
        "primaryColor": "#ee5239",
        "secondaryColor": "#fff",
        "fontFamily": "Cairo, sans-serif",
        "backgroundColor": "#000",
        "backgroundGradient": "linear-gradient(135deg, #182441 0%, #1a1a2e 100%)"
    }'::jsonb,
    'EGP',
    'ar',
    'Africa/Cairo'
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    store_description = EXCLUDED.store_description,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    phone = EXCLUDED.phone,
    whatsapp_url = EXCLUDED.whatsapp_url,
    theme_settings = EXCLUDED.theme_settings,
    currency = EXCLUDED.currency,
    language = EXCLUDED.language,
    timezone = EXCLUDED.timezone;

-- إضافة تعليقات للتوثيق
COMMENT ON TABLE categories IS 'جدول الفئات الرئيسية للمنتجات';
COMMENT ON TABLE subcategories IS 'جدول الفئات الفرعية للمنتجات';
COMMENT ON TABLE services IS 'جدول المنتجات والخدمات';
COMMENT ON TABLE product_sizes IS 'جدول أحجام المنتجات المختلفة';
COMMENT ON TABLE product_images IS 'جدول صور المنتجات';
COMMENT ON TABLE banners IS 'جدول البانرات والإعلانات';
COMMENT ON TABLE store_settings IS 'جدول إعدادات المتجر';
COMMENT ON TABLE testimonials IS 'جدول شهادات العملاء';
COMMENT ON TABLE profiles IS 'جدول ملفات المستخدمين';
COMMENT ON TABLE orders IS 'جدول الطلبات';
COMMENT ON TABLE order_items IS 'جدول تفاصيل الطلبات';
COMMENT ON TABLE coupons IS 'جدول الكوبونات والخصومات';
COMMENT ON TABLE product_reviews IS 'جدول مراجعات المنتجات';
COMMENT ON TABLE wishlist IS 'جدول قائمة المفضلة';
COMMENT ON TABLE cart_items IS 'جدول عربة التسوق';
COMMENT ON TABLE downloads IS 'جدول التحميلات';


