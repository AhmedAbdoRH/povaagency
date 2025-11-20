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
        <section className="py-20 bg-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">لماذا تختار POVA؟</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        نحن لا نقدم مجرد خدمات، بل نقدم حلولاً متكاملة تصنع الفارق.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
                        >
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors duration-300">
                                <feature.icon className="w-7 h-7 text-accent group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
