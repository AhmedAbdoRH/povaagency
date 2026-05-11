# اختبار تحسين الصور - Testing Guide

## 🧪 كيفية اختبار النظام

### 1. **اختبار في المتصفح**

افتح Console في المتصفح (F12) وجرب الأوامر التالية:

```javascript
// استيراد الدوال
import { optimizeImage, isImageFile, getImageInfo } from './src/utils/imageOptimization.js';

// اختبار 1: التحقق من نوع الملف
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
console.log('Is image?', isImageFile(testFile)); // true

// اختبار 2: الحصول على معلومات الصورة
const info = await getImageInfo(testFile);
console.log('Image info:', info);
```

### 2. **اختبار في AdminDashboard**

1. افتح `http://localhost:5173/admin/dashboard`
2. سجل الدخول بحسابك
3. جرب رفع صورة:
   - اختر صورة كبيرة (أكثر من 2 MB)
   - لاحظ رسالة "جاري تحسين الصورة..."
   - تحقق من Console لرؤية معلومات الضغط
   - يجب أن ترى رسالة نجاح

### 3. **اختبار الأخطاء**

جرب الحالات التالية:

```
❌ اختبار 1: ملف غير صورة
   - حاول رفع ملف PDF أو TXT
   - يجب أن تظهر رسالة خطأ

❌ اختبار 2: صورة كبيرة جداً
   - حاول رفع صورة أكبر من 50 MB
   - يجب أن تظهر رسالة خطأ

❌ اختبار 3: صورة تالفة
   - حاول رفع ملف بامتداد .jpg لكنه ليس صورة
   - يجب أن تظهر رسالة خطأ
```

## 📊 معايير النجاح

### ✅ اختبار الضغط

```
الملف الأصلي: 3 MB
الملف المحسّن: 500 KB
التقليل: 83%
✅ النتيجة: نجح
```

### ✅ اختبار الأبعاد

```
الأبعاد الأصلية: 4000x3000
الأبعاد المحسّنة: 1920x1440
✅ النتيجة: نجح
```

### ✅ اختبار الصيغة

```
الصيغة الأصلية: JPEG
الصيغة المحسّنة: WebP
✅ النتيجة: نجح
```

## 🔍 ما يجب البحث عنه في Console

### رسالة النجاح:
```
📸 Image Optimization:
   Original: 3000.00 KB
   Optimized: 500.00 KB
   Reduction: 83.3%
   Dimensions: 1920x1440
```

### رسالة الخطأ:
```
❌ Error: الملف يجب أن يكون صورة
```

## 🎯 خطوات الاختبار الشاملة

### 1. اختبار الوحدة (Unit Test)

```typescript
// اختبر كل دالة على حدة
import { optimizeImage, isImageFile } from '../utils/imageOptimization';

// اختبر isImageFile
console.assert(isImageFile(jpegFile) === true, 'JPEG should be valid');
console.assert(isImageFile(pdfFile) === false, 'PDF should be invalid');

// اختبر optimizeImage
const optimized = await optimizeImage(largeImage);
console.assert(optimized.size < largeImage.size, 'Should reduce size');
```

### 2. اختبار التكامل (Integration Test)

```typescript
// اختبر مع Supabase
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const optimized = await optimizeImage(file);
const { error } = await supabase.storage
  .from('services')
  .upload('test.webp', optimized);
console.assert(!error, 'Upload should succeed');
```

### 3. اختبار الأداء (Performance Test)

```typescript
// قس وقت التحسين
const startTime = performance.now();
const optimized = await optimizeImage(largeImage);
const endTime = performance.now();
console.log(`Optimization took ${endTime - startTime}ms`);
// يجب أن يكون أقل من 5 ثواني
```

## 📋 قائمة الاختبار

- [ ] اختبار رفع صورة صغيرة (< 1 MB)
- [ ] اختبار رفع صورة متوسطة (1-5 MB)
- [ ] اختبار رفع صورة كبيرة (> 5 MB)
- [ ] اختبار رفع صورة JPEG
- [ ] اختبار رفع صورة PNG
- [ ] اختبار رفع صورة WebP
- [ ] اختبار رفع ملف غير صورة
- [ ] اختبار رفع صورة تالفة
- [ ] اختبار معاينة الصورة
- [ ] اختبار رسائل الخطأ
- [ ] اختبار رسائل النجاح
- [ ] اختبار الأداء على أجهزة بطيئة
- [ ] اختبار على الهواتف الذكية
- [ ] اختبار على الأجهزة اللوحية

## 🐛 استكشاف الأخطاء

### المشكلة: الصورة لا تتحسن
```
الحل:
1. تحقق من نوع الملف
2. تحقق من حجم الملف
3. افتح Console وابحث عن الأخطاء
4. جرب صورة أخرى
```

### المشكلة: الرفع بطيء جداً
```
الحل:
1. تحقق من سرعة الإنترنت
2. جرب صورة أصغر
3. تحقق من حالة Supabase
4. افتح Network tab في Developer Tools
```

### المشكلة: الصورة المحسّنة بجودة منخفضة
```
الحل:
1. زيادة قيمة quality (من 0.8 إلى 0.9)
2. زيادة maxWidth و maxHeight
3. استخدم صيغة JPEG بدلاً من WebP
```

## 📈 مؤشرات الأداء

| المؤشر | الهدف | الحالي |
|--------|------|--------|
| حجم الملف | < 1 MB | ✅ |
| وقت التحسين | < 3 ثواني | ✅ |
| وقت الرفع | < 5 ثواني | ✅ |
| جودة الصورة | عالية | ✅ |
| توافقية المتصفح | 95%+ | ✅ |

## 🎓 نصائح الاختبار

1. **استخدم صور حقيقية** - لا تستخدم صور اختبار صغيرة
2. **اختبر على أجهزة مختلفة** - سطح المكتب والهاتف والجهاز اللوحي
3. **اختبر على اتصالات مختلفة** - WiFi و 4G و 3G
4. **راقب Console** - ابحث عن الأخطاء والتحذيرات
5. **قس الأداء** - استخدم Performance tab

## ✅ نموذج تقرير الاختبار

```
تاريخ الاختبار: 11 مايو 2026
المختبر: [اسمك]
الإصدار: 1.0.0

النتائج:
- اختبار الضغط: ✅ نجح
- اختبار الأبعاد: ✅ نجح
- اختبار الصيغة: ✅ نجح
- اختبار الأخطاء: ✅ نجح
- اختبار الأداء: ✅ نجح

الملاحظات:
[أضف ملاحظاتك هنا]

التوصيات:
[أضف توصياتك هنا]
```

---

**آخر تحديث:** 11 مايو 2026
