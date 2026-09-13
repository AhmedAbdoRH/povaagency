import { createClient } from '@supabase/supabase-js';

// Project credentials for the active Supabase project (omailusfkppwhhiwlepe)
const ACTIVE_SUPABASE_URL = 'https://omailusfkppwhhiwlepe.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTM4MjksImV4cCI6MjEwNDQyOTgyOX0.0vaeSqU1PA76D819t3lWz1iCyc6aNKE3EOtHlRQlXc0';
const ACTIVE_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg1MzgyOSwiZXhwIjoyMTA0NDI5ODI5fQ.Y3Ra3N7imPlQk8vzIQ9Pg-L5ClsH1RUuXzJhlmcvYy4';

// Deprecated project ID that fails DNS resolution
const DEPRECATED_PROJECT_REF = 'xijyciccygbdwudehdoa';

function resolveValidUrl(): string {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  if (envUrl && !envUrl.includes(DEPRECATED_PROJECT_REF) && envUrl.includes('.supabase.co')) {
    return envUrl;
  }
  return ACTIVE_SUPABASE_URL;
}

function resolveValidAnonKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envKey && !envKey.includes(DEPRECATED_PROJECT_REF)) {
    return envKey;
  }
  return ACTIVE_SUPABASE_ANON_KEY;
}

function resolveValidServiceKey(): string {
  const envKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (envKey && !envKey.includes(DEPRECATED_PROJECT_REF)) {
    return envKey;
  }
  return ACTIVE_SUPABASE_SERVICE_ROLE_KEY;
}

export const supabaseUrl = resolveValidUrl();
export const supabaseAnonKey = resolveValidAnonKey();
export const supabaseServiceRoleKey = resolveValidServiceKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log('🔗 Supabase Connected to:', supabaseUrl);
