import { useNavigate } from 'react-router-dom';
import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useLanguage } from '../hooks/useLanguage';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';
import { linkifyText } from '../utils/linkify';
import React from 'react';

interface ClientCardProps {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  isVerticalVideo?: boolean;
  aspectRatioOverride?: string; // مقاس مخصص (مثل '3 / 4')
  projectUrl?: string; // رابط المشروع
  hideText?: boolean; // إخفاء النصوص تحت الكارت
}

export default function ClientCard({ id, name, description, logoUrl, imageUrl, videoUrl, isVerticalVideo, aspectRatioOverride, projectUrl, hideText }: ClientCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const aspectRatio = useVideoAspectRatio(videoUrl, imageUrl);

  const getExternalLink = (text: string): string | null => {
    // التحقق من وجود رابط كامل يبدأ بـ http أو https
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urlMatch = text.match(urlRegex);
    if (urlMatch && urlMatch[0]) {
      return urlMatch[0];
    }

    // التحقق من وجود نطاق (Domain) في أي مكان بالنص ينتهي بـ TLDs مشهورة
    const domainRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:com|net|org|co|io|gov|edu|info|me|app|xyz|site|online|link|agency|dev)(?:\/[^\s]*)?)/i;
    const domainMatch = text.match(domainRegex);
    if (domainMatch && domainMatch[0]) {
      let url = domainMatch[0].trim();
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      return url;
    }
    
    return null;
  };

  // أولوية للـ projectUrl، ثم للـ name parsing
  const externalUrl = projectUrl || getExternalLink(name);
  const isExternal = Boolean(externalUrl);
  const hasVideo = Boolean(videoUrl);
  const showVideoAtNaturalRatio = hasVideo && aspectRatio !== null;
  const isVideoEmbed = hasVideo && isEmbeddable(videoUrl!);

  // عكس المنطق: افتراضي طولي، إلا إذا كان محدد كعرضي
  // isVerticalVideo = false يعني عرضي (استثناء)
  // isVerticalVideo = true أو undefined يعني طولي (افتراضي)
  const isHorizontalVideo = isVerticalVideo === false;

  const mediaStyle: React.CSSProperties | undefined = aspectRatioOverride
    ? { aspectRatio: aspectRatioOverride }
    : hasVideo
    ? (isHorizontalVideo
        ? (showVideoAtNaturalRatio
            ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
            : isVideoEmbed
              ? { aspectRatio: '16 / 9' }
              : undefined)
        : (showVideoAtNaturalRatio
            ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
            : { aspectRatio: '4 / 3' }))  // موحد المقاس للصور العمودية
    : { aspectRatio: '4 / 3' }; // موحد المقاس للصور

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/client/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col bg-[#060b14] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 group hover:border-[#ec533a]/50 hover:-translate-y-2 cursor-pointer"
    >
      {/* Media Content */}
      <div
        className="relative bg-black flex items-center justify-center overflow-hidden w-full"
        style={mediaStyle}
      >
        {hasVideo ? (
          isVideoEmbed ? (
            <iframe
              src={getEmbedUrl(videoUrl!, { autoplay: true, mute: true, loop: true, controls: false }) || ''}
              className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-700 group-hover:scale-110"
              allow="autoplay; encrypted-media; fullscreen"
              title={name}
            />
          ) : (
            showVideoAtNaturalRatio ? (
              <video
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <video
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-110"
              />
            )
          )
        ) : logoUrl || imageUrl ? (
          <img
            src={logoUrl || imageUrl!}
            alt={name}
            className={`w-full h-full ${logoUrl && !imageUrl ? 'object-contain p-8' : 'object-cover'} transition-transform duration-700 group-hover:scale-110`}
          />
        ) : (
          <div className="text-gray-600 font-bold text-2xl aspect-square flex items-center justify-center">{name}</div>
        )}
      </div>

      {/* Text Content - تحت الميديا */}
      {!hideText && (
        <div className="relative p-6 bg-[#060b14] flex flex-col">
          {/* اسم العمل */}
          <h3 className="text-base md:text-lg font-bold text-white mb-1 group-hover:text-[#ec533a] transition-colors duration-300">
            {name}
          </h3>

          {/* رابط الموقع */}
          {isExternal && externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-gray-400 hover:text-[#ec533a] mb-3 truncate block"
            >
              {externalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          )}

          {isExternal ? (
            <div className="mt-2">
              {description && (
                <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                  {linkifyText(description)}
                </p>
              )}
              <button
                onClick={handleCardClick}
                className="w-full text-center bg-[#ec533a] hover:bg-[#d63d2a] text-white py-2 rounded-lg transition-all duration-300 font-semibold shadow-lg text-sm"
              >
                {language === 'en' ? 'View Website' : 'اعرض الموقع'}
              </button>
            </div>
          ) : (
            /* الوصف - يظهر عند hover للعملاء العاديين */
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
              <div className="overflow-hidden">
                <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                  {description ? linkifyText(description) : t('clientCard.clickForDetails')}
                </p>
                <div
                  onClick={handleCardClick}
                  className="w-full text-center bg-white/10 backdrop-blur-md hover:bg-[#ec533a] text-white py-2 rounded-lg transition-all duration-300 font-semibold border border-white/20 hover:border-[#ec533a] shadow-lg text-sm"
                >
                  {t('clientCard.viewDetails')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
