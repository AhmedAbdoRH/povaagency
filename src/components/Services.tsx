import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { resolveCoreServicesWithPages } from '../data/coreServices';

export default function Services() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPages = async () => {
      try {
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
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
        <div className="animate-pulse">جارٍ التحميل...</div>
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
            استكشف خدماتنا
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-gray-400"
          >
            تصفح الخدمات الرئيسية المرتبطة مباشرة بالأقسام والأعمال داخل كل مجال.
          </motion.p>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 py-10 text-center text-gray-500">
            لا توجد صفحات مضافة حاليًا.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                className="cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-secondary/20 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                onClick={() => navigate(routeByPageId.get(page.id) || `/page/${page.id}`)}
              >
                <div className="relative aspect-square">
                  {page.image_url ? (
                    <img src={page.image_url} alt={page.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
                      <Layers className="h-16 w-16 text-accent" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 hover:bg-black/20" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
