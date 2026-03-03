import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { motion } from 'framer-motion';
import { ArrowRight, Layout, Layers } from 'lucide-react';

export default function Services() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        if (isMounted && data) setPages(data);
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
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pages.map((page, index) => (
                  <motion.div 
                    key={page.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-accent/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors"></div>
                    
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-black/20">
                        <Layers className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors">{page.name}</h3>
                    <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed">{page.description || 'تصفح خدماتنا المتميزة في هذا القسم.'}</p>
                    
                    <Link 
                        to={`/page/${page.id}`} 
                        className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all border-b border-accent/0 hover:border-accent pb-0.5"
                    >
                        استعراض التخصصات <ArrowRight className="w-4 h-4 text-accent" />
                    </Link>
                  </motion.div>
              ))}
           </div>
        )}
      </div>
    </section>
  );
}
