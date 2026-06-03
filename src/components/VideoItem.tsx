import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';

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

  // نستخدم المقاس الأصلي للفيديو متى توفر، أو نسبة 9:16 إذا كان محدداً يدوياً بأنه طولي
  const containerStyle: React.CSSProperties | undefined = isVerticalVideo
    ? { aspectRatio: '9 / 16' }
    : aspectRatio
      ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
      : undefined;

  if (isEmbeddable(videoUrl)) {
    return (
      <div
        className={`relative w-full bg-black ${className}`}
        style={containerStyle ?? { aspectRatio: '16 / 9' }}
      >
        <iframe
          src={getEmbedUrl(videoUrl, { autoplay: autoPlay, mute: muted, loop: loop, controls: controls }) || ''}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          title={title || 'Video'}
          allow="autoplay; encrypted-media; fullscreen"
        />
      </div>
    );
  }

  // Direct video file: wrap in a container with the natural aspect ratio
  // so the element keeps its original proportions inside any layout.
  if (containerStyle) {
    return (
      <div className={`relative w-full bg-black ${className}`} style={containerStyle}>
        <video
          src={videoUrl}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          poster={poster}
          title={title}
        />
      </div>
    );
  }

  // While the natural dimensions are loading, let the <video> fall back to its
  // own intrinsic ratio (browsers will display it at the file's natural size).
  return (
    <video
      src={videoUrl}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      className={`w-full h-auto bg-black ${className}`}
      poster={poster}
      title={title}
    />
  );
}
