import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: "+500", label: "مشروع ناجح" },
    { value: "+100", label: "عميل سعيد" },
    { value: "+5", label: "سنوات خبرة" },
    { value: "24/7", label: "دعم فني" },
];

export default function Stats() {
    return (
        <section className="py-16 bg-header relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-4"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 font-cairo">{stat.value}</h3>
                            <p className="text-accent text-lg font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
