-- هذا الملف يقوم بحذف جميع البيانات القديمة من الجداول لبدء العمل ببيانات نظيفة
-- يرجى تنفيذه في SQL Editor في Supabase

-- تعطيل مؤقت لقيود المفتاح الأجنبي (إذا لزم الأمر، لكن TRUNCATE CASCADE يعالجها عادةً)
-- لكن في Supabase قد نحتاج للحذف بالترتيب العكسي

-- 1. حذف العملاء (Clients)
DELETE FROM clients;

-- 2. حذف التخصصات (Specializations)
DELETE FROM specializations;

-- 3. حذف البنرات (Banners)
DELETE FROM banners;

-- 4. حذف الصفحات (Pages)
DELETE FROM pages;

-- ملاحظة: إذا كان هناك جداول أخرى قديمة مثل services أو products وتريد حذفها:
DELETE FROM services;
-- DELETE FROM products; -- إذا كان موجوداً
