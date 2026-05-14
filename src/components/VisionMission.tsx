import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Rocket } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function VisionMission() {
  const { t } = useLanguage();

  const data = [
    {
      id: 'vision',
      title: t('visionMission.vision.title'),
      icon: Eye,
      gradient: 'from-orange-500/80 to-red-600/80',
      content: [
        t('visionMission.vision.content.0'),
        t('visionMission.vision.content.1')
      ],
    },
    {
      id: 'mission',
      title: t('visionMission.mission.title'),
      icon: Rocket,
      gradient: 'from-blue-600/80 to-cyan-500/80',
      content: [
        t('visionMission.mission.content.0'),
        t('visionMission.mission.content.1')
      ],
    },
  ];
  return (
    <section className="relative min-h-[800px] flex items-center py-32 bg-white text-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(238,82,57,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(238,82,57,0.1),transparent_50%)] z-10" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />
        </div>

      <div className="container relative z-20 mx-auto px-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-8 md:flex-row items-stretch">
            
            {data.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex-1 relative group"
                >
                    <div className="h-full bg-white backdrop-blur-md border border-gray-200 p-10 md:p-14 rounded-[3rem] transition-all duration-500 hover:border-gray-300 overflow-hidden shadow-xl">
                        
                        {/* Glow Effect */}
                        <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${item.gradient} rounded-full blur-[100px] opacity-20 transition-opacity duration-700 group-hover:opacity-40 pointer-events-none`} />

                        <div className="relative z-10">
                            <div className="w-20 h-20 mb-8 rounded-3xl bg-gray-50 backdrop-blur-xl border border-gray-200 flex items-center justify-center shadow-lg transform -rotate-6 transition-transform duration-500 group-hover:rotate-0">
                                <item.icon className="w-10 h-10 text-gray-900" />
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.6]">
                                {item.title}
                            </h2>
                            
                            <div className="space-y-6">
                                {item.content.map((paragraph, idx) => (
                                    <p key={idx} className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

        </div>
      </div>
    </section>
  );
}
