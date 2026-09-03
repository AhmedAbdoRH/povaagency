import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - يمكن تغييرها حسب الحاجة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

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