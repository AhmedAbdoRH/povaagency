import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, Map } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export default function ContactUs() {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>{t('contact.title')} - POVA Agency</title>
        <meta name="description" content={t('contact.subtitle')} />
      </Helmet>

      <div className="min-h-screen bg-primary pt-24 pb-20">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              {t('contact.title')} <span className="text-accent">POVA</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {t('contact.subtitle')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Info Cards */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-secondary p-8 rounded-3xl border border-gray-800 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-300">
                    <Phone className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('footer.contactUs')}</h3>
                    <p className="text-gray-400 mb-4">نحن متاحون للرد على استفساراتك</p>
                    <a href="tel:+201503600455" className="text-xl font-bold text-white hover:text-accent transition-colors dir-ltr block">
                      +20 150 360 0455
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-secondary p-8 rounded-3xl border border-gray-800 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-300">
                    <MessageCircle className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{t('footer.whatsapp')}</h3>
                    <p className="text-gray-400 mb-4">تواصل سريع ومباشر مع فريقنا</p>
                    <a
                      href="https://wa.me/201503600455"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-white hover:text-accent transition-colors dir-ltr block"
                    >
                      +20 150 360 0455
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-secondary p-8 rounded-3xl border border-gray-800 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-accent/10 rounded-2xl group-hover:bg-accent transition-colors duration-300">
                    <Clock className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">ساعات العمل</h3>
                    <div className="space-y-2 text-gray-400">
                      <p>الأحد - الخميس: 9:00 ص - 10:00 م</p>
                      <p>الجمعة - السبت: 9:00 ص - 10:00 م</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Map or Image */}
            <motion.a
              href="https://maps.app.goo.gl/9VvT7zRYfh46ZQTC6"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-secondary rounded-3xl overflow-hidden border border-gray-800 relative min-h-[400px] group block cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#121212] flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50" />
                <div className="text-center p-8 relative z-10">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <MapPin className="w-10 h-10 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">موقعنا على الخريطة</h3>
                  <p className="text-gray-400 text-lg mb-8">تقاطع شارع الموقف مع كلية التجارة</p>
                  <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-base font-bold shadow-2xl hover:bg-accent hover:text-white transition-all duration-300 transform group-hover:translate-y-[-5px]">
                    <Map className="w-5 h-5" />
                    افتح في خرائط جوجل
                  </span>
                </div>
              </div>
            </motion.a>

          </div>
        </div>
      </div>
    </>
  );
}
