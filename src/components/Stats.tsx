import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
    });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        const unsub = springValue.on('change', (latest) => {
            if (ref.current) {
                const locale = document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US';
                ref.current.textContent = Intl.NumberFormat(locale).format(Math.round(latest)) + suffix;
            }
        });
        return () => unsub();
    }, [springValue, suffix]);

    return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

export default function Stats() {
    const { t } = useLanguage();

    const stats = [
        { value: parseInt(t('stats.items.0.value') || '0', 10), suffix: t('stats.items.0.suffix'), label: t('stats.items.0.label') },
        { value: parseInt(t('stats.items.1.value') || '0', 10), suffix: t('stats.items.1.suffix'), label: t('stats.items.1.label') },
        { value: parseInt(t('stats.items.2.value') || '0', 10), suffix: t('stats.items.2.suffix'), label: t('stats.items.2.label') },
        { value: parseInt(t('stats.items.3.value') || '0', 10), suffix: t('stats.items.3.suffix'), label: t('stats.items.3.label') },
    ];

    return (
        <section className="relative overflow-hidden bg-black py-32">
            {/* Ambient Lighting Background */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full opacity-30 blur-[150px] pointer-events-none bg-gradient-to-r from-accent via-orange-600 to-purple-600 rounded-[100%]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-20 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.7, delay: index * 0.1, type: 'spring' }}
                            className="relative group"
                        >
                            {/* Giant Stroke Text Background */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-[9rem] font-black opacity-10 select-none pointer-events-none z-0 transition-opacity duration-500 group-hover:opacity-20"
                                style={{ WebkitTextStroke: '2px white', color: 'transparent' }}
                            >
                                {stat.value}
                            </div>
                            
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <h3 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix || ''} />
                                </h3>
                                <p className="text-xl md:text-2xl font-bold text-accent px-4 py-2 bg-accent/10 border border-accent/20 rounded-full backdrop-blur-sm">
                                    {stat.label}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
