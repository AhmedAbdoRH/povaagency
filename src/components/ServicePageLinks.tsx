import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, Video } from 'lucide-react';
import type { Page, Specialization } from '../types/database';
import { extractDriveVideos } from '../utils/pageLinks';
import { useLanguage } from '../hooks/useLanguage';

interface ServiceDriveVideosProps {
  page: Page | Specialization | null;
}

export default function ServiceDriveVideos({ page }: ServiceDriveVideosProps) {
  const { language, t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Reset video loaded state when switching videos
  useEffect(() => {
    setVideoLoaded(false);
  }, [selectedIndex]);

  if (!page) return null;

  const { videos } = extractDriveVideos(page);

  if (!videos || videos.length === 0) {
    return null;
  }

  const isAr = language === 'ar';
  const activeVideo = videos[selectedIndex] || videos[0];

  return (
    <div className="mt-8 mb-6">
      {/* Tabs if there are multiple videos */}
      {videos.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {videos.map((vid, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={vid.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'border border-accent bg-accent/20 text-accent shadow-sm'
                    : 'border border-white/10 bg-[#0a1121]/80 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <Play className={`h-3 w-3 ${isActive ? 'fill-current' : ''}`} />
                <span>{vid.title || (isAr ? `فيديو ${idx + 1}` : `Video ${idx + 1}`)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Embedded Google Drive Video Player Container */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#040810] shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
        {/* Video Frame */}
        <div className="relative aspect-video w-full">
          {activeVideo.thumbnail_url && !videoLoaded ? (
            <>
              {/* Thumbnail with play button overlay */}
              <div className="relative h-full w-full bg-black">
                <img
                  src={activeVideo.thumbnail_url}
                  alt={activeVideo.title || 'Video thumbnail'}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    console.error('Failed to load thumbnail:', activeVideo.thumbnail_url);
                    setVideoLoaded(true); // Load video if thumbnail fails
                  }}
                />
                <button
                  onClick={() => setVideoLoaded(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all">
                    <Play className="h-8 w-8 text-white fill-current" />
                  </div>
                </button>
              </div>
            </>
          ) : (
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title || 'Google Drive Video'}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Named alias export for backward compatibility
export { ServiceDriveVideos as ServicePageLinks };
