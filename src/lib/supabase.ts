import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - يمكن تغييرها حسب الحاجة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gcihufexgwfifpfddgmb.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaWh1ZmV4Z3dmaWZwZmRkZ21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTEwOTYsImV4cCI6MjA3ODU4NzA5Nn0.41t-_ttYd2SFGGeyWmbjqn00BIYOF0TLWoxZof_JWuw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug logging to verify connection
console.log('🔗 Supabase Connected to:', supabaseUrl);
console.log('🔑 Using Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaWh1ZmV4Z3dmaWZwZmRkZ21iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAxMTA5NiwiZXhwIjoyMDc4NTg3MDk2fQ._oQzBv48CHYTwjvoCWBKj4ZZ4bwWzu9VqebqLQoulJw");