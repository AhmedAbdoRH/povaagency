import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, Loader2, Link2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { autoConvertToWebp, isImageFile } from '../utils/imageOptimization';
import { normalizeThumbnailUrl } from '../utils/pageLinks';

interface VideoCoverFieldProps {
  label?: string;
  sublabel?: string;
  coverUrl: string | undefined | null;
  onChange: (url: string) => void;
  idPrefix?: string;
}

export default function VideoCoverField({
  label = 'صورة كفر الفيديو',
  sublabel = 'يُفضل مقاس 9:16 كالريلز',
  coverUrl,
  onChange,
  idPrefix = 'cover',
}: VideoCoverFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!isImageFile(file)) {
      toast.error('الملف يجب أن يكون صورة صالحة (JPG, PNG, WebP, GIF)');
      return;
    }

    setUploading(true);
    try {
      toast.info('جاري تحويل كفر الفيديو إلى WebP مضغوطة ورفعه...');

      let fileToUpload = file;
      try {
        // Use optimized settings for video thumbnails (better quality but smaller size)
        fileToUpload = await autoConvertToWebp(file, {
          maxWidth: 1080,
          maxHeight: 1920,
          quality: 0.8,
          format: 'webp',
        });
      } catch (optErr) {
        console.warn('Image conversion to WebP skipped:', optErr);
      }

      const ext = fileToUpload.name.split('.').pop() || 'webp';
      const fileName = `video_cover_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

      // Try uploading to 'sections' bucket first
      let publicUrl: string | null = null;
      const res1 = await supabase.storage.from('sections').upload(fileName, fileToUpload, { upsert: true });

      if (!res1.error) {
        const { data } = supabase.storage.from('sections').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      } else {
        // Fallback to 'services' bucket
        const res2 = await supabase.storage.from('services').upload(fileName, fileToUpload, { upsert: true });
        if (res2.error) throw res2.error;
        const { data } = supabase.storage.from('services').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      }

      if (publicUrl) {
        onChange(publicUrl);
        toast.success('تم رفع كفر الفيديو كـ WebP مضغوطة بنجاح ✨');
      }
    } catch (err: any) {
      console.error('Error uploading video cover:', err);
      toast.error('فشل رفع الصورة: ' + (err.message || 'يرجى المحاولة مرة أخرى'));
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const resolvedThumb = normalizeThumbnailUrl(coverUrl);

  return (
    <div className="rounded-xl bg-gray-900/70 border border-gray-700/80 p-3 space-y-2.5">
      {/* رأس الحقل */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-200 flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
          <span>{label}</span>
        </label>
        {sublabel && (
          <span className="text-[11px] text-gray-400 font-normal">
            {sublabel}
          </span>
        )}
      </div>

      {coverUrl ? (
        /* في حال تم تعيين كفر: عرض المعاينة وإمكانية التغيير أو الحذف */
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-gray-800/80 p-3 rounded-xl border border-gray-700">
          <div className="relative h-28 w-16 aspect-[9/16] shrink-0 overflow-hidden rounded-xl border border-gray-600 bg-black shadow-md">
            <img
              src={resolvedThumb || coverUrl}
              alt={label}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>تم تعيين كفر الفيديو بنجاح</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>جاري الرفع...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>تغيير من الجهاز</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                className="cursor-pointer text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                title="إزالة الكفر"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>إزالة</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* في حال لا يوجد كفر: زر ومساحة رفع مباشرة وواضحة من الجهاز */
        <div className="space-y-2">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`flex flex-col sm:flex-row items-center justify-center gap-3.5 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDragging
                ? 'border-blue-400 bg-blue-900/30 scale-[1.01]'
                : uploading
                ? 'border-blue-500/50 bg-blue-950/40 opacity-70 pointer-events-none'
                : 'border-blue-500/40 hover:border-blue-400 bg-blue-950/20 hover:bg-blue-900/20'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-300" />
              ) : (
                <Upload className="h-5 w-5 text-blue-300" />
              )}
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs sm:text-sm font-bold text-white block">
                {uploading
                  ? 'جاري رفع كفر الفيديو من جهازك...'
                  : 'اضغط لرفع كفر الفيديو من جهازك'}
              </span>
              <span className="text-[11px] text-gray-400 block mt-0.5">
                سيتم تحويل الصورة تلقائياً إلى WebP مضغوطة (JPG, PNG, WebP, GIF)
              </span>
            </div>
          </div>

          {/* خيار إدخال رابط خارجي يدوي كبديل هادئ */}
          {!showManualUrl ? (
            <button
              type="button"
              onClick={() => setShowManualUrl(true)}
              className="text-[11px] text-gray-400 hover:text-gray-300 flex items-center gap-1 transition-colors pt-0.5"
            >
              <Link2 className="h-3 w-3" />
              <span>أو إدخال رابط صورة خارجي يدويًا</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={manualUrlInput}
                onChange={e => setManualUrlInput(e.target.value)}
                placeholder="رابط صورة مباشر https://..."
                className="flex-1 rounded-lg bg-gray-800 border border-gray-700 p-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (manualUrlInput.trim()) {
                    onChange(manualUrlInput.trim());
                    setManualUrlInput('');
                    setShowManualUrl(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded-lg font-medium"
              >
                تطبيق
              </button>
              <button
                type="button"
                onClick={() => setShowManualUrl(false)}
                className="text-gray-400 hover:text-white p-2"
                title="إلغاء"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* حقل اختيار الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        id={`${idPrefix}-file-input`}
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
