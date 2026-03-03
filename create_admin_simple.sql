-- =====================================================
-- إنشاء مستخدم admin باستخدام service_role
-- Create Admin User using Service Role
-- =====================================================

-- استخدام service_role لإنشاء مستخدم admin
-- هذا الأمر يستخدم مفتاح service_role الذي لديك

-- إنشاء مستخدم في جدول auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    email,
    email_confirmed_at,
    raw_user_meta_data,
    is_super_admin,
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
    false,
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

-- إنشاء كلمة مرور للمستخدم
-- ملاحظة: يجب تعيين كلمة المرور يدوياً من Dashboard
-- أو استخدام RPC function

SELECT 'Admin user created successfully!' as result;
