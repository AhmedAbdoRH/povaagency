/**
 * Image Optimization Utility
 * يوفر دوال لضغط وتحسين الصور قبل الرفع
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'webp' | 'png';
}

const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.65,
  format: 'webp',
};

/**
 * ضغط وتحسين الصورة
 * @param file - ملف الصورة الأصلي
 * @param options - خيارات التحسين
 * @returns ملف الصورة المحسّن
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          // حساب الأبعاد الجديدة مع الحفاظ على النسبة
          let { width, height } = img;
          const maxWidth = opts.maxWidth || 1920;
          const maxHeight = opts.maxHeight || 1920;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // إنشاء canvas وضغط الصورة
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Failed to get canvas context');

          ctx.drawImage(img, 0, 0, width, height);

          // تحويل الصورة إلى blob
          canvas.toBlob(
            (blob) => {
              if (!blob) throw new Error('Failed to create blob');

              // إنشاء ملف جديد من الـ blob
              const optimizedFile = new File(
                [blob],
                `optimized_${Date.now()}.${opts.format}`,
                { type: `image/${opts.format}` }
              );

              // طباعة معلومات الضغط
              const originalSize = (file.size / 1024).toFixed(2);
              const optimizedSize = (optimizedFile.size / 1024).toFixed(2);
              const reduction = (
                ((file.size - optimizedFile.size) / file.size) *
                100
              ).toFixed(1);

              console.log(
                `📸 Image Optimization:\n` +
                `   Original: ${originalSize} KB\n` +
                `   Optimized: ${optimizedSize} KB\n` +
                `   Reduction: ${reduction}%\n` +
                `   Dimensions: ${width}x${height}`
              );

              resolve(optimizedFile);
            },
            `image/${opts.format}`,
            opts.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * إنشاء صورة مصغرة (thumbnail)
 * @param file - ملف الصورة الأصلي
 * @param width - عرض الصورة المصغرة
 * @param height - ارتفاع الصورة المصغرة
 * @returns ملف الصورة المصغرة
 */
export async function createThumbnail(
  file: File,
  width: number = 300,
  height: number = 300
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Failed to get canvas context');

          // حساب النسبة للحفاظ على جودة الصورة
          const sourceAspect = img.width / img.height;
          const targetAspect = width / height;

          let sourceWidth = img.width;
          let sourceHeight = img.height;
          let sourceX = 0;
          let sourceY = 0;

          if (sourceAspect > targetAspect) {
            sourceWidth = img.height * targetAspect;
            sourceX = (img.width - sourceWidth) / 2;
          } else {
            sourceHeight = img.width / targetAspect;
            sourceY = (img.height - sourceHeight) / 2;
          }

          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            width,
            height
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) throw new Error('Failed to create blob');

              const thumbnailFile = new File(
                [blob],
                `thumbnail_${Date.now()}.webp`,
                { type: 'image/webp' }
              );

              console.log(
                `🖼️ Thumbnail created: ${(thumbnailFile.size / 1024).toFixed(2)} KB`
              );

              resolve(thumbnailFile);
            },
            'image/webp',
            0.8
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * التحقق من أن الملف هو صورة
 * @param file - الملف المراد التحقق منه
 * @returns true إذا كان الملف صورة
 */
export function isImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
}

/**
 * الحصول على معلومات الصورة
 * @param file - ملف الصورة
 * @returns معلومات الصورة (الحجم، النوع، إلخ)
 */
export async function getImageInfo(file: File): Promise<{
  width: number;
  height: number;
  size: number;
  type: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * تحويل الصورة إلى Base64 (للمعاينة)
 * @param file - ملف الصورة
 * @returns Base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
