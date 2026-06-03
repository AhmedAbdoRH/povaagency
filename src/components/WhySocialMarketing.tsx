import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function Card({ item, index, activeIndex }: { item: any; index: number; activeIndex: number }) {
  const { language } = useLanguage();
  const isActive = index === activeIndex;
  const offset = index - activeIndex;

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

  return (
    <motion.div
      key={item.title}
      className="absolute w-full max-w-4xl"
      initial={false}
      animate={{
        zIndex: isActive ? 10 : Math.max(0, 10 - Math.abs(offset)),
        x: isActive ? 0 : (language === 'ar' ? offset * -120 : offset * 120),
        y: isActive ? 0 : Math.abs(offset) * 15,
        z: isActive ? 0 : Math.abs(offset) * -80,
        rotateY: isActive ? 0 : (language === 'ar' ? (offset > 0 ? 25 : -25) : (offset > 0 ? -25 : 25)),
        rotateX: isActive ? 0 : 5,
        opacity: isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.3),
        scale: isActive ? 1 : 0.85,
      }}
      transition={{
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1], // easeOutBack for smoother 3D transition
      }}
      style={{
        perspective: '1500px',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex w-full flex-col items-center gap-8 rounded-3xl border-2 bg-white p-8 backdrop-blur-xl md:flex-row md:p-12"
        style={{
          borderColor: isActive ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)',
          boxShadow: isActive
            ? '0 30px 60px -15px rgba(0,0,0,0.15), 0 15px 25px -5px rgba(0,0,0,0.06)'
            : '0 10px 30px -10px rgba(0,0,0,0.1)',
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        whileHover={isActive ? { scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div 
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-5 ${item.color}`} 
          style={{ transform: "translateZ(-20px)" }}
        />
        <div 
          className={`absolute ${language === 'ar' ? '-right-20' : '-left-20'} -top-20 h-40 w-40 rounded-full bg-gradient-to-br blur-[80px] opacity-20 ${item.color}`} 
          style={{ transform: "translateZ(-40px)" }}
        />

        <div 
          className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl ${item.color}`}
          style={{ transform: "translateZ(50px)" }}
        >
          <item.icon className="h-10 w-10 text-white" />
        </div>

        <div 
          className={`flex-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'} z-10`}
          style={{ transform: "translateZ(30px)" }}
        >
          <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{item.title}</h3>
          <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WhySocialMarketing() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-flip cards every 4 seconds, but pause on user interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [highlights.length]);

return (
    <section className="relative bg-white py-20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(238,82,57,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20 text-center">
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

        {/* Stacked Cards Container */}
        <div className="container mx-auto px-4">
          <div className="relative h-[500px] md:h-[450px] flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-full">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className="cursor-pointer"
                >
                  <Card
                    item={item}
                    index={index}
                    activeIndex={currentIndex}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
