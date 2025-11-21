import { motion } from 'framer-motion';
import { Feather, Megaphone, UsersRound, Pen } from 'lucide-react';

const marketingServices = [
  {
    title: 'إدارة منصات التواصل الاجتماعي',
    description: 'نراقب صفحاتك لحظة بلحظة لضمان تحقيق الأهداف التسويقية ورفع التفاعل.',
    icon: UsersRound,
  },
  {
    title: 'إنشاء المحتوى التسويقي',
    description: 'نبتكر أشكالاً متعددة من المحتوى تدعم الوعي وتدفع الجمهور لاتخاذ القرار.',
    icon: Pen,
  },
  {
    title: 'كتابة المحتوى',
    description: 'نقدم نصوصاً تسويقية متقنة توصل رسائلك بوضوح لجمهورك المستهدف.',
    icon: Feather,
  },
  {
    title: 'حملات إعلانية',
    description: 'نضع خططاً استراتيجية للإعلانات عبر الإنترنت لزيادة العائد والانتشار.',
    icon: Megaphone,
  },
];

export default function MarketingCoreServices() {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-accent font-semibold mb-3">خدماتنا</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">حلول تسويق متكاملة تدعم نموك</h2>
          <p className="text-white/70 text-lg">نمزج الإبداع مع التحليل لنقدم خدمات متصلة تضع عملاءك في قلب التجربة.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {marketingServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-white flex-shrink-0">
                <service.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/80 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
