import { Sparkle, Mountain } from 'lucide-react';

const cards = [
  {
    title: 'رؤيتنا',
    icon: Sparkle,
    content: [
      'ادخل إلى العالم الرقمي مع بوفا، حيث تتجاوز العلامات التجارية المألوف وتعيش المستقبل بقصص نابضة بالحياة وغامرة، تترك أثراً لا يُمحى في القلوب.',
      'نصنع عالماً تكون فيه كل علامة تجارية تحفة فنية؛ مزيجاً فريداً من الإبداع يدفعها نحو آفاق غير محدودة.'
    ],
  },
  {
    title: 'مهمتنا',
    icon: Mountain,
    content: [
      'نطلق العنان لإمكانات علامتك عبر روايات تجارية تبهر وتُلهم، مزودة بالطاقة والابتكار في كل تفصيلة.',
      'نكون شريكك الدائم، نرسم خريطة دقيقة لرحلة علامتك منذ الانطلاقة وحتى الاحتفاء بالنتائج المذهلة.'
    ],
  },
];

export default function VisionMission() {
  return (
    <section className="py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-accent font-semibold mb-3">من نحن</p>
          <h2 className="text-3xl md:text-4xl font-bold">رؤية واضحة ورسالة ملهمة</h2>
          <p className="text-gray-600 mt-4 text-lg">
            نؤمن أن كل علامة تجارية تملك قصة تستحق أن تُروى، ونرسم لها مشهداً مميزاً يجمع بين الخيال والنتائج الملموسة.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative rounded-3xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${card.title === 'مهمتنا'
                ? 'bg-gray-100 border border-gray-200'
                : 'bg-white border border-gray-100'}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold">{card.title}</h3>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                {card.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
