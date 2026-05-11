import { useState, useCallback } from 'react';
import { optimizeImage, isImageFile, getImageInfo } from '../utils/imageOptimization';

interface UseImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

interface ImageUploadState {
  isOptimizing: boolean;
  isUploading: boolean;
  error: string | null;
  progress: number;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [state, setState] = useState<ImageUploadState>({
    isOptimizing: false,
    isUploading: false,
    error: null,
    progress: 0,
  });

  const optimizeAndPrepare = useCallback(
    async (file: File) => {
      setState(prev => ({ ...prev, isOptimizing: true, error: null }));

      try {
        // التحقق من أن الملف هو صورة
        if (!isImageFile(file)) {
          throw new Error('الملف يجب أن يكون صورة (JPEG, PNG, WebP, GIF)');
        }

        // الحصول على معلومات الصورة الأصلية
        const originalInfo = await getImageInfo(file);
        console.log('📸 Original Image:', {
          size: `${(originalInfo.size / 1024).toFixed(2)} KB`,
          dimensions: `${originalInfo.width}x${originalInfo.height}`,
          type: originalInfo.type,
        });

        // تحسين الصورة
        const optimizedFile = await optimizeImage(file, {
          maxWidth: options.maxWidth || 1280,
          maxHeight: options.maxHeight || 1280,
          quality: options.quality || 0.65,
          format: options.format || 'webp',
        });

        // الحصول على معلومات الصورة المحسّنة
        const optimizedInfo = await getImageInfo(optimizedFile);
        const reduction = (
          ((file.size - optimizedFile.size) / file.size) *
          100
        ).toFixed(1);

        console.log('✨ Optimized Image:', {
          size: `${(optimizedInfo.size / 1024).toFixed(2)} KB`,
          dimensions: `${optimizedInfo.width}x${optimizedInfo.height}`,
          reduction: `${reduction}%`,
        });

        setState(prev => ({ ...prev, isOptimizing: false }));
        return optimizedFile;
      } catch (error: any) {
        const errorMessage = error.message || 'فشل تحسين الصورة';
        setState(prev => ({ ...prev, isOptimizing: false, error: errorMessage }));
        throw error;
      }
    },
    [options]
  );

  const resetState = useCallback(() => {
    setState({
      isOptimizing: false,
      isUploading: false,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    ...state,
    optimizeAndPrepare,
    resetState,
    setError: (error: string | null) =>
      setState(prev => ({ ...prev, error })),
    setProgress: (progress: number) =>
      setState(prev => ({ ...prev, progress })),
    setIsUploading: (isUploading: boolean) =>
      setState(prev => ({ ...prev, isUploading })),
  };
}
