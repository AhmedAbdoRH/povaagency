import { Palette, Landmark, Brain, Users, TrendingUp, ShieldCheck, RefreshCcw, SunMedium } from 'lucide-react';

const values = [
  {
    title: 'الروح الإبداعية',
    description: 'نستمتع بصناعة أفكار تلهم جمهورك وتحرك مشاعرهم، لتبقى علامتك نابضة بالحياة.',
    icon: Palette,
  },
  {
    title: 'الواقعية',
    description: 'نحكي قصصاً حقيقية تتواصل مع العميل بصدق وتترجم رؤيتك إلى سرد مؤثر.',
    icon: Landmark,
  },
  {
    title: 'الإبداع الذكي والمدروس',
    description: 'نجمع بين الذوق الرفيع والذكاء بالبيانات لنقدم حلولاً تعكس شخصية علامتك.',
    icon: Brain,
  },
  {
    title: 'معاً ننتصر',
    description: 'نؤمن بالشراكة الحقيقية، نعمل كتفاً بكتف لتحويل التحديات إلى إنجازات.',
    icon: Users,
  },
  {
    title: 'النمو',
    description: 'نلتزم بخطط مستمرة تعزز أداءك وتحافظ على تصاعد النتائج خطوة بخطوة.',
    icon: TrendingUp,
  },
  {
    title: 'المصداقية',
    description: 'الشفافية أساسنا، نقدم بيانات واضحة، وتوصيات مبنية على أرقام دقيقة.',
    icon: ShieldCheck,
  },
  {
    title: 'المرونة والازدهار',
    description: 'نتأقلم سريعاً مع تحولات السوق لنحافظ على ريادتك في عالم متغير.',
    icon: RefreshCcw,
  },
  {
    title: 'صناع التأثير الإيجابي',
    description: 'نسعى لترك بصمة متوازنة تخدم علامتك والمجتمع عبر مشاريع إنسانية وملهمة.',
    icon: SunMedium,
  },
];

export default function CompanyValues() {
  return (
    <section className="py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold mb-3">قيمنا</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">القيم التي تشكل هوية بوفا</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            ثقافتنا تبنى على مبادئ واضحة تدفعنا للإبداع، وتمنح عملاءنا الثقة بأننا الشريك الأكثر التزاماً وابتكاراً.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="h-full bg-gray-50 border border-gray-100 rounded-3xl p-6 shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5">
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
