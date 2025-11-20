import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';
import { MessageCircle, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Service[]>([]);

  // Image slider state
  const [currentImage, setCurrentImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (id) {
      fetchService(id);
      fetchSuggested();
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('الخدمة غير موجودة');

      setService(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggested = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .neq('id', id)
      .limit(10);
    setSuggested(data || []);
  };

  const handleContact = () => {
    if (!service) return;
    const serviceUrl = window.location.href;
    const message = `استفسار عن الخدمة: ${service.title}\nرابط الخدمة: ${serviceUrl}`;
    window.open(`https://wa.me/message/IUSOLSYPTTE6G1?text=${encodeURIComponent(message)}`, '_blank');
  };

  const images: string[] = [
    service?.image_url || '',
    ...(Array.isArray(service?.gallery) ? service.gallery : [])
  ].filter(Boolean);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setCurrentImage(0);
  }, [service?.id]);

  const ogImage =
    service?.image_url && service.image_url.trim() !== ''
      ? service.image_url
      : '/logo.png';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black pt-24">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black pt-24 text-center px-4">
        <div className="text-2xl text-white font-bold">{error || 'الخدمة غير موجودة'}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-accent text-white px-8 py-3 rounded-xl hover:bg-accent/80 transition-all flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${service.title} | POVA Agency`}</title>
        <meta name="description" content={service.description || ''} />
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={service.title} />
        <meta name="twitter:description" content={service.description || ''} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">الرئيسية</button>
            <span>/</span>
            <span className="text-accent">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#1a1a1a] border border-white/10 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage] || '/placeholder-service.jpg'}
                  alt={service.title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentImage === idx ? 'w-6 bg-accent' : 'w-1.5 bg-white/50 hover:bg-white'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                {service.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line"
              >
                {service.description}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-400">السعر</span>
                  <div className="text-right">
                    {service.sale_price ? (
                      <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-accent">{service.sale_price} ج.م</span>
                        {service.price && (
                          <span className="text-sm text-gray-500 line-through">{service.price} ج.م</span>
                        )}
                      </div>
                    ) : service.price ? (
                      <span className="text-3xl font-bold text-white">{service.price} ج.م</span>
                    ) : (
                      <span className="text-xl font-bold text-gray-400">السعر عند الطلب</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`https://wa.me/message/IUSOLSYPTTE6G1?text=${encodeURIComponent(`أريد طلب الخدمة: ${service.title}\n${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-accent/20"
                  >
                    <MessageSquare className="w-5 h-5" />
                    اطلب الخدمة الآن
                  </a>

                  <div className="flex gap-3">
                    <button
                      onClick={handleContact}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-white/10"
                    >
                      <MessageCircle className="w-5 h-5" />
                      استفسار
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`شاهد هذه الخدمة المميزة من POVA Agency: ${service.title}\n${window.location.href}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-white/10"
                    >
                      <ArrowRight className="w-5 h-5 -rotate-45" />
                      مشاركة
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-3 rounded-lg w-fit">
                <CheckCircle2 className="w-4 h-4" />
                <span>ضمان جودة العمل والتسليم في الموعد</span>
              </div>
            </div>
          </div>

          {/* Suggested Services */}
          {suggested.length > 0 && (
            <div className="border-t border-white/10 pt-16">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">خدمات قد تهمك أيضاً</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suggested.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ y: -5 }}
                    className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 cursor-pointer group"
                    onClick={() => navigate(`/service/${item.id}`)}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.image_url || '/placeholder-service.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-bold">عرض التفاصيل</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 truncate">{item.title}</h3>
                      <div className="text-accent font-bold text-sm">
                        {item.price ? `${item.price} ج.م` : 'السعر عند الطلب'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}