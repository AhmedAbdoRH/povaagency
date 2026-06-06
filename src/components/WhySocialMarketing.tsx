import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function Card({
  item,
  index,
  activeIndex,
  isMobile,
  onClick,
  total,
  setCurrentIndex,
}: {
  item: any;
  index: number;
  activeIndex: number;
  isMobile: boolean;
  onClick: () => void;
  total: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { language } = useLanguage();
  const isActive = index === activeIndex;

  // Calculate circular offset for seamless wrap-around animation
  let offset = index - activeIndex;
  if (offset < -total / 2) offset += total;
  if (offset > total / 2) offset -= total;

  const ref = useRef<HTMLDivElement>(null);
  
  // 3D Hover Effect variables
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const swipeThreshold = 50;
  const onDragEnd = (_e: any, info: any) => {
    if (!isActive) return;
    const swipe = info.offset.x;
    if (language === 'ar') {
      if (swipe < -swipeThreshold) {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
      } else if (swipe > swipeThreshold) {
        setCurrentIndex((prev) => (prev + 1) % total);
      }
    } else {
      if (swipe < -swipeThreshold) {
        setCurrentIndex((prev) => (prev + 1) % total);
      } else if (swipe > swipeThreshold) {
        setCurrentIndex((prev) => (prev - 1 + total) % total);
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        key={item.title}
        className="pointer-events-auto w-[90vw] max-w-[340px] md:w-[560px] md:max-w-none"
        initial={false}
        animate={{
          zIndex: isActive ? 10 : Math.max(0, 10 - Math.abs(offset)),
          x: offset * (isMobile ? 35 : 220) * (language === 'ar' ? -1 : 1),
          y: isActive ? 0 : Math.abs(offset) * (isMobile ? 6 : 12),
          z: isActive ? 0 : Math.abs(offset) * (isMobile ? -30 : -150),
          rotateY: isActive ? 0 : (isMobile ? (offset * -12 * (language === 'ar' ? -1 : 1)) : (offset * -30 * (language === 'ar' ? -1 : 1))),
          rotateX: isActive ? 0 : (isMobile ? 0 : 5),
          opacity: isActive ? 1 : Math.max(0, 1.2 - Math.abs(offset) * 0.4),
          scale: isActive ? 1 : (isMobile ? 0.92 : 0.82),
        }}
        transition={{
          duration: 0.65,
          ease: [0.25, 1, 0.5, 1], // Custom easeOut cubic transition for buttery smoothness
        }}
        style={{
          perspective: isMobile ? '800px' : '1600px',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        drag={isActive ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={onDragEnd}
        onClick={onClick}
      >
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex w-full flex-col items-center gap-6 rounded-[2rem] border bg-white/95 p-6 backdrop-blur-xl md:flex-row md:p-10 md:gap-8 overflow-hidden group select-none cursor-pointer"
          style={{
            borderColor: isActive ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)',
            boxShadow: isActive
              ? '0 30px 60px -15px rgba(0,0,0,0.12), 0 15px 30px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)'
              : '0 8px 24px -12px rgba(0,0,0,0.06)',
            rotateX: isActive && !isMobile ? rotateX : 0,
            rotateY: isActive && !isMobile ? rotateY : 0,
            transformStyle: 'preserve-3d',
          }}
          whileHover={isActive ? { 
            scale: 1.02,
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15), 0 20px 40px -10px rgba(0,0,0,0.08)'
          } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {/* Subtle gradient overlay to mimic premium light reflection */}
          <div 
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-[0.03] ${item.color} transition-opacity duration-300 group-hover:opacity-[0.06]`} 
            style={{ transform: "translateZ(-20px)" }}
          />
          
          {/* Glowing Orb in Center (Light Mode Premium Variant) */}
          <motion.div 
            className={`absolute ${language === 'ar' ? '-right-16' : '-left-16'} -top-16 h-36 w-36 rounded-full bg-gradient-to-br blur-[60px] opacity-15 ${item.color}`} 
            style={{ transform: "translateZ(-40px)" }}
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
              transform: "translateZ(10px)",
            }}
            initial={{ x: '-100%', opacity: 0 }}
            whileHover={{ x: '100%', opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Icon Container with 3D Depth */}
          <motion.div 
            className={`relative flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md ${item.color}`}
            style={{ transform: "translateZ(50px)" }}
            animate={{
              rotateY: [0, 8, 0, -8, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.08,
              rotateZ: 4,
              transition: { duration: 0.3 }
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm" style={{ transform: "translateZ(-5px)" }} />
            <motion.div
              animate={{
                y: [0, -4, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <item.icon className="h-9 w-9 md:h-11 md:w-11 text-white drop-shadow-md relative z-10" />
            </motion.div>
          </motion.div>

          {/* Content with 3D Depth */}
          <div 
            className={`flex-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'} z-10 relative`}
            style={{ transform: "translateZ(30px)" }}
          >
            <h3 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl relative">
              <span className="relative z-10">{item.title}</span>
            </h3>
            
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              {item.description}
            </p>
          </div>

          {/* Active Card Glow border */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-[2rem] border border-gray-200/60 pointer-events-none"
              animate={{
                scale: [1, 1.01, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transform: "translateZ(15px)" }}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function WhySocialMarketing() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const highlights = [
    {
      title: t('whySocialMarketing.highlights.0.title'),
      description: t('whySocialMarketing.highlights.0.description'),
      icon: Eye,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: t('whySocialMarketing.highlights.1.title'),
      description: t('whySocialMarketing.highlights.1.description'),
      icon: Handshake,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: t('whySocialMarketing.highlights.2.title'),
      description: t('whySocialMarketing.highlights.2.description'),
      icon: Target,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: t('whySocialMarketing.highlights.3.title'),
      description: t('whySocialMarketing.highlights.3.description'),
      icon: DollarSign,
      color: 'from-purple-500 to-fuchsia-500',
    },
    {
      title: t('whySocialMarketing.highlights.4.title'),
      description: t('whySocialMarketing.highlights.4.description'),
      icon: BarChart3,
      color: 'from-pink-500 to-rose-500',
    },
  ];

  // Auto-flip cards every 4 seconds, resetting the interval on manual card change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex, highlights.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(238,82,57,0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            <span>{t('whySocialMarketing.statusBadge')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 max-w-3xl mx-auto px-6"
          >
            {(t('whySocialMarketing.heading').split('\n')).map((line, i) => (
              <span key={i} className="block mb-4 last:mb-0">{line}</span>
            ))}
          </motion.h2>
        </div>

        {/* Stacked Cards Container - 100% Mobile Safe Overflow Handling */}
        <div className="w-full overflow-hidden px-4 py-8">
          <div className="relative flex h-[520px] items-center justify-center md:h-[480px]">
            <div className="relative h-full w-full max-w-5xl">
              {highlights.map((item, index) => (
                <Card
                  key={index}
                  item={item}
                  index={index}
                  activeIndex={currentIndex}
                  isMobile={isMobile}
                  onClick={() => setCurrentIndex(index)}
                  total={highlights.length}
                  setCurrentIndex={setCurrentIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
