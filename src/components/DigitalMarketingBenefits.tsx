import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Globe2, Radar, SlidersHorizontal, BarChart4, MessagesSquare, Lightbulb } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

function TiltCard({ benefit, index }: { benefit: any, index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-full w-full rounded-3xl cursor-pointer"
    >
        <div 
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 hover:opacity-50 -z-10 ${benefit.gradient}`}
        />

        <div
            style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}
            className="h-full bg-white/50 border border-gray-200 rounded-3xl p-8 backdrop-blur-xl shadow-lg relative overflow-hidden group"
        >
            <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${benefit.gradient} rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-50`} />

            <div 
                style={{ transform: "translateZ(40px)" }}
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 shadow-lg`}
            >
                <benefit.icon className="w-7 h-7 text-white" />
            </div>
            
            <h3 
                style={{ transform: "translateZ(30px)" }}
                className="text-2xl font-bold mb-4 text-gray-900 drop-shadow-sm"
            >
                {benefit.title}
            </h3>
            
            <p 
                style={{ transform: "translateZ(20px)" }}
                className="text-gray-600 leading-relaxed font-medium"
            >
                {benefit.description}
            </p>
        </div>
    </motion.div>
  );
}

export default function DigitalMarketingBenefits() {
  const { t } = useLanguage();

  const benefitIcons = [Globe2, Radar, SlidersHorizontal, BarChart4, MessagesSquare];
  const gradients = ['from-blue-500 to-cyan-500', 'from-purple-500 to-fuchsia-500', 'from-emerald-500 to-teal-500', 'from-orange-500 to-red-500', 'from-pink-500 to-rose-500'];

  const benefits = Array.from({ length: 5 }, (_, index) => ({
    title: t(`digitalMarketingBenefits.benefits.${index}.title`),
    description: t(`digitalMarketingBenefits.benefits.${index}.description`),
    icon: benefitIcons[index],
    gradient: gradients[index]
  }));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-32 perspective-1000">
        {/* Animated Background Blob */}
        <motion.div 
            animate={{ 
                rotate: [0, 360], 
                scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-accent/20 to-purple-600/20 blur-[150px] opacity-50 mix-blend-screen pointer-events-none" 
        />
        <motion.div 
            animate={{ 
                rotate: [360, 0], 
                scale: [1, 1.5, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-blue-600/20 to-teal-500/20 blur-[150px] opacity-50 mix-blend-screen pointer-events-none" 
        />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 text-sm font-medium text-gray-600 backdrop-blur-sm shadow-sm"
            >
                <Lightbulb className="h-4 w-4 text-accent" />
                <span>{t('digitalMarketingBenefits.statusBadge')}</span>
            </motion.div>
            
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.6] text-gray-900"
          >
            {t('digitalMarketingBenefits.heading')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            {t('digitalMarketingBenefits.description')}
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto perspective-1000">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} style={{ perspective: 1000 }}>
                <TiltCard benefit={benefit} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
