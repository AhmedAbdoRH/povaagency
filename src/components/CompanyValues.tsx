import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, Landmark, Brain, Users, TrendingUp, ShieldCheck, RefreshCcw, SunMedium, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function CompanyValues() {
  const { t, language } = useLanguage();

  const valueIcons = [Palette, Landmark, Brain, Users, TrendingUp, ShieldCheck, RefreshCcw, SunMedium];
  const valueColors = ['text-pink-500', 'text-amber-500', 'text-blue-500', 'text-green-500', 'text-emerald-500', 'text-indigo-500', 'text-cyan-500', 'text-orange-500'];
  const valueBgs = ['bg-pink-500/10', 'bg-amber-500/10', 'bg-blue-500/10', 'bg-green-500/10', 'bg-emerald-500/10', 'bg-indigo-500/10', 'bg-cyan-500/10', 'bg-orange-500/10'];

  const values = Array.from({ length: 8 }, (_, index) => ({
    title: t(`companyValues.values.${index}.title`),
    description: t(`companyValues.values.${index}.description`),
    icon: valueIcons[index],
    color: valueColors[index],
    bg: valueBgs[index]
  }));

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], language === 'en' ? ["85%", "0%"] : ["0%", "85%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#f8f9fa]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />

        <div className="container relative z-10 mx-auto px-4 w-full">
            <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm"
                >
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>{t('companyValues.statusBadge')}</span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.6]">
                    {t('companyValues.heading')}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                    {t('companyValues.description')}
                </p>
            </div>

            <motion.div style={{ x }} className="flex gap-8 w-max pl-8">
                {values.map((value, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div
                            key={index}
                            className={`w-[320px] md:w-[400px] shrink-0 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${isEven ? 'mt-0' : 'mt-16'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${value.bg} ${value.color}`}>
                                <value.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{value.title}</h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {value.description}
                            </p>
                        </div>
                    );
                })}
            </motion.div>
        </div>
      </div>
    </section>
  );
}
