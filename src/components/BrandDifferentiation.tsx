import { motion } from 'framer-motion';
import { BarChart4, PieChart, Sparkles, LifeBuoy } from 'lucide-react';

const differentiators = [
  {
    title: 'تحليل دقيق لمكانتك في السوق',
    description: 'نوفر تحليلاً متعمقاً لموقع علامتك التجارية بين منافسيك ونرسم فرص النمو.',
    icon: BarChart4,
  },
  {
    title: 'تخطيط استراتيجي',
    description: 'نضع استراتيجيات مصممة خصيصاً لتحقيق أهدافك التجارية بثقة ووضوح.',
    icon: PieChart,
  },
  {
    title: 'حلول تسويقية مميزة',
    description: 'نقدم باقة خدمات متكاملة تنسجم لتلائم طبيعة مشروعك وتدعم نموه.',
    icon: Sparkles,
  },
  {
    title: 'تقديم دعم مستمر',
    description: 'مرافقة واستشارات دائمة لضمان استمرار نجاحك وتميزك في السوق.',
    icon: LifeBuoy,
  },
];

export default function BrandDifferentiation() {
  return (
    <section className="py-20 bg-gradient-to-b from-accent to-[#f25b3d] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-white/80 mb-2">أربعة خدمات رئيسية توفرها بوفا خصيصاً لشركتك</p>
          <h2 className="text-3xl md:text-4xl font-bold">كيف يمكن لـ بوفا تميز علامتك التجارية؟</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="rounded-3xl bg-white/10 border border-white/20 p-6 backdrop-blur-md h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/85 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
