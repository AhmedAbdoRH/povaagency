import { motion } from 'framer-motion';
import { Target, Sparkles, Video, Film, Palette, Globe, Megaphone, Image, Camera } from 'lucide-react';

const coreServices = [
  {
    title: 'استراتيجية التسويق',
    description: 'صياغة استراتيجيات شاملة لتوجيه نمو علامتك التجارية واختراق السوق.',
    icon: Target,
    bgGradient: 'from-blue-500/10 to-transparent',
    iconColor: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/50'
  },
  {
    title: 'صناعة المحتوى',
    description: 'تطوير محتوى جذاب ومناسب بأشكال مختلفة لجذب جمهورك والاحتفاظ به.',
    icon: Sparkles,
    bgGradient: 'from-purple-500/10 to-transparent',
    iconColor: 'text-purple-400',
    hoverBorder: 'hover:border-purple-500/50'
  },
  {
    title: 'تصوير الفيديو',
    description: 'إنتاج فيديو احترافي للإعلانات التجارية والمحتوى الترويجي ومقاطع فيديو الشركات.',
    icon: Video,
    bgGradient: 'from-orange-500/10 to-transparent',
    iconColor: 'text-orange-400',
    hoverBorder: 'hover:border-orange-500/50'
  },
  {
    title: 'الإنتاج الإعلامي',
    description: 'خدمات شاملة تشمل تطوير المفهوم، التصوير، وما بعد الإنتاج لمختلف المنصات.',
    icon: Film,
    bgGradient: 'from-indigo-500/10 to-transparent',
    iconColor: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/50'
  },
  {
    title: 'بناء الهوية التجارية',
    description: 'تطوير هويات فريدة للعلامة التجارية يتردد صداها مع جمهورك وتبرز في السوق.',
    icon: Palette,
    bgGradient: 'from-emerald-500/10 to-transparent',
    iconColor: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/50'
  },
  {
    title: 'تصميم المواقع',
    description: 'تصميم وتطوير مواقع إلكترونية حديثة، متجاوبة، وسهلة الاستخدام تحقق النتائج.',
    icon: Globe,
    bgGradient: 'from-sky-500/10 to-transparent',
    iconColor: 'text-sky-400',
    hoverBorder: 'hover:border-sky-500/50'
  },
  {
    title: 'حملات السوشيال ميديا',
    description: 'إدارة وتحسين تواجدك على وسائل التواصل الاجتماعي للتفاعل مع جمهورك وبناء مجتمعك.',
    icon: Megaphone,
    bgGradient: 'from-rose-500/10 to-transparent',
    iconColor: 'text-rose-400',
    hoverBorder: 'hover:border-rose-500/50'
  },
  {
    title: 'تصميم المنشورات',
    description: 'إنشاء تصميمات جرافيك جذابة وفعالة لمنشورات وسائل التواصل الاجتماعي.',
    icon: Image,
    bgGradient: 'from-fuchsia-500/10 to-transparent',
    iconColor: 'text-fuchsia-400',
    hoverBorder: 'hover:border-fuchsia-500/50'
  },
  {
    title: 'التصوير الفوتوغرافي',
    description: 'خدمات تصوير احترافية عالية الجودة للمنتجات، الأحداث، وملفات تعريف الشركات.',
    icon: Camera,
    bgGradient: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-400',
    hoverBorder: 'hover:border-amber-500/50'
  },
];

export default function MarketingCoreServices() {
  return (
    <section className="py-24 bg-[#050505] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
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
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500"
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
            نقدم لك مجموعة شاملة من الخدمات المصممة خصيصاً للارتقاء بعلامتك التجارية وتحقيق أهدافك في العالم الرقمي.
          </motion.p>
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {coreServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative bg-[#111] border border-white/5 rounded-3xl p-8 backdrop-blur-md overflow-hidden transition-all duration-500 shadow-xl hover:shadow-2xl ${service.hoverBorder}`}
            >
              {/* Card Hover Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center shadow-inner border border-white/5 ${service.iconColor} group-hover:scale-110 transition-transform duration-500 ease-out backdrop-blur-lg`}>
                    <service.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 delay-100 bg-white/5">
                    <svg className={`w-4 h-4 ${service.iconColor} rotate-180`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                  {service.title}
                </h3>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300 flex-grow">
                  {service.description}
                </p>

              </div>

              {/* Decorative Background Icon */}
              <service.icon className={`absolute -bottom-8 -left-8 w-40 h-40 opacity-0 group-hover:opacity-5 transform group-hover:rotate-12 transition-all duration-700 ease-in-out pointer-events-none ${service.iconColor}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
