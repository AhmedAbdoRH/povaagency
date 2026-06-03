import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';

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
  const verticalAspectRatio = aspectRatio && !isHorizontalVideo && aspectRatio.width / aspectRatio.height < 0.625
    ? { width: 10, height: aspectRatio.height }
    : aspectRatio;
  const containerStyle: React.CSSProperties | undefined = isHorizontalVideo
    ? (aspectRatio ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` } : { aspectRatio: '16 / 9' })
    : (verticalAspectRatio ? { aspectRatio: `${verticalAspectRatio.width} / ${verticalAspectRatio.height}` } : { aspectRatio: '10 / 16' });

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
          
          /* تصغير حجم عناصر التحكم بشكل كبير جداً */
          .video-embed-container .ytp-chrome-bottom {
            transform: scale(0.35) !important;
            transform-origin: bottom center !important;
            padding: 0px 2px !important;
            height: 24px !important;
          }
          
          /* تصغير الأزرار بشكل أكبر */
          .video-embed-container .ytp-button {
            transform: scale(0.5) !important;
            width: 24px !important;
            height: 24px !important;
          }
          
          /* تصغير شريط التقدم جداً */
          .video-embed-container .ytp-progress-bar-container {
            height: 0.5px !important;
          }
          
          /* تصغير الوقت والنصوص */
          .video-embed-container .ytp-time-display {
            font-size: 8px !important;
          }
          
          /* إخفاء زر التكبير في جميع المنصات */
          .video-embed-container .ytp-fullscreen-button,
          .video-embed-container .ytp-size-button,
          .video-embed-container button[data-title="Fullscreen"],
          .video-embed-container button[aria-label*="fullscreen"],
          .video-embed-container button[aria-label*="Fullscreen"],
          .video-embed-container button[title*="fullscreen"],
          .video-embed-container button[title*="Fullscreen"],
          .video-embed-container .vp-controls-fullscreen,
          .video-embed-container .vp-fullscreen,
          .video-embed-container [class*="fullscreen"],
          .video-embed-container [class*="Fullscreen"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
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

          .video-embed-container.drive-google-drive .drive-control-mask {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 8rem;
            background: linear-gradient(180deg, rgba(0,0,0,0.98), transparent);
            pointer-events: none;
            z-index: 20;
            animation: driveHideControls 0.6s ease 1s forwards;
          }

          .video-embed-container.drive-google-drive .drive-control-mask::before {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 100%;
            background: rgba(0,0,0,0.6);
            pointer-events: none;
          }
        `}</style>
        <div
          className={`relative w-full bg-black ${className} overflow-hidden`}
          style={containerStyle ?? { aspectRatio: '16 / 9' }}
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
              <div className="drive-control-mask" />
            )}
          </div>
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
