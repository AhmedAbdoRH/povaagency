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
    <section id="services-section" className="relative overflow-hidden bg-[#162341] py-16 pt-20 text-white">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[150px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto mb-12 max-w-4xl pb-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-2 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-5 w-5 animate-pulse text-yellow-400" />
            <span className="text-sm font-bold tracking-wider text-gray-300">{t('marketingCoreServices.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-extrabold leading-[1.5] text-[#ec533a] md:text-5xl lg:text-6xl"
          >
            {t('marketingCoreServices.heading')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-relaxed text-gray-300 md:text-xl"
          >
            {t('marketingCoreServices.description')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {linkedCoreServices.map((service, index) => {
            const cardNumber = String(index + 1).padStart(2, '0');
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                className="group relative h-full w-full cursor-pointer"
              >
                {/* 3D Offset Solid Shadow (Orange-Red) */}
                <div 
                  className="absolute inset-0 rounded-tl-[50px] rounded-br-[50px] rounded-tr-2xl rounded-bl-2xl bg-[#ec533a] opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-4 group-hover:-translate-x-4" 
                />

                {/* Main Card */}
                <div 
                  className="relative flex h-full w-full flex-col overflow-hidden rounded-tl-[50px] rounded-br-[50px] rounded-tr-2xl rounded-bl-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2"
                >
                  <Link
                    to={`/service/${service.slug}`}
                    className="absolute inset-0 z-20"
                    aria-label={language === 'en' ? `Go to ${service.page?.name_en || service.title}` : `الانتقال إلى ${service.title}`}
                  />
                  
                  {/* Hover Sweep Background (Navy) */}
                  <div className="absolute -inset-1 z-0 origin-bottom-left scale-0 rounded-tl-[50px] rounded-br-[50px] rounded-tr-2xl rounded-bl-2xl bg-gradient-to-br from-[#162341] to-[#0c1426] opacity-0 transition-all duration-700 ease-out group-hover:scale-150 group-hover:opacity-100" />
                  
                  {/* Glowing Accent Orb inside Hover */}
                  <div className="absolute -top-24 -right-24 z-0 h-64 w-64 rounded-full bg-[#ec533a] blur-[60px] opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-50" />

                  <div className="relative z-10 flex h-full flex-col">
                    {/* Header: Number and Icon */}
                    <div className="mb-8 flex items-center justify-between">
                      {/* Icon Box */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff0ed] shadow-inner transition-all duration-500 group-hover:bg-[#ec533a] group-hover:shadow-[0_10px_20px_rgba(236,83,58,0.4)] group-hover:rotate-12 group-hover:scale-110">
                        <service.icon className="relative z-10 h-10 w-10 text-[#ec533a] transition-colors duration-500 group-hover:text-white" strokeWidth={1.5} />
                      </div>

                      {/* Number */}
                      <div className="text-7xl font-black text-gray-100 transition-colors duration-500 group-hover:text-white/10">
                        {cardNumber}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 text-2xl font-black text-[#162341] transition-colors duration-500 group-hover:text-white">
                      {language === 'en' ? (service.page?.name_en || service.title) : service.title}
                    </h3>

                    {/* Description */}
                    <p className="flex-grow text-base font-bold leading-relaxed text-gray-500 transition-colors duration-500 group-hover:text-gray-300">
                      {language === 'en' ? (service.page?.description_en || service.description) : service.description}
                    </p>

                    {/* Animated Divider */}
                    <div className="my-6 h-[4px] w-12 rounded-full bg-[#ec533a] transition-all duration-500 group-hover:w-full group-hover:bg-[#ec533a]/80" />

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#162341] transition-colors duration-500 group-hover:text-white">
                        {t('hero.ctaCollaborate')}
                      </span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ec533a] text-white shadow-[0_4px_15px_rgba(236,83,58,0.3)] transition-all duration-500 group-hover:bg-white group-hover:text-[#ec533a] group-hover:scale-110">
                        <svg
                          className={`h-5 w-5 transition-transform duration-500 ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Background Icon */}
                  <service.icon className="pointer-events-none absolute -bottom-12 -left-12 z-0 h-56 w-56 -rotate-12 text-gray-100 opacity-80 transition-all duration-700 ease-in-out group-hover:rotate-12 group-hover:scale-110 group-hover:text-white/5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}