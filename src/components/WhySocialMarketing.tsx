import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function Card({ item, index, activeIndex }: { item: any; index: number; activeIndex: number }) {
  const { language } = useLanguage();
  const isActive = index === activeIndex;
  const offset = index - activeIndex;

  return (
    <motion.div
      key={item.title}
      className="absolute w-full max-w-4xl"
      initial={false}
      animate={{
        zIndex: isActive ? 10 : Math.max(0, 10 - Math.abs(offset) * 2),
        y: offset * 12,
        rotateX: isActive ? 0 : 8,
        opacity: isActive ? 1 : 0.75,
        scale: isActive ? 1 : 0.95 + offset * 0.02,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative flex w-full flex-col items-center gap-8 rounded-3xl border-2 bg-white p-8 backdrop-blur-xl md:flex-row md:p-12"
        style={{
          borderColor: isActive ? 'rgb(229, 231, 235)' : 'rgb(243, 244, 246)',
          boxShadow: isActive
            ? '0 -10px 40px rgba(0,0,0,0.08), 0 0 60px rgba(0,0,0,0.03)'
            : '0 -5px 20px rgba(0,0,0,0.05), 0 0 30px rgba(0,0,0,0.02)',
        }}
        whileHover={isActive ? { scale: 1.02 } : {}}
      >
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-5 ${item.color}`} />
        <div className={`absolute ${language === 'ar' ? '-right-20' : '-left-20'} -top-20 h-40 w-40 rounded-full bg-gradient-to-br blur-[80px] opacity-20 ${item.color}`} />

        <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl ${item.color}`}>
          <item.icon className="h-10 w-10 text-white" />
        </div>

        <div className={`flex-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'} z-10`}>
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

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const handleNextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % highlights.length);
  };

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
                  onClick={() => handleCardClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(index);
                    }
                  }}
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

          {/* Navigation Buttons and Indicators */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrevCard}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Previous card"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="flex gap-2">
              {highlights.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextCard}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Next card"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
