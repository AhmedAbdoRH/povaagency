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
  
  const containerStyle: React.CSSProperties | undefined = isHorizontalVideo
    ? (aspectRatio ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` } : { aspectRatio: '16 / 9' })
    : { aspectRatio: '9 / 16' }; // طولي افتراضي

  // جميع الفيديوهات مضمنة - عرض بسيط بدون عناصر تحكم مخصصة
  if (isEmbeddable(videoUrl)) {
    return (
      <div className="w-full video-embed-container">
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
        `}</style>
        <div
          className={`relative w-full bg-black ${className}`}
          style={containerStyle ?? { aspectRatio: '16 / 9' }}
        >
          <iframe
            src={getEmbedUrl(videoUrl, { 
              autoplay: autoPlay, 
              mute: muted, 
              loop: loop, 
              controls: controls,
              modestbranding: 1, // إخفاء شعار YouTube
              showinfo: 0, // إخفاء معلومات الفيديو
              rel: 0 // عدم إظهار فيديوهات مقترحة
            }) || ''}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title={title || 'Video'}
            allow="autoplay; encrypted-media; fullscreen"
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
