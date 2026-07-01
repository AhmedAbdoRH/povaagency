import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Zap } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function AboutUs() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-primary pt-20 pb-20">
      <Helmet>
        <title>{t('about.title')} - POVA Agency</title>
        <meta name="description" content={t('about.subtitle')} />
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
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            {t('about.description')}
          </motion.p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-2xl border-2 border-accent/20 relative overflow-hidden group hover:shadow-accent/20 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
                <Target className="w-9 h-9 text-accent" />
              </div>
              <h2 className="text-4xl font-bold text-[#162341] mb-5">رسالتنا</h2>
              <p className="text-[#162341] leading-relaxed text-lg font-medium">
                تمكين الشركات والعلامات التجارية من الوصول إلى كامل إمكاناتها من خلال استراتيجيات تسويقية مبتكرة ومحتوى إبداعي يلامس قلوب وعقول الجمهور المستهدف.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-gray-50 p-10 rounded-3xl shadow-2xl border-2 border-accent/20 relative overflow-hidden group hover:shadow-accent/20 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
                <Eye className="w-9 h-9 text-accent" />
              </div>
              <h2 className="text-4xl font-bold text-[#162341] mb-5">رؤيتنا</h2>
              <p className="text-[#162341] leading-relaxed text-lg font-medium">
                أن نكون الوكالة الرائدة في الشرق الأوسط التي تعيد تعريف مفهوم التسويق الرقمي، من خلال دمج التكنولوجيا المتقدمة مع اللمسة الإنسانية المبدعة.
              </p>
            </div>
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
                <p className="text-gray-700">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative rounded-3xl p-12 text-center overflow-hidden shadow-2xl">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#162341] via-[#203158] to-[#162341] bg-[length:200%_200%] animate-gradient"></div>
          
          {/* Overlay Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(236, 83, 58, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 83, 58, 0.2) 0%, transparent 50%)',
            }}></div>
          </div>
          
          {/* Accent Border Glow */}
          <div className="absolute inset-0 rounded-3xl border-2 border-accent shadow-[0_0_30px_rgba(236,83,58,0.3)]"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              جاهز لبدء رحلة النجاح؟
            </h2>
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              دعنا نساعدك في بناء استراتيجية تسويقية تضعك في المقدمة. تواصل معنا اليوم للحصول على استشارة مجانية.
            </p>
            <a
              href="/contact"
              className="inline-block px-10 py-5 bg-accent text-white font-bold text-lg rounded-xl hover:bg-white hover:text-accent transition-all duration-300 shadow-[0_10px_40px_rgba(236,83,58,0.4)] hover:shadow-[0_15px_50px_rgba(236,83,58,0.6)] transform hover:-translate-y-1 hover:scale-105"
            >
              تواصل معنا الآن
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


