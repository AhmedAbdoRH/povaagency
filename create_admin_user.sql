-- =====================================================
-- إنشاء مستخدم admin افتراضي
-- Create Default Admin User
-- =====================================================

-- إنشاء مستخدم admin في جدول auth.users
-- هذا الأمر يجب تنفيذه يدوياً من Supabase Dashboard
-- أو يمكن استخدام RPC function

-- إنشاء RPC function لإنشاء مستخدم admin
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- إنشاء مستخدم جديد
    INSERT INTO auth.users (
        instance_id,
        id,
        email,
        email_confirmed_at,
        phone,
        phone_confirmed_at,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        last_sign_in_at,
        app_metadata
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'admin@povaagency.com',
        NOW(),
        NULL,
        NULL,
        '{"name": "Admin User"}',
        false,
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO admin_user_id;
    
    -- تحديث is_admin في جدول profiles إذا كان موجوداً
    IF admin_user_id IS NOT NULL THEN
        UPDATE profiles 
        SET is_admin = true 
        WHERE email = 'admin@povaagency.com';
    END IF;
END;
$$;

-- تنفيذ الدالة
SELECT create_admin_user();

-- حذف الدالة بعد الاستخدام
DROP FUNCTION create_admin_user();

-- ملاحظات:
-- 1. كلمة المرور الافتراضية: admin123
-- 2. يجب تغيير كلمة المرور بعد أول تسجيل دخول
-- 3. يمكن إنشاء المستخدم يدوياً من Supabase Dashboard > Authentication > Users
