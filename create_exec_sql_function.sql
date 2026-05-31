-- =====================================================
-- إنشاء دوال تنفيذ الاستعلامات SQL عبر REST API
-- Create exec_sql functions for Supabase MCP
-- =====================================================

-- تشغيل هذا الملف في Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/xijyciccygbdwudehdoa/sql/new

-- 1. دالة تنفيذ أي استعلام SQL
CREATE OR REPLACE FUNCTION exec_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query_text;
  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- 2. دالة تنفيذ استعلامات SELECT وجلب النتائج
CREATE OR REPLACE FUNCTION exec_sql_query(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query_text || ') t' INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- 3. اختبار الدوال
SELECT exec_sql_query('SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'' ORDER BY table_name');