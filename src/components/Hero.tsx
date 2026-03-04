import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ArrowLeft,
  Sparkles,
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
            background: `radial-gradient(ellipse 600px 500px at ${mousePos.x}% ${mousePos.y}%, rgba(238,82,57,0.18) 0%, transparent 70%)`,
            transition: 'background 0.4s ease-out',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '80vw', height: '80vh', top: '10%', left: '5%',
            borderRadius: '50%', filter: 'blur(100px)', opacity: 0.5,
            background: 'radial-gradient(circle, rgba(238,82,57,0.2) 0%, rgba(248,160,74,0.08) 50%, transparent 70%)',
            animation: 'meshRotate 25s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '70vw', height: '70vh', bottom: '5%', right: '0%',
            borderRadius: '50%', filter: 'blur(120px)', opacity: 0.35,
            background: 'radial-gradient(circle, rgba(248,160,74,0.2) 0%, rgba(99,102,241,0.06) 60%, transparent 70%)',
            animation: 'meshRotateReverse 30s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', width: '50vw', height: '50vh', top: '30%', left: '40%',
            borderRadius: '50%', filter: 'blur(90px)', opacity: 0.25,
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            animation: 'meshRotate 35s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'pulseGrid 6s ease-in-out infinite',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Floating geometric shapes */}
      {[
        { top: '12%', left: '8%', size: 14, border: 'rgba(238,82,57,0.25)', anim: 'floatShape 8s ease-in-out infinite', delay: '0s' },
        { top: '70%', left: '15%', size: 8, border: 'rgba(248,160,74,0.2)', anim: 'floatShapeSlow 12s ease-in-out infinite', delay: '2s' },
        { top: '25%', left: '85%', size: 10, border: 'rgba(139,92,246,0.2)', anim: 'floatShape 10s ease-in-out infinite', delay: '4s' },
        { top: '80%', left: '78%', size: 6, border: 'rgba(238,82,57,0.15)', anim: 'floatShapeSlow 9s ease-in-out infinite', delay: '1s' },
        { top: '45%', left: '92%', size: 12, border: 'rgba(248,160,74,0.15)', anim: 'floatShape 14s ease-in-out infinite', delay: '3s' },
        { top: '5%', left: '50%', size: 7, border: 'rgba(255,255,255,0.08)', anim: 'floatShapeSlow 11s ease-in-out infinite', delay: '5s' },
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
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
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
          background: 'radial-gradient(circle, rgba(238,82,57,0.06) 0%, rgba(248,160,74,0.03) 40%, transparent 70%)',
          transition: 'left 0.5s ease-out, top 0.5s ease-out',
        }}
      />

      {/* Shimmer line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.015) 50%, transparent 100%)',
            animation: 'shimmer 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(8, 12, 20, 0.7) 100%)',
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
  { x: 44, y: 7, size: 2, color: '#ffffff', dur: 4.7 },
  { x: 62, y: 91, size: 3, color: '#ee5239', dur: 5.5 },
  { x: 29, y: 52, size: 2, color: '#ffffff', dur: 3.1 },
  { x: 91, y: 48, size: 3, color: '#f8a04a', dur: 4.3 },
  { x: 50, y: 35, size: 2, color: '#8b5cf6', dur: 7.2 },
  { x: 72, y: 55, size: 2, color: '#8b5cf6', dur: 5.8 },
  { x: 35, y: 88, size: 3, color: '#ee5239', dur: 4.5 },
  { x: 15, y: 40, size: 2, color: '#f8a04a', dur: 6.3 },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
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

  useEffect(() => {
    // Initial entrance animation - start tilted, then ease to flat
    smoothMx.set(0.3);
    smoothMy.set(-0.3);

    const timer = setTimeout(() => {
      smoothMx.set(0);
      smoothMy.set(0);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      // Use setTimeout to ensure the entrance animation finishes before video plays
      const playTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => setIsPlaying(false));
        }
      }, 1800);

      return () => clearTimeout(playTimer);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  const togglePlay = () => {
    if (!videoRef.current) return;
    isPlaying ? videoRef.current.pause() : videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setLiked(v => !v);
    setLikeCount(v => liked ? v - 1 : v + 1);
  };

  const scrollToServices = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      dir="rtl"
      className="relative min-h-screen bg-[#080c14] overflow-hidden flex items-center pt-6 sm:pt-8"
    >
      {/* ── inject keyframes ── */}
      <style>{heroStyles}</style>

      {/* ── interactive background ── */}
      <InteractiveBackground />

      {/* subtle top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none z-[1]" />
      {/* Bottom edge glow */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#080c14] to-transparent pointer-events-none z-[1]" />

      {particles.map((o, i) => <Particle key={i} {...o} />)}

      {/* ── main layout ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 z-10 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: copy ── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="order-2 lg:order-1 text-right max-w-xl mr-auto"
          >
            {/* tag */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent text-xs sm:text-sm font-semibold rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              حلول تسويق بصياغة تنفيذية احترافية
            </motion.div>

            {/* headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[1.25] mb-8 tracking-tight">
              {[
                { text: 'نحول الهوية', delay: 0.5, gradient: false },
                { text: 'إلى حضور رقمي', delay: 0.65, gradient: true },
                { text: 'يلفت ويبيع', delay: 0.8, gradient: false },
              ].map(({ text, delay, gradient }) => (
                <motion.span
                  key={text}
                  className={`block py-1 ${gradient ? 'text-transparent bg-clip-text' : ''}`}
                  style={gradient ? { backgroundImage: 'linear-gradient(95deg, #ee5239 10%, #f8a04a 90%)', paddingBottom: '0.1em' } : {}}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {text}
                </motion.span>
              ))}
            </h1>

            {/* description */}
            <motion.p
              className="text-white/65 text-base sm:text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.55 }}
            >
              في <span className="text-white font-semibold">POVA</span> نبني لك تجربة متكاملة من الفكرة إلى التنفيذ،
              بمحتوى مدروس وهوية بصرية واضحة تساعدك على تحقيق أهدافك بثقة.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <button
                onClick={scrollToServices}
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-white text-[#080c14] font-bold text-base px-7 py-3.5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-white/25 hover:-translate-y-1 active:scale-95"
              >
                ابدأ مشروعك الآن
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
              </button>

              <Link
                to="/design-request"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 bg-accent font-bold text-white text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-accent/35 transition-all duration-300 hover:bg-accent/90 hover:-translate-y-1 hover:shadow-accent/50 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                تعاون معنا
              </Link>
            </motion.div>

            {/* trust row */}
            <motion.div
              className="flex items-center gap-5 mt-8 sm:justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {['#ee5239', '#f8a04a', '#6366f1', '#22d3ee'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#080c14]"
                    style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }}
                  />
                ))}
              </div>
              <p className="text-white/50 text-sm">
                <span className="text-white font-semibold">+120</span> عميل راضٍ
              </p>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                ★★★★★
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 flex justify-center lg:justify-start relative mt-16 lg:mt-0"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* glow behind phone */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-56 h-[32rem] rounded-full blur-[80px] opacity-40"
                style={{ background: 'radial-gradient(ellipse, #ee5239 0%, #f8a04a 60%, transparent 100%)' }}
              />
            </div>

            {/* tilt container */}
            <motion.div
              ref={phoneRef}
              style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="relative group"
            >
              {/* ── premium phone shell ── */}
              <div
                className="relative w-[260px] sm:w-[280px] rounded-[3.5rem] overflow-hidden p-[8px]"
                style={{
                  background: 'linear-gradient(145deg, #3a3f58 0%, #1c1f2e 40%, #080a10 100%)',
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.1) inset,
                    0 50px 100px -20px rgba(0,0,0,0.8),
                    0 30px 60px -30px rgba(238,82,57,0.3)
                  `,
                  transform: 'translateZ(20px)'
                }}
              >
                {/* inner bezel */}
                <div className="absolute inset-0 rounded-[3.5rem] pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 4px 6px -1px rgba(255, 255, 255, 0.1), inset 0 2px 4px -1px rgba(255, 255, 255, 0.06)'
                  }}
                />

                {/* side buttons */}
                <div
                  className="absolute -right-1 top-32 w-1.5 h-16 rounded-l-md pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, #4a4f68, #2a2f48)', boxShadow: '-1px 0 2px rgba(0,0,0,0.5)' }}
                />
                <div
                  className="absolute -left-1 top-24 w-1.5 h-10 rounded-r-md pointer-events-none"
                  style={{ background: 'linear-gradient(-90deg, #4a4f68, #2a2f48)', boxShadow: '1px 0 2px rgba(0,0,0,0.5)' }}
                />
                <div
                  className="absolute -left-1 top-40 w-1.5 h-12 rounded-r-md pointer-events-none"
                  style={{ background: 'linear-gradient(-90deg, #4a4f68, #2a2f48)', boxShadow: '1px 0 2px rgba(0,0,0,0.5)' }}
                />

                {/* ── screen container ── */}
                <div className="relative w-full h-full rounded-[3rem] overflow-hidden bg-black isolation-isolate z-10" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>

                  {/* dynamic island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-50 flex items-center justify-between px-2.5">
                    {/* camera lens */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/5 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-blue-500/30 blur-[1px]" />
                    </div>
                    {/* sensor */}
                    <div className="w-2 h-2 rounded-full bg-[#111]" />
                  </div>

                  {/* ── status bar ── */}
                  <div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 pt-3.5 pb-2 z-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                    <span className="text-white/90 text-[11px] font-medium tracking-wide">9:41</span>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <div className="w-[22px] h-[11px] rounded-[3px] border border-white/60 flex items-center px-0.5 relative">
                        <div className="bg-white h-[7px] w-4/5 rounded-[1px]" />
                        <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-white/60 rounded-r-sm" />
                      </div>
                    </div>
                  </div>

                  {/* ── video area ── */}
                  <div className="relative overflow-hidden w-full" style={{ aspectRatio: '9/19.5' }}>
                    <video
                      ref={videoRef}
                      autoPlay={false} playsInline muted
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    >
                      <source src="/hero_video.mp4" type="video/mp4" />
                    </video>
                  </div>

                  {/* scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/25 pointer-events-none" />

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
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center"
                      >
                        <Play className="w-7 h-7 text-white fill-white ms-1" />
                      </motion.div>
                    )}
                  </button>

                  {/* ── right-side action bar ── */}
                  <motion.div
                    style={{ translateZ: 40 }}
                    className="absolute bottom-20 right-3 flex flex-col items-center gap-4 z-20"
                  >
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleLike}
                      className="flex flex-col items-center gap-1 group/btn"
                      aria-label="إعجاب"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-white/10 ${liked ? 'bg-red-500/20 backdrop-blur-xl' : 'bg-black/30 backdrop-blur-xl group-hover/btn:bg-black/50'}`}>
                        <Heart className={`w-5 h-5 transition-all duration-300 ${liked ? 'text-red-500 fill-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-white drop-shadow-md'}`} />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">
                        {likeCount.toLocaleString('ar-EG')}
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex flex-col items-center gap-1 group/btn"
                      aria-label="تعليق"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg transition-colors group-hover/btn:bg-black/50">
                        <MessageCircle className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">٢٣١</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className="flex flex-col items-center gap-1 group/btn"
                      aria-label="مشاركة"
                    >
                      <div className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-lg transition-colors group-hover/btn:bg-black/50">
                        <Send className="w-5 h-5 text-white drop-shadow-md -ml-0.5" />
                      </div>
                      <span className="text-white/90 text-[10px] font-bold drop-shadow-md">شارك</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setSaved(v => !v)}
                      className="flex flex-col items-center gap-1 group/btn"
                      aria-label="حفظ"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-white/10 ${saved ? 'bg-accent/20 backdrop-blur-xl' : 'bg-black/30 backdrop-blur-xl group-hover/btn:bg-black/50'}`}>
                        <Bookmark className={`w-5 h-5 transition-all duration-300 ${saved ? 'text-accent fill-accent drop-shadow-[0_0_8px_rgba(238,82,57,0.5)]' : 'text-white drop-shadow-md'}`} />
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* ── bottom info ── */}
                  <motion.div
                    style={{ translateZ: 30 }}
                    className="absolute bottom-6 left-4 right-16 z-20"
                  >
                    <div className="flex items-center gap-2.5 mb-2 relative">
                      <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden border-2 border-white/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{ background: 'linear-gradient(135deg, #ee5239, #f8a04a)' }} />
                      <div className="flex flex-col bg-black/30 backdrop-blur-md rounded-lg px-2 py-1 border border-white/5">
                        <p className="text-white text-[12px] font-bold drop-shadow-md leading-none mb-1">pova_agency</p>
                        <p className="text-accent text-[9px] font-medium">وكالة تسويق رقمي</p>
                      </div>
                      <button className="mr-auto text-[10px] font-bold text-white bg-accent/80 hover:bg-accent backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 transition-colors shadow-lg">
                        متابعة
                      </button>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md rounded-xl p-2 border border-white/5">
                      <p className="text-white/90 text-[11px] leading-relaxed line-clamp-2 drop-shadow-md">
                        استراتيجية + إبداع + تنفيذ دقيق = نمو مستمر لعلامتك 🚀✨
                      </p>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[10px] text-accent font-bold drop-shadow-sm">#تسويق</span>
                        <span className="text-[10px] text-white/80 font-medium">#هوية_بصرية</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* bottom home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-[4px] bg-white/50 backdrop-blur-sm rounded-full z-40 shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />

                  {/* dynamic light reflection (glare) */}
                  <motion.div
                    className="absolute inset-0 z-50 pointer-events-none rounded-[3rem]"
                    style={{
                      background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.15) 0%, transparent 60%)',
                      // @ts-ignore
                      '--x': glareX,
                      '--y': glareY,
                    }}
                  />

                  {/* static ambient reflection */}
                  <div
                    className="absolute inset-0 rounded-[3rem] pointer-events-none z-30"
                    style={{
                      background: 'linear-gradient(105deg, rgba(255,255,255,0.08) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.03) 100%)',
                    }}
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
        onClick={scrollToServices}
      >
        <span className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
