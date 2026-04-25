import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Target, Users, Lightbulb, TrendingUp, Sparkles, Rocket } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "استراتيجيات دقيقة",
        description: "نحلل جمهورك المستهدف بدقة لنبني خططاً تسويقية تصل إليهم مباشرة وتحقق أهدافك بكفاءة عالية.",
        className: "md:col-span-2 md:row-span-1",
        color: "from-orange-500/20 to-transparent",
    },
    {
        icon: Lightbulb,
        title: "إبداع بلا حدود",
        description: "فريقنا يبتكر أفكاراً خارج الصندوق لتمييز علامتك التجارية وجعلها تتألق في سماء المنافسة.",
        className: "md:col-span-1 md:row-span-2",
        color: "from-blue-500/20 to-transparent",
    },
    {
        icon: TrendingUp,
        title: "نتائج ملموسة",
        description: "نركز على العائد على الاستثمار وشفافية الأداء.",
        className: "md:col-span-1 md:row-span-1",
        color: "from-green-500/20 to-transparent",
    },
    {
        icon: Users,
        title: "شراكة حقيقية",
        description: "نجاحك هو نجاحنا. نحن معك في كل خطوة.",
        className: "md:col-span-1 md:row-span-1",
        color: "from-purple-500/20 to-transparent",
    }
];

function BentoCard({ feature, index }: { feature: any, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
            onMouseMove={handleMouseMove}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 transition-all hover:border-white/20 ${feature.className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(238, 82, 57, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            
            <div className={`absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 group-hover:opacity-100 ${feature.color}`} />

            <div className="relative z-10 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <feature.icon className="h-7 w-7 text-[#ee5239] group-hover:text-white transition-colors duration-300" />
            </div>

            <div className="relative z-10 mt-auto">
                <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg max-w-sm">{feature.description}</p>
            </div>
            
            {/* Ambient background decoration */}
            <div className="absolute -right-10 -top-10 z-0 h-40 w-40 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover:scale-150 group-hover:bg-accent/10" />
        </motion.div>
    );
}

export default function Features() {
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
                        <span>تصميم استثنائي، نتائج مذهلة</span>
                    </motion.div>
                    
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 text-5xl md:text-6xl font-black tracking-tight text-white lg:text-7xl leading-[1.6]"
                    >
                        لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-300">POVA</span>؟
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-gray-400 md:text-xl"
                    >
                        نحن لا نقدم مجرد خدمات تقليدية، بل نصنع تجارب رقمية متكاملة تتخطى التوقعات وتضع علامتك التجارية في الصدارة.
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
