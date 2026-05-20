import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

export default function AnimatedMarketingHero() {
  const { language } = useLanguage();
  const [textIndex, setTextIndex] = useState(0);

  const textAr = 'لماذا يعتبر التسويق عبر منصات التواصل ضرورة حتمية؟';
  const textEn = 'Why is marketing through social media platforms an absolute necessity?';

  const text = language === 'ar' ? textAr : textEn;
  const displayText = text.substring(0, textIndex);

  // Auto-scroll text animation
  useEffect(() => {
    if (textIndex < text.length) {
      const timer = setTimeout(() => setTextIndex(textIndex + 1), 60);
      return () => clearTimeout(timer);
    }
  }, [textIndex, text.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: language === 'ar' ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Floating animation
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Side sliding animation
  const slideVariants = {
    animate: {
      x: language === 'ar' ? [0, -30, 0] : [0, 30, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Pulsing animation
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden relative py-20 px-4 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          {/* Animated badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-indigo-200 bg-white/80 backdrop-blur-md px-6 py-3 shadow-lg"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            />
            <span className="text-sm font-semibold text-gray-700">مهم • Important</span>
          </motion.div>

          {/* Main animated text with side sliding effect */}
          <motion.div
            variants={slideVariants}
            animate="animate"
            className="mb-12"
          >
            <motion.h1
              variants={pulseVariants}
              animate="animate"
              className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight"
              style={{
                minHeight: '1.2em',
              }}
            >
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className="text-indigo-600"
              >
                |
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Floating action elements */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-semibold shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            >
              ابدأ الآن • Start Now
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold backdrop-blur-sm cursor-pointer hover:bg-indigo-50 transition-colors"
            >
              تعلم المزيد • Learn More
            </motion.div>
          </motion.div>

          {/* Animated statistics */}
          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { number: '87%', label: 'زيادة المبيعات • Sales Increase' },
              { number: '3.5x', label: 'عائد الاستثمار • ROI' },
              { number: '95%', label: 'رضا العملاء • Client Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                animate={slideVariants.animate}
                transition={{
                  ...slideVariants.animate.transition,
                  delay: index * 0.2,
                }}
                className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
