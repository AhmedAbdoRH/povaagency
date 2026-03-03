// =====================================================
// إنشاء مستخدم admin باستخدام API
// Create Admin User using API
// =====================================================

const SUPABASE_URL = 'https://xijyciccygbdwudehdoa.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMzNjIyNSwiZXhwIjoyMDg3OTEyMjI1fQ.okK-fr8o8rmJlSkLrehufxjAYPi98JwTosN6W372ckM';

async function createAdminUser() {
  try {
    // إنشاء مستخدم جديد
    const { data, error } = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@povaagency.com',
        password: 'admin123',
        email_confirm: true,
        user_metadata: {
          name: 'Admin User',
          role: 'admin'
        },
        app_metadata: {
          provider: 'email',
          providers: ['email']
        }
      })
    }).then(res => res.json());

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('Admin user created successfully:', data);

    // تحديث جدول profiles
    const profileData = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: data.id,
        full_name: 'Admin User',
        email: 'admin@povaagency.com',
        is_admin: true
      })
    }).then(res => res.json());

    console.log('Profile created:', profileData);
    console.log('✅ Admin user setup complete!');
    console.log('📧 Email: admin@povaagency.com');
    console.log('🔑 Password: admin123');

  } catch (error) {
    console.error('Error:', error);
  }
}

// تنفيذ الدالة
createAdminUser();
