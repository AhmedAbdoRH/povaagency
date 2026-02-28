import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: "استراتيجيات دقيقة",
        description: "نحلل جمهورك المستهدف بدقة لنبني خططاً تسويقية تصل إليهم مباشرة وتحقق أهدافك."
    },
    {
        icon: Lightbulb,
        title: "إبداع بلا حدود",
        description: "فريقنا من المصممين وصناع المحتوى يبتكرون أفكاراً خارج الصندوق لتمييز علامتك التجارية."
    },
    {
        icon: TrendingUp,
        title: "نتائج ملموسة",
        description: "نركز على العائد على الاستثمار (ROI) ونقدم تقارير دورية شفافة توضح نمو مشروعك."
    },
    {
        icon: Users,
        title: "شراكة حقيقية",
        description: "نعتبر أنفسنا جزءاً من فريقك، ونجاحك هو نجاحنا. نحن معك في كل خطوة."
    }
];

export default function Features() {
    return (
        <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 text-wrap-balance leading-[1.2]"
                    >
                        لماذا تختار POVA؟
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto text-xl"
                    >
                        نحن لا نقدم مجرد خدمات، بل نقدم حلولاً متكاملة تصنع الفارق.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10 }}
                            className="bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-500 border border-white/5 hover:border-white/20 group relative overflow-hidden backdrop-blur-md"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="w-16 h-16 bg-[#151515] border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl relative z-10">
                                <feature.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10 text-wrap-balance leading-[1.3]">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
