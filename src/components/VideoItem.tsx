import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [showTitle, setShowTitle] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // نستخدم المقاس الأصلي للفيديو متى توفر، أو نسبة 9:16 إذا كان محدداً يدوياً بأنه طولي
  const containerStyle: React.CSSProperties | undefined = isVerticalVideo
    ? { aspectRatio: '9 / 16' }
    : aspectRatio
      ? { aspectRatio: `${aspectRatio.width} / ${aspectRatio.height}` }
      : undefined;

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowTitle(false); // إخفاء العنوان بعد بدء التشغيل
      }
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Show title again when video ends or paused
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setShowTitle(true);
    };

    const handlePause = () => {
      setShowTitle(true);
    };

    const handlePlay = () => {
      setShowTitle(false);
    };

    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handlePause);
    video.addEventListener('play', handlePlay);
    
    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('play', handlePlay);
    };
  }, []);

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

  // Direct video file with custom controls
  const VideoWithCustomControls = (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black group ${className}`} 
      style={containerStyle}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        controls={false} // إخفاء عناصر التحكم الأصلية
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
      />

      {/* Video Title - يختفي أثناء التشغيل */}
      <AnimatePresence>
        {title && showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent p-6 pointer-events-none z-20"
          >
            <h3 className="text-white text-lg md:text-xl font-bold drop-shadow-lg">
              {title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Controls - يختفي تماماً أثناء التشغيل */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center z-10"
          >
            {/* Play Button - كبير في المنتصف */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-2xl transition-colors duration-200"
              aria-label="Play"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="white" />
            </motion.button>

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex items-center justify-end gap-2">
              {/* Fullscreen Button */}
              <motion.button
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-lg transition-colors duration-200"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay - يظهر فقط عند hover أثناء التشغيل */}
      <AnimatePresence>
        {isPlaying && showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/10 flex items-center justify-center z-10"
          >
            {/* Pause Button - يظهر عند hover */}
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-2xl transition-colors duration-200"
              aria-label="Pause"
            >
              <Pause className="w-8 h-8 md:w-10 md:h-10" fill="white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click overlay to play/pause */}
      <div 
        className="absolute inset-0 cursor-pointer z-0"
        onClick={togglePlay}
      />
    </div>
  );

  if (containerStyle) {
    return VideoWithCustomControls;
  }

  // While the natural dimensions are loading
  return (
    <div className={`relative w-full bg-black ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        controls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-auto object-contain"
        poster={poster}
        onClick={togglePlay}
      />
      
      {/* العنوان - يظهر فقط عند التوقف */}
      <AnimatePresence>
        {title && showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent p-6 pointer-events-none z-20"
          >
            <h3 className="text-white text-lg md:text-xl font-bold drop-shadow-lg">
              {title}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* عناصر التحكم - عند التوقف فقط */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center z-10"
          >
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-2xl transition-colors duration-200"
            >
              <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="white" />
            </motion.button>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex items-center justify-end gap-2">
              <motion.button
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-lg transition-colors duration-200"
              >
                <Maximize className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر الإيقاف - يظهر عند hover أثناء التشغيل */}
      <AnimatePresence>
        {isPlaying && showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/10 flex items-center justify-center z-10"
          >
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#ec533a] hover:bg-[#f56b52] text-white flex items-center justify-center shadow-2xl transition-colors duration-200"
            >
              <Pause className="w-8 h-8 md:w-10 md:h-10" fill="white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="absolute inset-0 cursor-pointer z-0"
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />
    </div>
  );
}
