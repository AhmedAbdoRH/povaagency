-- =====================================================
-- إعداد مستخدم admin افتراضي
-- Setup Default Admin User
-- =====================================================

-- إنشاء مستخدم admin مباشرة
-- ملاحظة: هذا الأمر يعمل فقط إذا كان لديك صلاحيات service_role
INSERT INTO auth.users (
    instance_id,
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    last_sign_in_at,
    app_metadata
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'admin@povaagency.com',
    NOW(),
    '{"name": "Admin User", "role": "admin"}',
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'
) ON CONFLICT (email) DO NOTHING;

-- إنشاء إدخال في جدول profiles
INSERT INTO profiles (
    id,
    full_name,
    email,
    is_admin,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Admin User',
    'admin@povaagency.com',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- تحديث كلمة المرور (يجب عملها يدوياً من Dashboard)
-- أو استخدام RPC function

-- =====================================================
-- تعليمات الإعداد:
-- 1. نفذ هذا الكود في SQL Editor
-- 2. اذهب إلى Authentication > Users
-- 3. ابحث عن admin@povaagency.com
-- 4. اضغط Reset Password وحدد: admin123
-- 5. تأكد أن Email Confirmed = true
-- =====================================================
