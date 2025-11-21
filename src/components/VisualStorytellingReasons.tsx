import { motion } from 'framer-motion';
import { MessageSquareText, Sparkles, BadgeCheck, Camera, Heart, PlayCircle } from 'lucide-react';

const reasons = [
  {
    id: '01',
    title: 'التواصل المرئي',
    description: 'يمكنك من توصيل رسالة علامتك التجارية بشكل مشوق وواضح عبر قصص بصرية مؤثرة.',
    icon: MessageSquareText,
  },
  {
    id: '02',
    title: 'زيادة التفاعل',
    description: 'يجذب انتباه العميل للمحتوى المقدم ويحفزه على المشاركة والتفاعل مع علامتك.',
    icon: Sparkles,
  },
  {
    id: '03',
    title: 'تمايز علامتك التجارية',
    description: 'تتفوّق على المنافسين بتقديم محتوى غني يلامس احتياجات العميل ويبرز شخصيتك الخاصة.',
    icon: BadgeCheck,
  },
  {
    id: '04',
    title: 'عرض المنتج بصورة احترافية',
    description: 'نبرز مزايا منتجاتك وفوائدها بإخراج بصري حيوي يسلط الضوء على التفاصيل الإبداعية.',
    icon: Camera,
  },
  {
    id: '05',
    title: 'الاتصال العاطفي',
    description: 'نصنع رابطاً إنسانياً قوياً بين جمهورك والمنتج من خلال قصص ملهمة ومؤثرة.',
    icon: Heart,
  },
  {
    id: '06',
    title: 'دفع المشاهد للتفاعل',
    description: 'نصمم مشاهد ديناميكية تدعو لاتخاذ إجراء وتزيد فرص التحويل والمشاركة.',
    icon: PlayCircle,
  },
];

export default function VisualStorytellingReasons() {
  return (
    <section className="py-20 bg-secondary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_60%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-accent font-semibold mb-3">التصوير الفوتوغرافي | إنتاج الفيديو | الموشن جرافيك</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">6 أسباب تفسر لماذا يحتاج مشروعك للمحتوى الإبداعي</h2>
          <p className="text-white/70 text-lg">نحوّل أفكارك إلى تجارب مرئية تبني ثقة، وتخلق فرقاً حقيقياً في رحلة العميل.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute left-6 top-6 text-5xl font-black text-white/5">{reason.id}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-white">
                  <reason.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold">{reason.title}</h3>
              </div>
              <p className="text-white/80 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
