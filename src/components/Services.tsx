import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { resolveCoreServicesWithPages } from '../data/coreServices';

export default function Services() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPages = async () => {
      try {
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('id, name, name_en, description, description_en, image_url, banner_url, is_active, display_order, created_at, updated_at')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (pagesError) throw pagesError;
        if (isMounted) setPages(pagesData || []);
      } catch (err) {
        console.error('Error fetching pages:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPages();

    return () => {
      isMounted = false;
    };
  }, []);

  const linkedCoreServices = resolveCoreServicesWithPages(pages);
  const routeByPageId = new Map(
    linkedCoreServices
      .filter(item => item.page)
      .map(item => [item.page!.id, `/service/${item.slug}`])
  );

  if (isLoading) {
    return (
      <div className="bg-primary py-20 text-center text-white">
        <div className="animate-pulse">{t('services.loading')}</div>
      </div>
    );
  }

  return (
    <section className="bg-primary py-20" id="services-section">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-bold text-white"
          >
            {t('services.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-400"
          >
            {t('services.description')}
          </motion.p>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 py-10 text-center text-gray-500">
            {t('services.emptyState')}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pages.map((page, index) => {
              const coreService = linkedCoreServices.find(cs => cs.page?.id === page.id);
              const iconColor = coreService?.iconColor || 'text-accent';

              // Map service slug to image filename or external URL
              const getImageForService = (slug: string | undefined) => {
                if (!slug) return null;
                const imageMap: Record<string, string> = {
                  'marketing-strategy': '/Marketing Strategy.jpg',
                  'content-creation': '/Content Creation.jpg',
                  'media-production': '/Media Production.jpg',
                  'brand-identity': '/Brand Identity.jpg',
                  'website-design': '/Website Design.jpg',
                  'social-media-campaigns': '/Social Media Campaigns.jpg',
                  'post-design': 'https://ibb.co/VYtQB7YW', 
                  'photography': '/Photography.jpg',
                };
                return imageMap[slug] || null;
              };

              const serviceImage = getImageForService(coreService?.slug);
              const displayImage = serviceImage || page.image_url;

              return (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-white/5 bg-[#162341]/80 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-accent/20"
                  onClick={() => navigate(routeByPageId.get(page.id) || `/page/${page.id}`)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {displayImage ? (
                      <>
                        <img
                          src={displayImage}
                          alt={page.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-[#162341]/60 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#162341]/95 via-[#162341]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0f1a33]">
                        <Layers className={`h-16 w-16 ${iconColor} opacity-60`} />
                      </div>
                    )}
                    
                    {coreService && (
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-[-10px] group-hover:translate-y-0">
                        <coreService.icon className={`h-5 w-5 text-white`} />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-sm font-bold text-white text-center transition-all duration-300 group-hover:scale-105">
                        {language === 'en' ? (page.name_en || page.name) : page.name}
                      </div>
                      <div className="h-0.5 w-0 mx-auto mt-2 bg-gradient-to-r from-transparent via-white to-transparent group-hover:w-full transition-all duration-500" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
