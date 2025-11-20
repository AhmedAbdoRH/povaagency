import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

export default function ContactUs() {
  return (
    <>
      <Helmet>
        <title>اتصل بنا - POVA Agency</title>
        <meta name="description" content="تواصل مع فريق POVA لمناقشة مشروعك القادم. نحن هنا لتحويل أفكارك إلى واقع." />
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
              ابدأ رحلتك مع <span className="text-accent">POVA</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              سواء كنت تبحث عن استشارة تسويقية، تصميم هوية، أو إدارة حملات إعلانية، فريقنا جاهز للاستماع إليك.
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
                    <h3 className="text-2xl font-bold text-white mb-2">اتصل بنا</h3>
                    <p className="text-gray-400 mb-4">نحن متاحون للرد على استفساراتك</p>
                    <a href="tel:+201006464349" className="text-xl font-bold text-white hover:text-accent transition-colors dir-ltr block">
                      +20 100 646 4349
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
                    <h3 className="text-2xl font-bold text-white mb-2">واتساب</h3>
                    <p className="text-gray-400 mb-4">تواصل سريع ومباشر مع فريقنا</p>
                    <a
                      href="https://wa.me/201006464349"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-white hover:text-accent transition-colors dir-ltr block"
                    >
                      +20 100 646 4349
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
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-secondary rounded-3xl overflow-hidden border border-gray-800 relative min-h-[400px]"
            >
              {/* Placeholder for map or office image */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-accent mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold text-white mb-2">موقعنا</h3>
                  <p className="text-gray-400">القاهرة، مصر</p>
                  <p className="text-sm text-gray-600 mt-4">سيتم إضافة الخريطة قريباً</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
