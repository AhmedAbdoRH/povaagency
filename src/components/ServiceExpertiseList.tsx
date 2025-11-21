import { motion } from 'framer-motion';
import { Camera, LineChart, PenSquare, PenTool, Presentation, CalendarDays, Film, Award } from 'lucide-react';

const services = [
  {
    title: 'تصوير فوتوغرافي وفيديو غرافي',
    description: 'نقدم تصويراً احترافياً يعكس جودة منتجك أو خدمتك ويضمن ظهورها بشكلٍ مميز.',
    icon: Camera,
  },
  {
    title: 'موشن جرافيك',
    description: 'ننتج فيديوهات موشن مبتكرة تروي قصتك وتزيد تفاعل جمهورك مع رسائلك.',
    icon: Film,
  },
  {
    title: 'عروض الافتتاح',
    description: 'نبتكر عروض إطلاق لافتة تساعدك في الترويج لمتجرك أو مشروعك بطريقة جذابة.',
    icon: Presentation,
  },
  {
    title: 'تحليل نتائج الإعلانات وتحسينها',
    description: 'نراقب الأداء لحظياً ونقدم توصيات دقيقة لتحسين العائد من كل حملة.',
    icon: LineChart,
  },
  {
    title: 'تصميم علامتك التجارية',
    description: 'نصمم هوية تعبر عن شركتك وتخلق انطباعاً احترافياً لدى عملائك.',
    icon: PenTool,
  },
  {
    title: 'الجرافيك ديزاين',
    description: 'نبتكر تصاميم تسويقية متسقة مع أهدافك وتجعل محتواك أكثر تأثيراً.',
    icon: Award,
  },
  {
    title: 'تنظيم إيفينتات',
    description: 'ندير فعالياتك وتجاربك الميدانية بأسلوب متكامل يعزز صورة العلامة.',
    icon: CalendarDays,
  },
  {
    title: 'كتابة المحتوى',
    description: 'نكتب محتوى تسويقياً موجهًا يضمن إيصال رسالتك بأسلوب جذاب وواضح.',
    icon: PenSquare,
  },
];

export default function ServiceExpertiseList() {
  return (
    <section className="py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-accent font-semibold mb-2">خدمات متخصصة</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">كل ما تحتاجه علامتك تحت سقف واحد</h2>
          <p className="text-gray-600 text-lg">فريق بوفا يجمع بين الخبرة الإبداعية والتحليلية لتغطية جميع جوانب التسويق.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex gap-4 bg-gray-50 border border-gray-100 rounded-3xl p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                <service.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
