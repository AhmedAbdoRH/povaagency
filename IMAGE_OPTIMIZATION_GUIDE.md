# دليل تحسين الصور - Image Optimization Guide

## 📋 نظرة عامة

تم إضافة نظام شامل لتحسين وضغط الصور أثناء الرفع لتقليل حجم الملفات وتحسين سرعة التحميل.

## 🎯 الميزات

### 1. **ضغط الصور التلقائي**
- تقليل حجم الصورة بنسبة 60-80%
- الحفاظ على جودة الصورة
- تحويل إلى صيغة WebP (أخف وزناً)

### 2. **تغيير أبعاد الصور**
- تقليل الأبعاد الكبيرة تلقائياً
- الحفاظ على النسبة الأصلية
- دعم أبعاد مخصصة

### 3. **إنشاء صور مصغرة (Thumbnails)**
- صور مصغرة سريعة التحميل
- مثالية للمعاينات

### 4. **معاينة فورية**
- عرض الصورة قبل الرفع
- معلومات عن حجم الملف
- رسائل خطأ واضحة

## 📁 الملفات الجديدة

### 1. `src/utils/imageOptimization.ts`
مكتبة الدوال الأساسية:

```typescript
// ضغط الصورة
optimizeImage(file, options)

// إنشاء صورة مصغرة
createThumbnail(file, width, height)

// التحقق من نوع الملف
isImageFile(file)

// الحصول على معلومات الصورة
getImageInfo(file)

// تحويل إلى Base64
fileToBase64(file)
```

### 2. `src/hooks/useImageUpload.ts`
Hook مخصص لإدارة حالة الرفع:

```typescript
const {
  isOptimizing,    // هل جاري تحسين الصورة
  isUploading,     // هل جاري رفع الصورة
  error,           // رسالة الخطأ
  progress,        // نسبة التقدم
  optimizeAndPrepare,  // دالة التحسين
  resetState,      // إعادة تعيين الحالة
} = useImageUpload(options)
```

### 3. `src/components/ImageUploadPreview.tsx`
مكون واجهة المستخدم:

```typescript
<ImageUploadPreview
  onImageReady={(file) => handleUpload(file)}
  isUploading={uploading}
  label="اختر صورة"
  maxSize={10}
/>
```

## 🚀 الاستخدام

### في AdminDashboard

```typescript
import { optimizeImage, isImageFile } from '../utils/imageOptimization';

const uploadImage = async (file: File, target: string) => {
  try {
    // التحقق من نوع الملف
    if (!isImageFile(file)) {
      throw new Error('الملف يجب أن يكون صورة');
    }

    // تحسين الصورة
    const optimizedFile = await optimizeImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      format: 'webp',
    });

    // رفع الصورة المحسّنة
    const { error } = await supabase.storage
      .from('services')
      .upload(fileName, optimizedFile);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### في مكون مخصص

```typescript
import ImageUploadPreview from '../components/ImageUploadPreview';
import { useImageUpload } from '../hooks/useImageUpload';

export default function MyComponent() {
  const { optimizeAndPrepare, isOptimizing } = useImageUpload();
  const [file, setFile] = useState<File | null>(null);

  const handleImageReady = async (selectedFile: File) => {
    try {
      const optimized = await optimizeAndPrepare(selectedFile);
      setFile(optimized);
    } catch (error) {
      console.error('Failed to optimize:', error);
    }
  };

  return (
    <ImageUploadPreview
      onImageReady={handleImageReady}
      isUploading={isOptimizing}
      label="اختر صورة المنتج"
      maxSize={10}
    />
  );
}
```

## 📊 مثال على النتائج

### قبل التحسين:
```
الحجم الأصلي: 2.5 MB
الأبعاد: 4000x3000
الصيغة: JPEG
```

### بعد التحسين:
```
الحجم المحسّن: 450 KB
الأبعاد: 1920x1440
الصيغة: WebP
التقليل: 82%
```

## ⚙️ الخيارات المتاحة

### ImageOptimizationOptions

```typescript
interface ImageOptimizationOptions {
  maxWidth?: number;      // الحد الأقصى للعرض (افتراضي: 1920)
  maxHeight?: number;     // الحد الأقصى للارتفاع (افتراضي: 1920)
  quality?: number;       // جودة الضغط 0-1 (افتراضي: 0.8)
  format?: 'jpeg' | 'webp' | 'png';  // صيغة الإخراج (افتراضي: webp)
}
```

## 🔍 معلومات التصحيح

عند تحسين الصورة، يتم طباعة معلومات في Console:

```
📸 Image Optimization:
   Original: 2500.00 KB
   Optimized: 450.00 KB
   Reduction: 82.0%
   Dimensions: 1920x1440
```

## 🛡️ معالجة الأخطاء

```typescript
try {
  const optimized = await optimizeImage(file);
} catch (error) {
  if (error.message.includes('Failed to load image')) {
    // الصورة تالفة أو غير صحيحة
  } else if (error.message.includes('Failed to create blob')) {
    // مشكلة في إنشاء الملف
  }
}
```

## 📱 الأجهزة المدعومة

- ✅ سطح المكتب (Chrome, Firefox, Safari, Edge)
- ✅ الهواتف الذكية (iOS Safari, Chrome Mobile)
- ✅ الأجهزة اللوحية

## ⚡ نصائح الأداء

1. **استخدم WebP**: أخف وزناً من JPEG و PNG
2. **قلل الأبعاد**: 1920x1920 كافية لمعظم الحالات
3. **اضبط الجودة**: 0.8 توازن جيد بين الجودة والحجم
4. **أنشئ thumbnails**: للمعاينات السريعة

## 🔄 التحديثات المستقبلية

- [ ] دعم ضغط الفيديو
- [ ] معالجة دفعات من الصور
- [ ] تحسين الصور بناءً على الجهاز
- [ ] دعم الصور المتجاوبة (Responsive Images)

## 📞 الدعم

للمزيد من المعلومات، راجع:
- `src/utils/imageOptimization.ts` - التوثيق الكامل للدوال
- `src/hooks/useImageUpload.ts` - استخدام Hook
- `src/components/ImageUploadPreview.tsx` - مثال على الاستخدام

---

**آخر تحديث:** 11 مايو 2026
**الحالة:** ✅ جاهز للاستخدام
