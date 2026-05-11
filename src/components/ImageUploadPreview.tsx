import React, { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadPreviewProps {
  onImageReady: (file: File) => void;
  isUploading?: boolean;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function ImageUploadPreview({
  onImageReady,
  isUploading = false,
  label = 'اختر صورة',
  accept = 'image/*',
  maxSize = 10, // 10 MB default
}: ImageUploadPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOptimizing, error, setError } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // التحقق من حجم الملف
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`حجم الملف يجب أن يكون أقل من ${maxSize} MB`);
      return;
    }

    // إنشاء معاينة
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);

    // تمرير الملف للمكون الأب
    onImageReady(file);
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        {/* Input المخفي */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading || isOptimizing}
          className="hidden"
          id="image-upload"
        />

        {/* منطقة الرفع */}
        {!preview ? (
          <label
            htmlFor="image-upload"
            className={`
              relative flex flex-col items-center justify-center
              rounded-2xl border-2 border-dashed
              p-8 cursor-pointer transition-all
              ${
                isUploading || isOptimizing
                  ? 'border-gray-600 bg-gray-900/30 cursor-not-allowed'
                  : 'border-white/20 bg-white/5 hover:border-accent hover:bg-accent/5'
              }
            `}
          >
            <div className="text-center">
              {isOptimizing ? (
                <>
                  <Loader className="mx-auto mb-3 h-8 w-8 text-accent animate-spin" />
                  <p className="text-sm text-gray-400">جاري تحسين الصورة...</p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    أو اسحب الصورة هنا
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    الحد الأقصى: {maxSize} MB
                  </p>
                </>
              )}
            </div>
          </label>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            {/* المعاينة */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-cover"
            />

            {/* معلومات الملف */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-sm text-gray-300 truncate">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">
                {isOptimizing ? 'جاري التحسين...' : 'جاهز للرفع'}
              </p>
            </div>

            {/* زر الحذف */}
            {!isUploading && !isOptimizing && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            )}

            {/* مؤشر التحميل */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Loader className="h-8 w-8 text-accent animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
