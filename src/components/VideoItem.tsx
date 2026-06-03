import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';
import { useRef } from 'react';

// Updated: 19:29 - Removed all custom controls, clean embedded videos only

interface VideoItemProps {
  videoUrl: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  isVerticalVideo?: boolean;
}

export default function VideoItem({
  videoUrl,
  title,
  poster,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
  className = '',
  isVerticalVideo = false
}: VideoItemProps) {
  const aspectRatio = useVideoAspectRatio(videoUrl, poster);

  // عكس المنطق: افتراضي طولي، إلا إذا كان محدد كعرضي
  const isHorizontalVideo = isVerticalVideo === false;
  const driveContainerRef = useRef<HTMLDivElement>(null);

  const containerStyle: React.CSSProperties | undefined = isHorizontalVideo
    ? (aspectRatio ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` } : { aspectRatio: '16 / 9' })
    : { aspectRatio: '9 / 16' }; // طولي افتراضي

  const handleDriveFullscreen = async () => {
    const el = driveContainerRef.current;
    if (!el) return;

    if (document.fullscreenElement === el) {
      await document.exitFullscreen?.();
    } else {
      await el.requestFullscreen?.();
    }
  };

  // جميع الفيديوهات مضمنة - عرض بسيط بدون عناصر تحكم مخصصة
  if (isEmbeddable(videoUrl)) {
    return (
      <div className={`w-full video-embed-container ${videoUrl.includes('drive.google.com') ? 'drive-google-drive' : ''}`}>
        <style>{`
          /* إخفاء/تصغير عناصر تحكم YouTube */
          .video-embed-container iframe {
            border: none;
          }
          
          /* محاولة إخفاء عناصر YouTube الزجاجية */
          .video-embed-container .ytp-chrome-top,
          .video-embed-container .ytp-gradient-top,
          .video-embed-container .ytp-title,
          .video-embed-container .ytp-title-text {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          
          /* تصغير حجم عناصر التحكم */
          .video-embed-container .ytp-chrome-bottom {
            transform: scale(0.8);
            transform-origin: bottom;
          }

          /* رفع شريط Google Drive السفلي خارج العرض */
          .video-embed-container.drive-google-drive .drive-iframe-wrapper {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }

          .video-embed-container.drive-google-drive .drive-iframe-wrapper iframe {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform: none;
            border: none;
          }

          .video-embed-container.drive-google-drive .drive-control-shield {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 5rem;
            background: rgba(0,0,0,0.96);
            pointer-events: none;
            z-index: 18;
            animation: driveHideControls 1.3s ease 1s forwards;
          }

          @media (max-width: 768px) {
            .video-embed-container.drive-google-drive .drive-control-shield {
              height: 8rem;
            }
          }

          @keyframes driveHideControls {
            from {
              opacity: 1;
              visibility: visible;
            }
            to {
              opacity: 0;
              visibility: hidden;
            }
          }

          .video-embed-container.drive-google-drive .drive-fullscreen-btn {
            position: absolute;
            bottom: 0.75rem;
            right: 0.75rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.75rem;
            height: 2.75rem;
            border-radius: 9999px;
            background: rgba(0,0,0,0.65);
            border: 1px solid rgba(255,255,255,0.18);
            color: #fff;
            cursor: pointer;
            z-index: 20;
          }

          .video-embed-container.drive-google-drive .drive-fullscreen-btn:hover {
            background: rgba(0,0,0,0.85);
          }
        `}</style>
        <div
          className={`relative w-full bg-black ${className} overflow-hidden`}
          style={containerStyle ?? { aspectRatio: '16 / 9' }}
          ref={videoUrl.includes('drive.google.com') ? driveContainerRef : undefined}
        >
          <div className={videoUrl.includes('drive.google.com') ? 'drive-iframe-wrapper' : ''}>
            <iframe
              src={getEmbedUrl(videoUrl, { 
                autoplay: autoPlay, 
                mute: muted, 
                loop: loop, 
                controls: controls,
                modestbranding: 1,
                showinfo: 0,
                rel: 0
              }) || ''}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              title={title || 'Video'}
              allow="autoplay; encrypted-media; fullscreen"
              style={{ border: 'none' }}
            />
            {videoUrl.includes('drive.google.com') && (
              <div className="drive-control-shield" />
            )}
          </div>

          {videoUrl.includes('drive.google.com') && (
            <button
              type="button"
              className="drive-fullscreen-btn"
              onClick={handleDriveFullscreen}
              aria-label="تكبير الشاشة"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Video Title - تحت الفيديو */}
        {title && (
          <div className="mt-4 px-2">
            <h3 className="text-gray-900 dark:text-white text-base font-bold leading-snug">
              {title}
            </h3>
          </div>
        )}
      </div>
    );
  }

  // فيديوهات مباشرة (نادرة) - عرض بسيط بدون عناصر تحكم مخصصة
  return (
    <div className="w-full">
      <div 
        className={`relative w-full bg-black ${className}`}
        style={containerStyle}
      >
        <video
          src={videoUrl}
          controls={true}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          poster={poster}
          title={title}
        />
      </div>

      {/* Video Title - تحت الفيديو */}
      {title && (
        <div className="mt-4 px-2">
          <h3 className="text-gray-900 dark:text-white text-base font-bold leading-snug">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
}
