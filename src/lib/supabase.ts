import { createClient } from '@supabase/supabase-js';

// إعدادات Supabase - يمكن تغييرها حسب الحاجة
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xijyciccygbdwudehdoa.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzYyMjUsImV4cCI6MjA4NzkxMjIyNX0.RoOE0zWudd4dDekgVtMvoOd1Qdd3uRFJ2k4WWTETu70";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug logging to verify connection
console.log('🔗 Supabase Connected to:', supabaseUrl);
console.log('🔑 Using Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

// Service role client for admin operations (use with caution)
export const supabaseAdmin = createClient(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMzNjIyNSwiZXhwIjoyMDg3OTEyMjI1fQ.okK-fr8o8rmJlSkLrehufxjAYPi98JwTosN6W372ckM");