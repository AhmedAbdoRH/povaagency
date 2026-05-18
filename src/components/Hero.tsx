import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import {
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Briefcase,
} from 'lucide-react';

/* ─── CSS for hero background animations ─── */
const heroStyles = `
@keyframes meshRotate {
  0% { transform: rotate(0deg) scale(1); }
  33% { transform: rotate(120deg) scale(1.1); }
  66% { transform: rotate(240deg) scale(0.95); }
  100% { transform: rotate(360deg) scale(1); }
}
@keyframes meshRotateReverse {
  0% { transform: rotate(0deg) scale(1.05); }
  33% { transform: rotate(-120deg) scale(0.9); }
  66% { transform: rotate(-240deg) scale(1.1); }
  100% { transform: rotate(-360deg) scale(1.05); }
}
@keyframes pulseGrid {
  0%, 100% { opacity: 0.04; }
  50% { opacity: 0.1; }
}
@keyframes floatShape {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
@keyframes floatShapeSlow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(-90deg); }
}
@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(25deg); }
  100% { transform: translateX(200%) rotate(25deg); }
}
`;

/* ─── Interactive Background ─── */
function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-auto" style={{ zIndex: 0 }}>
      {/* Animated mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          style={{
            position: 'absolute', width: '130%', height: '130%', top: '-15%', left: '-15%',
            background: `radial-gradient(ellipse 600px 500px at ${mousePos.x}% ${mousePos.y}%, rgba(255,120,90,0.18) 0%, transparent 70%)`,
            transition: 'background 0.4s ease-out',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '80vw', height: '80vh', top: '10%', left: '5%',
            borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5,
            background: 'radial-gradient(circle, rgba(220,38,38,0.6) 0%, rgba(185,28,28,0.2) 50%, transparent 70%)',
            animation: 'meshRotate 25s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '70vw', height: '70vh', bottom: '5%', right: '0%',
            borderRadius: '50%', filter: 'blur(120px)', opacity: 0.35,
            background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, rgba(127,29,29,0.3) 60%, transparent 70%)',
            animation: 'meshRotateReverse 30s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '50vw', height: '50vh', top: '30%', left: '40%',
            borderRadius: '50%', filter: 'blur(90px)', opacity: 0.2,
            background: 'radial-gradient(circle, rgba(248,160,74,0.25) 0%, transparent 70%)',
            animation: 'meshRotate 35s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'pulseGrid 6s ease-in-out infinite',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Floating geometric shapes */}
      {[
        { top: '12%', left: '8%', size: 14, border: 'rgba(255,200,180,0.3)', anim: 'floatShape 8s ease-in-out infinite', delay: '0s' },
        { top: '70%', left: '15%', size: 8, border: 'rgba(248,160,74,0.3)', anim: 'floatShapeSlow 12s ease-in-out infinite', delay: '2s' },
        { top: '25%', left: '85%', size: 10, border: 'rgba(255,255,255,0.2)', anim: 'floatShape 10s ease-in-out infinite', delay: '4s' },
        { top: '80%', left: '78%', size: 6, border: 'rgba(255,180,160,0.25)', anim: 'floatShapeSlow 9s ease-in-out infinite', delay: '1s' },
        { top: '45%', left: '92%', size: 12, border: 'rgba(248,160,74,0.2)', anim: 'floatShape 14s ease-in-out infinite', delay: '3s' },
        { top: '5%', left: '50%', size: 7, border: 'rgba(255,255,255,0.15)', anim: 'floatShapeSlow 11s ease-in-out infinite', delay: '5s' },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: s.top, left: s.left, width: s.size, height: s.size,
            border: `1px solid ${s.border}`, borderRadius: i % 2 === 0 ? '2px' : '50%',
            animation: s.anim, animationDelay: s.delay,
            transform: `rotate(${i * 45}deg)`,
          }}
        />
      ))}

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Mouse spotlight glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          left: `${mousePos.x}%`, top: `${mousePos.y}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,150,120,0.12) 0%, rgba(248,160,74,0.05) 40%, transparent 70%)',
          transition: 'left 0.5s ease-out, top 0.5s ease-out',
        }}
      />

      {/* Shimmer line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            animation: 'shimmer 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Radial vignette - dark edges for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(100,0,0,0.6) 100%)',
        }}
      />
    </div>
  );
}

/* ─── ambient particle ─── */
function Particle({ x, y, size, color, dur }: { x: number; y: number; size: number; color: string; dur: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`, width: size, height: size,
        background: color, filter: 'blur(1px)',
        boxShadow: `0 0 ${size * 3}px ${color}40`,
      }}
      animate={{ y: [0, -28, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

const particles = [
  { x: 6, y: 20, size: 4, color: '#ee5239', dur: 4 },
  { x: 18, y: 72, size: 3, color: '#f8a04a', dur: 5.2 },
  { x: 83, y: 14, size: 5, color: '#ee5239', dur: 3.6 },
  { x: 76, y: 82, size: 3, color: '#f8a04a', dur: 6.1 },
  { x: 44, y: 7, size: 2, color: '#1a1a1a', dur: 4.7 },
  { x: 62, y: 91, size: 3, color: '#ee5239', dur: 5.5 },
  { x: 29, y: 52, size: 2, color: '#1a1a1a', dur: 3.1 },
  { x: 91, y: 48, size: 3, color: '#f8a04a', dur: 4.3 },
  { x: 50, y: 35, size: 2, color: '#8b5cf6', dur: 7.2 },
  { x: 72, y: 55, size: 2, color: '#8b5cf6', dur: 5.8 },
  { x: 35, y: 88, size: 3, color: '#ee5239', dur: 4.5 },
  { x: 15, y: 40, size: 2, color: '#f8a04a', dur: 6.3 },
];

export default function Hero() {
  const { t, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(2847);

  /* tilt on mouse move with initial entrance animation */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Create smooth animated values for the tilt
  const smoothMx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.5 });
  const smoothMy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.5 });

  // Transform the smoothed values into rotation degrees
  // We add an initial tilt that will be animated out
  const rotateX = useTransform(smoothMy, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothMx, [-0.5, 0.5], [-12, 12]);

  // Calculate glare position based on mouse
  const glareX = useTransform(smoothMx, [-0.5, 0.5], ['100%', '-100%']);
  const glareY = useTransform(smoothMy, [-0.5, 0.5], ['100%', '-100%']);




  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.muted = false;
      videoRef.current.volume = 1;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleLike = () => {
    setLiked(v => !v);
    setLikeCount(v => liked ? v - 1 : v + 1);
  };

  const scrollToCollaboration = () => {
    document.getElementById('collaboration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center pt-0"
      style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 25%, #b91c1c 50%, #9f1919 75%, #6b1212 100%)' }}
    >
      {/* ── inject keyframes ── */}
      <style>{heroStyles}</style>

      {/* ── interactive background ── */}
      <InteractiveBackground />

      {/* subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent pointer-events-none z-[1]" />
      {/* Bottom edge glow */}
      <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-[1]" style={{ background: 'linear-gradient(to top, rgba(100,0,0,0.8), transparent)' }} />

      {particles.map((o, i) => <Particle key={i} {...o} />)}

      {/* ── main layout ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* ── LEFT: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className={`order-2 lg:order-1 ${language === 'ar' ? 'text-right max-w-xl mr-auto' : 'text-left max-w-xl ml-auto'}`}
          >
            {/* tag */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('hero.statusBadge')}
            </motion.div>

            {/* headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[1.1] mb-8 tracking-tight">
              {t('hero.title').split('\n').map((text, index, array) => (
                <motion.span
                  key={index}
                  className={`block py-1 ${index === 1 && array.length === 3 ? 'text-transparent bg-clip-text' : ''}`}
                  style={index === 1 && array.length === 3 ? { backgroundImage: 'linear-gradient(95deg, #ee5239 10%, #f8a04a 90%)', paddingBottom: '0.1em' } : {}}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {text}
                </motion.span>
              ))}
            </h1>

            {/* description */}
            <motion.p
              className="text-white/75 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.55 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA */}
            <motion.div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${language === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <button
                onClick={scrollToCollaboration}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-white text-red-800 font-bold text-sm sm:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-white/20 hover:-translate-y-1 active:scale-95"
              >
                {t('hero.cta')}
                {language === 'ar' ? (
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
                ) : (
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                )}
              </button>

              <button
                onClick={scrollToPortfolio}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 font-bold text-white text-sm sm:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              >
                <Briefcase className="w-4 h-4" />
                {t('hero.ctaCollaborate')}
              </button>
            </motion.div>


          </motion.div>

          {/* ── RIGHT: video (no phone frame) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`order-1 lg:order-2 flex justify-center ${language === 'ar' ? 'lg:justify-start' : 'lg:justify-end'} relative mt-8 lg:mt-0`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* glow behind video */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-96 h-[40rem] rounded-full blur-[120px] opacity-25"
                style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 60%, transparent 100%)' }}
              />
            </div>

            {/* tilt container */}
            <motion.div
              ref={phoneRef}
              style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, scale: 0.85, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative group"
            >
              {/* ── video card (no phone shell) ── */}
              <div
                className="relative w-[320px] sm:w-[400px] lg:w-[480px] rounded-[2rem] overflow-hidden"
                style={{
                  boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7), 0 20px 40px -10px rgba(245,158,11,0.15)',
                  transform: 'translateZ(20px)'
                }}
              >
                {/* ── video area ── */}
                <div className="relative overflow-hidden w-full group" style={{ aspectRatio: '9/16' }}>
                  <video
                    ref={videoRef}
                    autoPlay={false} playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  >
                    <source src="/hero_video.mp4" type="video/mp4" />
                  </video>

                  {/* scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none" />

                  {/* play/pause tap zone */}
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    aria-label="تشغيل/إيقاف"
                  >
                    {!isPlaying && (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                      >
                        <Play className="w-9 h-9 text-white fill-white ms-1" />
                      </motion.div>
                    )}
                  </button>

                  {/* ── right-side action bar ── */}
                  <div className="absolute bottom-24 right-4 flex flex-col items-center gap-5 z-20">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleLike}
                      className="flex flex-col items-center gap-1"
                      aria-label="إعجاب"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'text-red-500 fill-red-500 scale-110' : 'text-white'}`} />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">
                        {language === 'ar' ? likeCount.toLocaleString('ar-EG') : likeCount.toLocaleString('en-US')}
                      </span>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-1" aria-label="تعليق">
                      <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">{language === 'ar' ? '٢٣١' : '231'}</span>
                    </motion.button>

                    <motion.button whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-1" aria-label="مشاركة">
                      <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Send className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">{language === 'ar' ? 'شارك' : 'Share'}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSaved(v => !v)}
                      className="flex flex-col items-center gap-1"
                      aria-label="حفظ"
                    >
                      <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Bookmark className={`w-5 h-5 transition-all duration-300 ${saved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                      </div>
                    </motion.button>
                  </div>

                  {/* ── bottom info ── */}
                  <div className="absolute bottom-5 left-4 right-16 z-20">
                    <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2 border-white/30 shadow-lg bg-white flex items-center justify-center p-1">
                        <img src="/agency-logo.png" alt="Pova Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className={`flex flex-col flex-1 ${language === 'ar' ? 'items-end' : 'items-start'}`}>
                        <p className="text-white text-xs font-black tracking-tight drop-shadow-md">pova_agency</p>
                        <p className="text-amber-300 text-[9px] font-bold uppercase tracking-wider">وكالة تسويق رقمي</p>
                      </div>
                      <a
                        href="https://www.instagram.com/povaagency"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-white px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/15 transition-all active:scale-95 backdrop-blur-sm"
                      >
                        {language === 'ar' ? 'متابعة' : 'Follow'}
                      </a>
                    </div>
                  </div>

                  {/* ambient reflection */}
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none z-30"
                    style={{ background: 'linear-gradient(105deg, rgba(255,255,255,0.06) 0%, transparent 40%)' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* ── scroll cue ── */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        onClick={scrollToCollaboration}
      >
        <span className="text-white/50 text-[10px] tracking-widest uppercase mb-1">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
