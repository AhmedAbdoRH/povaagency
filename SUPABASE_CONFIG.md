# إعدادات Supabase - POVA Agency

## ✅ حالة الاتصال
الاتصال بقاعدة البيانات يعمل بشكل صحيح!

## 🔗 معلومات الاتصال

### API URL
```
https://xijyciccygbdwudehdoa.supabase.co
```

### Anon Key (Public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzYyMjUsImV4cCI6MjA4NzkxMjIyNX0.RoOE0zWudd4dDekgVtMvoOd1Qdd3uRFJ2k4WWTETu70
```

### Service Role Key (Secret - للاستخدام في الـ Backend فقط)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMzNjIyNSwiZXhwIjoyMDg3OTEyMjI1fQ.okK-fr8o8rmJlSkLrehufxjAYPi98JwTosN6W372ckM
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
VITE_SUPABASE_URL=https://xijyciccygbdwudehdoa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMzYyMjUsImV4cCI6MjA4NzkxMjIyNX0.RoOE0zWudd4dDekgVtMvoOd1Qdd3uRFJ2k4WWTETu70
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpanljaWNjeWdiZHd1ZGVoZG9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjMzNjIyNSwiZXhwIjoyMDg3OTEyMjI1fQ.okK-fr8o8rmJlSkLrehufxjAYPi98JwTosN6W372ckM
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
🔗 Supabase Connected to: https://xijyciccygbdwudehdoa.supabase.co
```

## 🔒 ملاحظات أمنية

⚠️ **مهم جداً:**
- لا تشارك `Service Role Key` مع أحد
- لا ترفع ملف `.env` على GitHub
- استخدم `Anon Key` فقط في Frontend
- استخدم `Service Role Key` فقط في Backend/Admin

## 📊 Dashboard Supabase
```
https://supabase.com/dashboard/project/xijyciccygbdwudehdoa
```

## ✅ تم الاختبار
- ✅ الاتصال بقاعدة البيانات
- ✅ قراءة البيانات من store_settings
- ✅ قراءة البيانات من pages
- ✅ قراءة البيانات من services
- ✅ قراءة البيانات من banners
- ✅ الخادم المحلي يعمل بشكل صحيح

---

**آخر تحديث:** 11 مايو 2026
**الحالة:** ✅ يعمل بشكل ممتاز
