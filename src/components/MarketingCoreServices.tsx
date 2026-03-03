import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Target, Sparkles, Video, Film, Palette, Globe, Megaphone, Image, Camera } from 'lucide-react';

const coreServices = [
  {
    title: 'استراتيجية التسويق',
    description: 'صياغة استراتيجيات شاملة لتوجيه نمو علامتك التجارية واختراق السوق.',
    icon: Target,
    bgGradient: 'from-blue-500/20 to-transparent',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  {
    title: 'صناعة المحتوى',
    description: 'تطوير محتوى جذاب ومناسب بأشكال مختلفة لجذب جمهورك والاحتفاظ به.',
    icon: Sparkles,
    bgGradient: 'from-purple-500/20 to-transparent',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/30'
  },
  {
    title: 'تصوير الفيديو',
    description: 'إنتاج فيديو احترافي للإعلانات التجارية والمحتوى الترويجي ومقاطع فيديو الشركات.',
    icon: Video,
    bgGradient: 'from-orange-500/20 to-transparent',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/30'
  },
  {
    title: 'الإنتاج الإعلامي',
    description: 'خدمات شاملة تشمل تطوير المفهوم، التصوير، وما بعد الإنتاج لمختلف المنصات.',
    icon: Film,
    bgGradient: 'from-indigo-500/20 to-transparent',
    iconColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30'
  },
  {
    title: 'بناء الهوية التجارية',
    description: 'تطوير هويات فريدة للعلامة التجارية يتردد صداها مع جمهورك وتبرز في السوق.',
    icon: Palette,
    bgGradient: 'from-emerald-500/20 to-transparent',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30'
  },
  {
    title: 'تصميم المواقع',
    description: 'تصميم وتطوير مواقع إلكترونية حديثة، متجاوبة، وسهلة الاستخدام تحقق النتائج.',
    icon: Globe,
    bgGradient: 'from-sky-500/20 to-transparent',
    iconColor: 'text-sky-400',
    borderColor: 'border-sky-500/30'
  },
  {
    title: 'حملات السوشيال ميديا',
    description: 'إدارة وتحسين تواجدك على وسائل التواصل الاجتماعي للتفاعل مع جمهورك وبناء مجتمعك.',
    icon: Megaphone,
    bgGradient: 'from-rose-500/20 to-transparent',
    iconColor: 'text-rose-400',
    borderColor: 'border-rose-500/30'
  },
  {
    title: 'تصميم المنشورات',
    description: 'إنشاء تصميمات جرافيك جذابة وفعالة لمنشورات وسائل التواصل الاجتماعي.',
    icon: Image,
    bgGradient: 'from-fuchsia-500/20 to-transparent',
    iconColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/30'
  },
  {
    title: 'التصوير الفوتوغرافي',
    description: 'خدمات تصوير احترافية عالية الجودة للمنتجات، الأحداث، وملفات تعريف الشركات.',
    icon: Camera,
    bgGradient: 'from-amber-500/20 to-transparent',
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30'
  },
];

export default function MarketingCoreServices() {
  const [pageLinks, setPageLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data, error } = await supabase.from('pages').select('id, name');
        if (!error && data) {
          const links: Record<string, string> = {};
          data.forEach(page => {
            links[page.name] = page.id;
          });
          setPageLinks(links);
        }
      } catch (err) {
        console.error("Error fetching pages for core services:", err);
      }
    };
    fetchPages();
  }, []);

  return (
    <section className="py-16 pt-20 bg-[#050505] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12 pb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md shadow-2xl"
          >
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-gray-200">خدماتنا الأساسية</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.5] text-white"
            style={{ textShadow: '0 0 30px rgba(238,82,57,0.3)' }}
          >
            حلول متكاملة لنجاحك الرقمي
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl leading-relaxed"
          >
            نقدم مجموعة متكاملة من الخدمات الرقمية المصممة لتعزيز حضورك وتحقيق أهدافك التجارية بأعلى معايير الجودة والإبداع.
          </motion.p>
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service, index) => {
            const pageId = pageLinks[service.title];
            // Create fallback route based on service title
            const fallbackRoute = `/service/${service.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '')}`;
            const targetRoute = pageId ? `/page/${pageId}` : fallbackRoute;
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -12, scale: 1.05, transition: { duration: 0.3 } }}
                className={`group relative bg-[#0d0d0d] border ${service.borderColor} rounded-3xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:bg-[#151515] cursor-pointer`}
              >
                {/* Link Overlay */}
                <Link 
                  to={targetRoute} 
                  className="absolute inset-0 z-20"
                  aria-label={`Go to ${service.title}`}
                />

                {/* Background Gradient - Now ALWAYS visible */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 flex flex-col h-full pointer-events-none"> {/* Added pointer-events-none to prevent interfering with Link */}
                  <div className="flex justify-between items-start mb-6">
                    {/* Icon - Always scaled up slightly and glowing */}
                    <div className={`w-16 h-16 rounded-2xl bg-black/60 flex items-center justify-center shadow-2xl border border-white/10 ${service.iconColor} scale-110 group-hover:scale-125 transition-transform duration-500 ease-out backdrop-blur-lg`}>
                      <service.icon className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={1.5} />
                    </div>
                    {/* Arrow - Always visible */}
                    <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center opacity-100 group-hover:bg-white group-hover:border-white transition-all duration-300 bg-white/5">
                      <svg className={`w-4 h-4 ${service.iconColor} group-hover:text-black rotate-180 transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Title - Always Gradient */}
                  <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all duration-300 !leading-[1.4] text-wrap-balance">
                    {service.title}
                  </h3>

                  {/* Description - Always slightly brighter */}
                  <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 flex-grow">
                    {service.description}
                  </p>
                </div>

                {/* Decorative Background Icon - Always visible at low opacity */}
                <service.icon className={`absolute -bottom-8 -left-8 w-44 h-44 opacity-10 transform rotate-12 group-hover:rotate-45 group-hover:scale-125 transition-all duration-1000 ease-in-out pointer-events-none ${service.iconColor}`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
