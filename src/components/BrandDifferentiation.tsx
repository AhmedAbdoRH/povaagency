import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarChart4, PieChart, Sparkles, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function BrandDifferentiation() {
  const { t } = useLanguage();

  const differentiators = [
    {
      title: t('brandDifferentiation.aspects.0.title'),
      description: t('brandDifferentiation.aspects.0.description'),
      icon: BarChart4,
      color: 'from-[#ee5239] to-[#ff7a64]'
    },
    {
      title: t('brandDifferentiation.aspects.1.title'),
      description: t('brandDifferentiation.aspects.1.description'),
      icon: PieChart,
      color: 'from-blue-500 to-cyan-400'
    },
    {
      title: t('brandDifferentiation.aspects.2.title'),
      description: t('brandDifferentiation.aspects.2.description'),
      icon: Sparkles,
      color: 'from-emerald-500 to-teal-400'
    },
    {
      title: t('brandDifferentiation.aspects.3.title'),
      description: t('brandDifferentiation.aspects.3.description'),
      icon: LifeBuoy,
      color: 'from-purple-500 to-pink-500'
    },
  ];
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative bg-[#000000] py-32 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(238,82,57,0.15),transparent_50%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">

          {/* Sticky Side */}
          <div className="lg:sticky lg:top-32 lg:w-1/2 lg:py-16">
            <motion.div
              initial={{ opacity: 0, x: language === 'ar' ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span>{t('brandDifferentiation.statusBadge')}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black leading-[1.6] mb-6"
            >
              {t('brandDifferentiation.heading')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-xl"
            >
              {t('brandDifferentiation.description')}
            </motion.p>
          </div>

          {/* Scrolling Items Side (Left in RTL) */}
          <div className="flex flex-col gap-8 lg:w-1/2">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: false }}
                transition={{ duration: 0.6 }}
                className="group relative rounded-3xl bg-[#0a0a0a] p-8 border border-white/5 transition-all hover:border-white/20 hover:bg-[#111111]"
              >
                <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-20 ${item.color}`} />

                <div className="relative z-10">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br mb-8 shadow-lg transition-transform duration-500 group-hover:scale-110 ${item.color}`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
