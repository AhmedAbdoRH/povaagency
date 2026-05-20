import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function Card({ item, index, progress, targetScale }: { item: any; index: number; progress: any; targetScale: number }) {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(progress, [index * 0.2, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <div ref={containerRef} className="sticky top-24 flex h-[80vh] items-start justify-center pt-[5vh] pb-12">
      <motion.div
        style={{ scale, opacity, y, top: `calc(2vh + ${index * 20}px)` }}
        className="relative flex w-full max-w-4xl flex-col items-center gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl md:flex-row md:p-12"
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
    </div>
  );
}

export default function WhySocialMarketing() {
  const { t, language } = useLanguage();

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

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className="relative bg-white pb-32">
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

        <div className="container mx-auto px-4">
          {highlights.map((item, index) => {
            const targetScale = 1 - (highlights.length - index) * 0.05;
            return (
              <Card
                key={index}
                index={index}
                item={item}
                progress={scrollYProgress}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
