import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

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
          .order('created_at', { ascending: true });

        if (pagesError) throw pagesError;

        if (isMounted && pagesData) {
          setPages(pagesData);
        }
      } catch (err) {
        console.error("Error fetching pages:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchPages();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) return <div className="py-20 text-center text-white bg-primary"><div className="animate-pulse">جاري التحميل...</div></div>;

  return (
    <section className="py-20 bg-primary" id="services-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            استكشف خدماتنا
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            نقدم حلولاً متكاملة تغطي كافة احتياجاتك الرقمية والإبداعية
          </motion.p>
        </div>
        
        {pages.length === 0 ? (
           <div className="text-center text-gray-500 py-10 border border-dashed border-gray-700 rounded-xl">
              لا توجد صفحات مضافة حالياً.
           </div>
        ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-secondary/20 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate(`/page/${page.id}`)}
                  >
                    <div className="aspect-square relative">
                      {page.image_url ? (
                        <img src={page.image_url} alt={page.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                          <Layers className="w-16 h-16 text-accent" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                    </div>
                  </motion.div>
              ))}
           </div>
        )}
      </div>
    </section>
  );
}
