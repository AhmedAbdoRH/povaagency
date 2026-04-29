import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { Target, Users, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';

function BentoCard({ feature, index }: { feature: any; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const ref = useRef<HTMLDivElement>(null);

    function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative group overflow-hidden rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-xl p-8 ${feature.className}`}
            onMouseMove={handleMouseMove}
            ref={ref}
        >
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            200px circle at ${mouseX}px ${mouseY}px,
                            rgba(255, 255, 255, 0.1),
                            transparent
                        )
                    `
                }}
            />
            <div className="relative z-10">
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
            </div>
        </motion.div>
    );
}

export default function Features() {
    const { t } = useLanguage();

    const features = [
        {
            icon: Target,
            title: t('features.items.0.title'),
            description: t('features.items.0.description'),
            className: "md:col-span-2 md:row-span-1",
            color: "from-orange-500/20 to-transparent",
        },
        {
            icon: Lightbulb,
            title: t('features.items.1.title'),
            description: t('features.items.1.description'),
            className: "md:col-span-1 md:row-span-2",
            color: "from-blue-500/20 to-transparent",
        },
        {
            icon: TrendingUp,
            title: t('features.items.2.title'),
            description: t('features.items.2.description'),
            className: "md:col-span-1 md:row-span-1",
            color: "from-green-500/20 to-transparent",
        },
        {
            icon: Users,
            title: t('features.items.3.title'),
            description: t('features.items.3.description'),
            className: "md:col-span-1 md:row-span-1",
            color: "from-purple-500/20 to-transparent",
        }
    ];

    return (
        <section className="relative overflow-hidden bg-black py-32 selection:bg-accent/30">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="mb-20 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent backdrop-blur-sm"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>{t('features.statusBadge')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 text-5xl md:text-6xl font-black tracking-tight text-white lg:text-7xl leading-[1.6]"
                    >
                        {t('features.heading')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-gray-400 md:text-xl"
                    >
                        {t('features.description')}
                    </motion.p>
                </div>

                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
                        {features.map((feature, index) => (
                            <BentoCard key={index} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
