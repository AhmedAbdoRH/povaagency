import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - استخدام الإعدادات الافتراضية للمشروع لضمان عمل الموقع حتى في بيئات النشر الثابت
const DEFAULT_SUPABASE_URL = 'https://xijyciccygbdwudehdoa.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzYyMjUsImV4cCI6MjA4NzkxMjIyNX0.RoOE0zWudd4dDekgVtMvoOd1Qdd3uRFJ2k4WWTETu70';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug logging to verify connection
if (import.meta.env.VITE_SUPABASE_URL) {
  console.log('🔗 Supabase Connected to:', supabaseUrl);
} else {
  console.warn('⚠️ Supabase environment variables not detected; running in standalone mode.');
}

// Service role client for admin operations (use with caution)
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;