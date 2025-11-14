import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - يمكن تغييرها حسب الحاجة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ovpdsywjaackqxtkksel.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGRzeXdqYWFja3F4dGtrc2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDgwMzYsImV4cCI6MjA3ODUyNDAzNn0.Z1Usun-2xDflndIbKK6r0qQCQvv6Ck3_0z9TmMTVtu8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug logging to verify connection
console.log('🔗 Supabase Connected to:', supabaseUrl);
console.log('🔑 Using Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGRzeXdqYWFja3F4dGtrc2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0ODAzNiwiZXhwIjoyMDc4NTI0MDM2fQ.mTiAfZq2g58FqggBtB8SG2B2Jvuvdu9yPGdiA23bOWE");