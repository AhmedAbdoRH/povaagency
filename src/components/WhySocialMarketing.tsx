import { motion } from 'framer-motion';
import { Eye, Handshake, Target, DollarSign, BarChart3 } from 'lucide-react';

const highlights = [
  {
    title: 'زيادة رؤية علامتك التجارية',
    description: 'نصنع حضوراً رقمياً يضمن تواجدك في أذهان جمهورك المستهدف بشكل مستمر.',
    icon: Eye,
  },
  {
    title: 'تعزيز تواصلك مع عملائك المستهدفين',
    description: 'نصمم محتوى تفاعلياً يبني جسراً دائماً مع مجتمعك ويحول المتابعين إلى عملاء.',
    icon: Handshake,
  },
  {
    title: 'إعلانات موجهة',
    description: 'نستهدف الفئات الأدق بالرسائل المناسبة ونقيس الأداء لحظة بلحظة.',
    icon: Target,
  },
  {
    title: 'ضمان الفعالية مقابل التكلفة',
    description: 'نستثمر الميزانيات بحكمة عبر قنوات تحقق أعلى عائد استثماري.',
    icon: DollarSign,
  },
  {
    title: 'نتائج تفصيلية',
    description: 'نوفر لوحات قياس دقيقة توضح أثر كل حملة وتساعدك في اتخاذ قرارات أسرع.',
    icon: BarChart3,
  },
];

export default function WhySocialMarketing() {
  return (
    <section className="py-20 bg-accent text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.4),transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-3">التسويق عبر المنصات الاجتماعية</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
            ما الذي يجعل التسويق عبر منصات التواصل الاجتماعي ضرورياً لعلامتك التجارية؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-lg hover:-translate-y-1 hover:border-white/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/80 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
