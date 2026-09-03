import React, { useState } from 'react';
import { ExternalLink, Play, Video } from 'lucide-react';
import type { Page } from '../types/database';
import { extractDriveVideos } from '../utils/pageLinks';
import { useLanguage } from '../hooks/useLanguage';

interface ServiceDriveVideosProps {
  page: Page | null;
}

export default function ServiceDriveVideos({ page }: ServiceDriveVideosProps) {
  const { language, t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!page) return null;

  const { videos } = extractDriveVideos(page);

  if (!videos || videos.length === 0) {
    return null;
  }

  const isAr = language === 'ar';
  const activeVideo = videos[selectedIndex] || videos[0];

  return (
    <div className="mt-8 mb-6">
      {/* Section Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {videos.length > 1
                ? t('coreServicePage.serviceVideos', isAr ? 'فيديوهات الخدمة من Google Drive' : 'Service Videos (Google Drive)')
                : t('coreServicePage.singleServiceVideo', isAr ? 'فيديو تعريفي للخدمة' : 'Service Video Walkthrough')}
            </h3>
          </div>
        </div>

        {/* Direct Link to open currently active video on Drive */}
        {activeVideo?.url && (
          <a
            href={activeVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white"
          >
            {/* Google Drive miniature icon */}
            <svg className="h-3.5 w-3.5" viewBox="0 0 87.3 78" fill="none">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.95 10.3z" fill="#ea4335"/>
              <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
              <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span>{t('coreServicePage.openInDrive', isAr ? 'فتح الفيديو على Google Drive' : 'Open in Google Drive')}</span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </a>
        )}
      </div>

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
          <iframe
            src={activeVideo.embedUrl}
            title={activeVideo.title || 'Google Drive Video'}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Bottom bar with active video title and drive badge */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#0a1121]/90 px-4 py-2.5 text-xs text-gray-400">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white truncate">
              {activeVideo.title || (isAr ? 'فيديو توضيحي' : 'Walkthrough Video')}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            {t('coreServicePage.drivePlayer', 'Google Drive Player')}
          </span>
        </div>
      </div>
    </div>
  );
}

// Named alias export for backward compatibility
export { ServiceDriveVideos as ServicePageLinks };
