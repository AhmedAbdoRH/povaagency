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

          {/* Animated statistics with 3D effect */}
          <motion.div
            variants={itemVariants}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000"
          >
            {[
              { number: '87%', label: 'زيادة المبيعات • Sales Increase', icon: '📈', color: 'from-blue-500 to-cyan-500' },
              { number: '3.5x', label: 'عائد الاستثمار • ROI', icon: '💰', color: 'from-indigo-500 to-purple-500' },
              { number: '95%', label: 'رضا العملاء • Client Satisfaction', icon: '⭐', color: 'from-purple-500 to-pink-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  rotateY: [0, 5, 0, -5, 0],
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: 5,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.2 },
                  y: { duration: 0.5, delay: index * 0.2 },
                  rotateY: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.5,
                  }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  transformPerspective: 1000,
                }}
                className="relative p-8 bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl overflow-hidden cursor-pointer group"
              >
                {/* 3D Shadow layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-2xl transform translate-z-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Gradient overlay on hover */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />

                {/* Animated corner accent */}
                <motion.div
                  className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} w-20 h-20 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl rounded-full`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.4,
                  }}
                />

                {/* Icon with floating animation */}
                <motion.div
                  className="text-5xl mb-4 filter drop-shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(30px)',
                  }}
                >
                  {stat.icon}
                </motion.div>

                {/* Number with 3D text effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.4,
                  }}
                  className="text-5xl md:text-6xl font-black mb-3 relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'translateZ(20px)',
                  }}
                >
                  <span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent drop-shadow-2xl relative z-10`}>
                    {stat.number}
                  </span>
                  {/* 3D text shadow layers */}
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent blur-sm opacity-30 transform translate-x-1 translate-y-1" aria-hidden="true">
                    {stat.number}
                  </span>
                </motion.div>

                {/* Label */}
                <p className="text-gray-700 font-semibold text-sm md:text-base leading-relaxed relative z-10" style={{ transform: 'translateZ(10px)' }}>
                  {stat.label}
                </p>

                {/* Bottom shine effect */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-60"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
