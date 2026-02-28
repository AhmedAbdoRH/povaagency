import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, Zap, BarChart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen"></div>

        {/* abstract glowing orb in the center behind the text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", type: 'spring' }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-gray-300 text-sm font-bold tracking-wide shadow-2xl">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              شريكك الاستراتيجي للنمو الرقمي
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.2] mb-8 max-w-5xl tracking-tight"
          >
            نحول أفكارك إلى <br />
            <span className="relative inline-block mt-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-accent bg-300% animate-gradient">
                علامة تجارية استثنائية
              </span>
              <div className="absolute -inset-2 bg-accent/20 blur-2xl rounded-full -z-10 animate-pulse"></div>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed font-medium"
          >
            في <span className="text-white font-bold">POVA</span>، ندمج الإبداع الفني مع التحليل الدقيق للبيانات لنقدم لك حلولاً تسويقية متكاملة تضمن لك التميز في السوق وتحقيق نتائج ملموسة.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="flex flex-wrap justify-center gap-6 w-full"
          >
            <button
              onClick={() => {
                const productsSection = document.getElementById('products-section');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative px-8 py-4 bg-accent text-white font-bold rounded-2xl overflow-hidden shadow-2xl shadow-accent/40 hover:shadow-accent/60 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-3 text-lg">
                استكشف خدماتنا
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>

            <Link
              to="/design-request"
              className="group px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 flex items-center gap-3 shadow-xl transform hover:-translate-y-1 text-lg"
            >
              <BarChart className="w-5 h-5 text-gray-400 group-hover:text-accent group-hover:scale-110 transition-all" />
              اطلب استشارة مجانية
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 text-white/40"
      >
        <span className="text-xs font-bold tracking-[0.2em] uppercase">اكتشف المزيد</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1"
        >
          <motion.div className="w-1.5 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}