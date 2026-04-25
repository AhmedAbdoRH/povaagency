import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { useRef } from 'react';

const highlights = [
  {
    title: 'زيادة رؤية علامتك التجارية',
    description: 'نصنع حضوراً رقمياً يضمن تواجدك في أذهان جمهورك المستهدف بشكل مستمر. في عالم مزدحم، نجعلك الخيار الأول والأكثر تميزاً.',
    icon: Eye,
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'تواصل أعمق مع عملائك',
    description: 'نصمم محتوى تفاعلياً يبني جسراً دائماً مع مجتمعك ويحول المتابعين إلى عملاء أوفياء يثقون بعلامتك.',
    icon: Handshake,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'إعلانات موجهة بدقة',
    description: 'نستهدف الفئات الأدق بالرسائل المناسبة. لا نهدر ميزانيتك، بل نضع إعلانك أمام من يبحثون عنك تماماً.',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'أعلى عائد استثماري',
    description: 'نستثمر الميزانيات بحكمة عبر قنوات تحقق أعلى عائد استثماري، لنضمن أن كل دولار يعود بأرباح مضاعفة.',
    icon: DollarSign,
    color: 'from-purple-500 to-fuchsia-500',
  },
  {
    title: 'قرارات مبنية على البيانات',
    description: 'نوفر لوحات قياس دقيقة توضح أثر كل حملة وتساعدك في اتخاذ قرارات استراتيجية أسرع وأكثر ذكاءً.',
    icon: BarChart3,
    color: 'from-pink-500 to-rose-500',
  },
];

function Card({ item, index, progress, targetScale }: { item: any; index: number; progress: any; targetScale: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(progress, [index * 0.2, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <div ref={containerRef} className="sticky top-0 flex h-screen items-center justify-center pt-24 pb-12">
      <motion.div
        style={{ scale, opacity, y, top: `calc(5vh + ${index * 25}px)` }}
        className="relative flex w-full max-w-4xl flex-col items-center gap-8 rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl md:flex-row md:p-12"
      >
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-5 ${item.color}`} />
        <div className={`absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br blur-[80px] opacity-20 ${item.color}`} />

        <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br shadow-xl ${item.color}`}>
          <item.icon className="h-10 w-10 text-white" />
        </div>

        <div className="flex-1 text-center md:text-right z-10">
          <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">{item.title}</h3>
          <p className="text-lg leading-relaxed text-gray-400 md:text-xl">
            {item.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function WhySocialMarketing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className="relative bg-[#050505] pb-32">
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(238,82,57,0.05),transparent_60%)]" />
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <div className="container mx-auto px-4 py-32 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm"
            >
                <Sparkles className="h-4 w-4 text-accent" />
                <span>قوة التواصل المستمر</span>
            </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.6] max-w-4xl mx-auto"
          >
            لماذا يعتبر التسويق عبر منصات التواصل <span className="text-accent">ضرورة حتمية</span>؟
          </motion.h2>
        </div>

        <div className="container mx-auto px-4">
          {highlights.map((item, index) => {
            const targetScale = 1 - (highlights.length - index) * 0.05;
            return (
              <Card
                key={index}
                index={index}
                item={item}
                progress={scrollYProgress}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
