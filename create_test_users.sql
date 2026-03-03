-- =====================================================
-- إنشاء مستخدمين تجريبيين للاختبار
-- Create Test Users for Testing
-- =====================================================

-- مستخدم تجريبي 1
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
    '11111111-1111-1111-1111-111111111111',
    'user1@example.com',
    NOW(),
    '{"full_name": "أحمد محمد", "role": "user"}',
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'
) ON CONFLICT (email) DO NOTHING;

-- مستخدم تجريبي 2
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
    '22222222-2222-2222-2222-222222222222',
    'user2@example.com',
    NOW(),
    '{"full_name": "فاطمة علي", "role": "user"}',
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'
) ON CONFLICT (email) DO NOTHING;

-- إنشاء ملفات تعريف للمستخدمين
INSERT INTO profiles (
    id,
    full_name,
    email,
    phone,
    is_admin,
    created_at,
    updated_at
) VALUES 
    ('11111111-1111-1111-1111-111111111111', 'أحمد محمد', 'user1@example.com', '+966501234567', false, NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'فاطمة علي', 'user2@example.com', '+966507654321', false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ملاحظات:
-- 1. يجب تعيين كلمات المرور يدوياً من Supabase Dashboard
-- 2. كلمات المرور المقترحة: user123, user456
-- 3. يمكن إضافة المزيد من المستخدمين بنفس الطريقة
