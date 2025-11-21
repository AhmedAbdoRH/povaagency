import { motion } from 'framer-motion';
import { Globe2, Radar, SlidersHorizontal, BarChart4, MessagesSquare } from 'lucide-react';

const benefits = [
  {
    title: 'اتساع دائرة وصولك للعملاء',
    description: 'نوصلك إلى أسواق جديدة حول العالم ونكسر الحواجز الجغرافية بحملات مدروسة.',
    icon: Globe2,
  },
  {
    title: 'استهداف أدق للعملاء',
    description: 'نخصص رسائلك لتصل إلى العميل الصحيح في اللحظة الأنسب باستخدام بيانات فورية.',
    icon: Radar,
  },
  {
    title: 'ترشيد التكلفة',
    description: 'نضبط الميزانيات ونحوّل الإنفاق إلى قنوات تحقق أعلى مردود ممكن دون هدر.',
    icon: SlidersHorizontal,
  },
  {
    title: 'نتائج يمكن قياسها',
    description: 'نوفر تقارير شفافة تعرض نسب النجاح والأرقام الدقيقة لكل حملة رقمية.',
    icon: BarChart4,
  },
  {
    title: 'تواصل مباشر مع العملاء',
    description: 'نستمع إلى جمهورك ونتفاعل معهم لحظياً لنبني علاقة ثقة طويلة الأمد.',
    icon: MessagesSquare,
  },
];

export default function DigitalMarketingBenefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0c1224] to-[#05070f] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-accent font-semibold mb-3">التسويق الرقمي</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ما الاستفادة التي ستحصل عليها شركتك من التسويق الإلكتروني؟</h2>
          <p className="text-white/70 text-lg">
            نربطك بالعملاء المناسبين ونقدم لك أدوات دقيقة لقياس النجاح وتحسين الأداء باستمرار.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-white/30 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center mb-5">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-white/80 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
