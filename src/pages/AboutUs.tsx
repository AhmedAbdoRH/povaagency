import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Zap } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-primary pt-20 pb-20">
      <Helmet>
        <title>من نحن - POVA Agency</title>
        <meta name="description" content="POVA هي وكالة تسويق رقمي متكاملة تهدف إلى تحويل الأفكار إلى واقع ملموس وعلامات تجارية ناجحة." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-secondary mb-6"
          >
            نحن نصنع <span className="text-accent">المستقبل الرقمي</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            POVA ليست مجرد وكالة تسويق، بل هي شريكك الاستراتيجي في رحلة النمو. نجمع بين الإبداع الفني والتحليل الدقيق للبيانات لنقدم لك حلولاً تضمن تفوقك في السوق.
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <Target className="w-12 h-12 text-accent mb-6" />
            <h2 className="text-3xl font-bold text-secondary mb-4">رسالتنا</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              تمكين الشركات والعلامات التجارية من الوصول إلى كامل إمكاناتها من خلال استراتيجيات تسويقية مبتكرة ومحتوى إبداعي يلامس قلوب وعقول الجمهور المستهدف.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary p-10 rounded-3xl shadow-lg border border-gray-800 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
            <Eye className="w-12 h-12 text-white mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">رؤيتنا</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              أن نكون الوكالة الرائدة في الشرق الأوسط التي تعيد تعريف مفهوم التسويق الرقمي، من خلال دمج التكنولوجيا المتقدمة مع اللمسة الإنسانية المبدعة.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">قيمنا الجوهرية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Award, title: "التميز", desc: "لا نرضى بأقل من الإبهار في كل عمل نقدمه." },
              { icon: Users, title: "الشفافية", desc: "نبني علاقاتنا على الصدق والوضوح التام مع عملائنا." },
              { icon: Zap, title: "الابتكار", desc: "نبحث دائماً عن أفكار جديدة وحلول غير تقليدية." }
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <val.icon className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-secondary mb-2">{val.title}</h3>
                <p className="text-gray-600">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-header rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">جاهز لبدء رحلة النجاح؟</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              دعنا نساعدك في بناء استراتيجية تسويقية تضعك في المقدمة. تواصل معنا اليوم للحصول على استشارة مجانية.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-white hover:text-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              تواصل معنا الآن
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


