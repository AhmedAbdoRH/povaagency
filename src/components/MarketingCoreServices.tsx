import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { resolveCoreServicesWithPages } from '../data/coreServices';
import { useLanguage } from '../hooks/useLanguage';

export default function MarketingCoreServices() {
  const { t, language } = useLanguage();
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPages = async () => {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('id, name, name_en, description, description_en, image_url, banner_url, is_active, display_order, created_at, updated_at')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (isMounted) setPages(data || []);
      } catch (err) {
        console.error('Error fetching pages for core services:', err);
      }
    };

    fetchPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const linkedCoreServices = resolveCoreServicesWithPages(pages);

  return (
    <section id="services-section" className="relative overflow-hidden bg-[#050505] py-16 pt-20 text-white">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[150px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[150px] mix-blend-screen" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-4xl pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="h-5 w-5 animate-pulse text-accent" />
            <span className="text-sm font-bold tracking-wider text-gray-200">{t('marketingCoreServices.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold leading-[1.5] text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: '0 0 30px rgba(238,82,57,0.3)' }}
          >
            {t('marketingCoreServices.heading')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed text-gray-400 md:text-xl"
          >
            {t('marketingCoreServices.description')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {linkedCoreServices.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -12, scale: 1.05, transition: { duration: 0.3 } }}
              className={`group relative overflow-hidden rounded-3xl border bg-[#0d0d0d] p-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-[#151515] hover:shadow-2xl ${service.borderColor}`}
            >
              <Link
                to={`/service/${service.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`الانتقال إلى ${service.title}`}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-100 transition-opacity duration-500`}
              />

              <div className="pointer-events-none relative z-10 flex h-full flex-col">
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`h-16 w-16 scale-110 rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-lg transition-transform duration-500 ease-out group-hover:scale-125 ${service.iconColor} flex items-center justify-center`}
                  >
                    <service.icon className="h-8 w-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={1.5} />
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 opacity-100 transition-all duration-300 group-hover:border-white group-hover:bg-white">
                    <svg
                      className={`h-4 w-4 rotate-180 transition-colors group-hover:text-black ${service.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                <h3 className="mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold leading-[1.4] text-transparent transition-all duration-300 group-hover:to-white">
                  {language === 'en' ? (service.page?.name_en || service.title) : service.title}
                </h3>

                <p className="flex-grow leading-relaxed text-gray-300 transition-colors duration-300 group-hover:text-white">
                  {language === 'en' ? (service.page?.description_en || service.description) : service.description}
                </p>

                <div className="mt-6 text-sm text-gray-400">
                  {service.page ? 'مرتبطة ببيانات جاهزة' : 'بانتظار ربط بياناتها من لوحة التحكم'}
                </div>
              </div>

              <service.icon
                className={`pointer-events-none absolute -bottom-8 -left-8 h-44 w-44 rotate-12 opacity-10 transition-all duration-1000 ease-in-out group-hover:rotate-45 group-hover:scale-125 ${service.iconColor}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
