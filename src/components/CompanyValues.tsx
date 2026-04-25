import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Palette, Landmark, Brain, Users, TrendingUp, ShieldCheck, RefreshCcw, SunMedium, Sparkles } from 'lucide-react';

const values = [
  {
    title: 'الروح الإبداعية',
    description: 'نستمتع بصناعة أفكار تلهم جمهورك وتحرك مشاعرهم، لتبقى علامتك نابضة بالحياة.',
    icon: Palette,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    title: 'الواقعية',
    description: 'نحكي قصصاً حقيقية تتواصل مع العميل بصدق وتترجم رؤيتك إلى سرد مؤثر.',
    icon: Landmark,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'الإبداع الذكي والمدروس',
    description: 'نجمع بين الذوق الرفيع والذكاء بالبيانات لنقدم حلولاً تعكس شخصية علامتك.',
    icon: Brain,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'معاً ننتصر',
    description: 'نؤمن بالشراكة الحقيقية، نعمل كتفاً بكتف لتحويل التحديات إلى إنجازات.',
    icon: Users,
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    title: 'النمو',
    description: 'نلتزم بخطط مستمرة تعزز أداءك وتحافظ على تصاعد النتائج خطوة بخطوة.',
    icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'المصداقية',
    description: 'الشفافية أساسنا، نقدم بيانات واضحة، وتوصيات مبنية على أرقام دقيقة.',
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    title: 'المرونة والازدهار',
    description: 'نتأقلم سريعاً مع تحولات السوق لنحافظ على ريادتك في عالم متغير.',
    icon: RefreshCcw,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'صناع التأثير الإيجابي',
    description: 'نسعى لترك بصمة متوازنة تخدم علامتك والمجتمع عبر مشاريع إنسانية وملهمة.',
    icon: SunMedium,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
];

export default function CompanyValues() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map scroll progress (0 to 1) to horizontal translation (0 to -100%)
  // Since Arabic is RTL, we translate towards positive X to scroll right-to-left 
  // Wait, in RTL `x` positive moves element right, but we want the list to move right so we see items on the left.
  // Actually, standard horizontal scroll in RTL: we map to `x: "50%"` etc.
  // Let's use a simpler mapping.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "85%"]);

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
                    <span>قيمنا الأساسية</span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-[1.6]">
                    القيم التي تشكل <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">هوية بوفا</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                    ثقافتنا تبنى على مبادئ واضحة تدفعنا للإبداع، وتمنح عملاءنا الثقة بأننا الشريك الأكثر التزاماً وابتكاراً.
                </p>
            </div>

            {/* Horizontal Scroll Track */}
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
