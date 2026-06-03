import { getEmbedUrl, getDriveVideoDirectUrl, isEmbeddable } from '../utils/videoUtils';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';
import { useEffect, useRef, useState } from 'react';
import { Fullscreen, Pause, Play } from 'lucide-react';

// Updated: 19:29 - Added custom play/pause and fullscreen controls for Google Drive videos

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

  const driveVideoDirectUrl = getDriveVideoDirectUrl(videoUrl);
  const isDriveVideo = Boolean(driveVideoDirectUrl);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isDriveVideo && autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [autoPlay, isDriveVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const openFullscreen = () => {
    if (!wrapperRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    wrapperRef.current.requestFullscreen?.();
  };

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

          .video-embed-container .drive-player-controls {
            position: absolute;
            inset: auto 0 1rem 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.75rem;
            gap: 0.75rem;
            pointer-events: none;
            z-index: 20;
          }

          .video-embed-container .drive-player-controls button {
            pointer-events: auto;
            border: none;
            background: rgba(0,0,0,0.6);
            color: white;
            width: 2.75rem;
            height: 2.75rem;
            display: grid;
            place-items: center;
            border-radius: 9999px;
            transition: background 150ms ease;
          }

          .video-embed-container .drive-player-controls button:hover {
            background: rgba(255,255,255,0.12);
          }
        `}</style>
        <div
          className={`relative w-full bg-black ${className} overflow-hidden`}
          style={containerStyle ?? { aspectRatio: '16 / 9' }}
        >
          {isDriveVideo ? (
            <div ref={wrapperRef} className="relative w-full h-full">
              <video
                ref={videoRef}
                src={driveVideoDirectUrl || undefined}
                autoPlay={autoPlay}
                muted={muted}
                loop={loop}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              <div className="drive-player-controls">
                <button type="button" aria-label={isPlaying ? 'Pause video' : 'Play video'} onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button type="button" aria-label="Fullscreen" onClick={openFullscreen}>
                  <Fullscreen className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
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
            </div>
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
