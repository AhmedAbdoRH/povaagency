# إعدادات Supabase - POVA Agency

## ✅ حالة الاتصال
الاتصال بقاعدة البيانات يعمل بشكل صحيح!

## 🔗 معلومات الاتصال

### API URL
```
https://omailusfkppwhhiwlepe.supabase.co
```

### Anon Key (Public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTM4MjksImV4cCI6MjEwNDQyOTgyOX0.0vaeSqU1PA76D819t3lWz1iCyc6aNKE3EOtHlRQlXc0
```

### Service Role Key (Secret - للاستخدام في الـ Backend فقط)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg1MzgyOSwiZXhwIjoyMTA0NDI5ODI5fQ.Y3Ra3N7imPlQk8vzIQ9Pg-L5ClsH1RUuXzJhlmcvYy4
```

## 📋 الجداول المتاحة

### ✅ store_settings
- **الحالة**: يعمل
- **البيانات**: POVA Agency

### ✅ pages (5 صفحات)
1. تصميم المنشورات
2. صناعة المحتوى
3. استراتيجية التسويق
4. تصوير الفيديو
5. الإنتاج الإعلامي

### ✅ services (5 خدمات)
1. استراتيجية التسويق
2. تصميم المواقع
3. تصميم المنشورات
4. الإنتاج الإعلامي
5. تصوير الفيديو

### ✅ banners
- **الحالة**: يعمل
- **البيانات**: فارغ حالياً

## 🔧 ملف الإعدادات

### `.env`
```env
VITE_SUPABASE_URL=https://omailusfkppwhhiwlepe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTM4MjksImV4cCI6MjEwNDQyOTgyOX0.0vaeSqU1PA76D819t3lWz1iCyc6aNKE3EOtHlRQlXc0
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYWlsdXNma3Bwd2hoaXdsZXBlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODg1MzgyOSwiZXhwIjoyMTA0NDI5ODI5fQ.Y3Ra3N7imPlQk8vzIQ9Pg-L5ClsH1RUuXzJhlmcvYy4
```

### `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 🚀 كيفية الاستخدام

### 1. تشغيل الخادم المحلي
```bash
npm run dev
```

### 2. الوصول للتطبيق
```
http://localhost:5173/
```

### 3. التحقق من الاتصال
افتح Console في المتصفح وابحث عن:
```
🔗 Supabase Connected to: https://omailusfkppwhhiwlepe.supabase.co
```

## 🔒 ملاحظات أمنية

⚠️ **مهم جداً:**
- لا تشارك `Service Role Key` مع أحد
- لا ترفع ملف `.env` على GitHub
- استخدم `Anon Key` فقط في Frontend
- استخدم `Service Role Key` فقط في Backend/Admin

## 📊 Dashboard Supabase
```
https://supabase.com/dashboard/project/omailusfkppwhhiwlepe
```

## ✅ تم الاختبار
- ✅ الاتصال بقاعدة البيانات
- ✅ قراءة البيانات من store_settings
- ✅ قراءة البيانات من pages
- ✅ قراءة البيانات من services
- ✅ قراءة البيانات من banners
- ✅ الخادم المحلي يعمل بشكل صحيح

---

**آخر تحديث:** 8 سبتمبر 2026
**الحالة:** ✅ متصل بقاعدة البيانات الصحيحة (omailusfkppwhhiwlepe)
**النشر:** ✅ تم النشر على Cloudflare Pages
**رابط النشر:** https://58c27a57.povaagency-github.pages.dev

## 🚀 آخر عملية نشر
- **التاريخ:** 8 سبتمبر 2026
- **الإصدار:** 58c27a57
- **التحديثات:**
  - إنشاء هيكل قاعدة البيانات الكامل باستخدام MCP
  - إضافة جميع الجداول المطلوبة (9 جداول)
  - تفعيل Row Level Security (RLS)
  - إضافة البيانات الافتراضية لـ store_settings
  - تحديث Secrets في Cloudflare Pages
  - نشر التحديثات على Cloudflare Pages

## 🔧 التحديث الأخير (8 سبتمبر 2026)
- تم التبديل من المشروع xijyciccygbdwudehdoa إلى omailusfkppwhhiwlepe
- المشروع السابق كان غير متaccessible (DNS error)
- المشروع الجديد يعمل بشكل صحيح ومتاح
- تحديث جميع ملفات الإعدادات (.env, wrangler.toml, src/lib/supabase.ts)
- إنشاء هيكل قاعدة البيانات الكامل (9 جداول + RLS + Indexes)
- تحديث التوثيق في SUPABASE_CONFIG.md
- نشر التحديثات على Cloudflare Pages
