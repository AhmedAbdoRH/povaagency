import React, { useState } from 'react';
import { Play } from 'lucide-react';
import type { Page, Specialization } from '../types/database';
import { extractDriveVideos, normalizeThumbnailUrl } from '../utils/pageLinks';

interface ServiceDriveVideosProps {
  page: Page | Specialization | null;
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
        <iframe
          src={embedSrc}
          title={title}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );
}

export default function ServiceDriveVideos({ page }: ServiceDriveVideosProps) {
  if (!page) return null;

  const { videos } = extractDriveVideos(page);

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6 w-full">
      <div className="flex flex-wrap items-center gap-5 sm:gap-6">
        {videos.map((vid, idx) => (
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

