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
      className={`relative w-full max-w-lg rounded-[2.5rem] md:rounded-full bg-white/95 border border-white/30 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-500 hover:bg-white hover:shadow-[0_30px_80px_rgba(0,0,0,0.2)] hover:-translate-y-1 ${isEven ? 'md:mr-auto' : 'md:ml-auto md:mr-0'}`}
    >
        <div className="absolute inset-0 rounded-[2.5rem] md:rounded-full bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
        
        <div className={`relative z-10 flex flex-col md:flex-row items-center gap-6 ${language === 'ar' ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
            <div className="flex h-16 w-16 md:h-20 md:w-20 shrink-0 items-center justify-center rounded-full bg-[#ec533a] border border-[#ec533a]/50 text-white shadow-[0_0_30px_rgba(238,82,57,0.5)]">
                <reason.icon className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            
            <div className="flex-1">
                <div className={`flex items-center justify-center ${language === 'ar' ? 'md:justify-start' : 'md:justify-start'} gap-4 mb-2`}>
                    <span className="text-2xl md:text-3xl font-black text-[#ec533a]/40">{reason.id}</span>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">{reason.title}</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">{reason.description}</p>
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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#ec533a] via-[#e03d24] to-[#b82815] py-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-1/4 -right-1/4 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-black/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-24 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm shadow-sm"
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
            className="text-lg text-white/80 font-medium max-w-2xl mx-auto"
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
