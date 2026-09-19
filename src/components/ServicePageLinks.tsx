import React, { useState, useMemo } from 'react';
import { Play } from 'lucide-react';
import type { Page, Specialization } from '../types/database';
import { extractDriveVideos, normalizeThumbnailUrl } from '../utils/pageLinks';

interface ServiceDriveVideosProps {
  page: Page | Specialization | null;
  /** If true, show only one random video. If false, show all videos. Default: true */
  showRandomOnly?: boolean;
}

interface SingleDriveVideoProps {
  video: {
    id?: string;
    title?: string;
    url: string;
    embedUrl: string;
    thumbnail_url?: string | null;
  };
  index: number;
}

function DriveVideoCard({ video, index }: SingleDriveVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const title = video.title || `Video ${index + 1}`;
  const normalizedThumb = normalizeThumbnailUrl(video.thumbnail_url) || video.thumbnail_url;
  const showThumbnail = Boolean(normalizedThumb) && !thumbnailError && !isPlaying;

  const embedSrc = isPlaying && video.embedUrl
    ? (video.embedUrl.includes('?') ? `${video.embedUrl}&autoplay=1` : `${video.embedUrl}?autoplay=1`)
    : video.embedUrl;

  return (
    <div
      id={`video-card-${video.id || index}`}
      className="group relative aspect-[9/16] w-full max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white/20"
      style={{ aspectRatio: '9 / 16' }}
    >
      {showThumbnail ? (
        <div className="relative h-full w-full">
          <img
            src={normalizedThumb!}
            alt={title}
            className="h-full w-full object-cover bg-black transition-transform duration-500 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
            onError={() => setThumbnailError(true)}
          />
          {/* عنوان الفيديو على الكفر */}
          {video.title && (
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
              <span className="text-xs font-semibold text-white drop-shadow-md line-clamp-1">
                {video.title}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            aria-label={`تشغيل ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all duration-300 group-hover:bg-black/20 cursor-pointer"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-active:scale-95">
              <Play className="h-6 w-6 fill-current translate-x-0.5" />
            </div>
          </button>
        </div>
      ) : (
        <div className="relative h-full w-full overflow-hidden bg-black">
          {/* Iframe cropped to hide Google Drive header and oversized controls */}
          <div className="absolute -top-[54px] -bottom-[48px] -left-[1px] -right-[1px] overflow-hidden">
            <iframe
              src={embedSrc}
              title={title}
              className="h-full w-full border-0 pointer-events-auto"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>

          {/* زر إعادة إظهار الكفر / إيقاف الفيديو والعودة */}
          <button
            type="button"
            onClick={() => setIsPlaying(false)}
            aria-label="إغلاق أو إعادة تشغيل الفيديو"
            className="absolute top-2.5 right-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-md transition-all hover:bg-black/90 hover:text-white hover:scale-105"
            title="الرجوع للكفر"
          >
            <span className="text-xs font-bold leading-none">✕</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function ServiceDriveVideos({ page, showRandomOnly = true }: ServiceDriveVideosProps) {
  if (!page) return null;

  const { videos } = extractDriveVideos(page);

  if (!videos || videos.length === 0) {
    return null;
  }

  // If showRandomOnly is true, display only one random video
  const videosToDisplay = useMemo(() => {
    if (showRandomOnly) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      return [videos[randomIndex]];
    }
    return videos;
  }, [videos, showRandomOnly]);

  return (
    <div className="mt-8 mb-6 w-full">
      <div className="flex flex-wrap items-center gap-5 sm:gap-6">
        {videosToDisplay.map((vid, idx) => (
          <DriveVideoCard
            key={vid.id || idx}
            video={vid}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}

// Named alias export for backward compatibility
export { ServiceDriveVideos as ServicePageLinks };

