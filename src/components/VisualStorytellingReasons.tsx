import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquareText, Sparkles, BadgeCheck, Camera, Heart, PlayCircle, Film } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function ParallaxCard({ reason, index }: { reason: any; index: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create a subtle parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [reason.offset, -reason.offset]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`relative w-full max-w-lg rounded-[2.5rem] md:rounded-full bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-md transition-colors hover:bg-white/10 ${isEven ? 'md:mr-auto' : 'md:ml-auto md:mr-0'}`}
    >
        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-full bg-gradient-to-r from-accent/0 via-accent/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
        
        <div className={`relative z-10 flex flex-col md:flex-row items-center gap-6 ${language === 'ar' ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
            <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-accent/20 border border-accent/30 text-accent shadow-[0_0_30px_rgba(238,82,57,0.3)]">
                <reason.icon className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            
            <div className="flex-1">
                <div className={`flex items-center justify-center ${language === 'ar' ? 'md:justify-start' : 'md:justify-start'} gap-4 mb-2`}>
                    <span className="text-2xl md:text-3xl font-black text-white/10">{reason.id}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{reason.title}</h3>
                </div>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">{reason.description}</p>
            </div>
        </div>
    </motion.div>
  );
}

export default function VisualStorytellingReasons() {
  const { t } = useLanguage();

  const reasonIcons = [MessageSquareText, Sparkles, BadgeCheck, Camera, Heart, PlayCircle];
  const offsets = [20, -20, 30, -30, 20, -20];

  const reasons = Array.from({ length: 6 }, (_, index) => ({
    id: String(index + 1).padStart(2, '0'),
    title: t(`visualStorytellingReasons.reasons.${index}.title`),
    description: t(`visualStorytellingReasons.reasons.${index}.description`),
    icon: reasonIcons[index],
    offset: offsets[index],
  }));

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 -right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-24 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent backdrop-blur-sm"
            >
                <Film className="h-4 w-4" />
                <span>{t('visualStorytellingReasons.statusBadge')}</span>
            </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.6] text-white mb-6"
          >
            {t('visualStorytellingReasons.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            {t('visualStorytellingReasons.description')}
          </motion.p>
        </div>

        <div className="mx-auto max-w-4xl flex flex-col gap-10 md:gap-16">
          {reasons.map((reason, index) => (
            <ParallaxCard key={reason.id} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
