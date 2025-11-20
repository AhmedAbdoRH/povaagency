import React, { useEffect, useRef, useState } from 'react';
import type { Banner } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerSliderProps {
  banners: Banner[];
}

const SLIDE_INTERVAL = 5000;

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (banners.length <= 1) return;
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, SLIDE_INTERVAL);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [current, banners]);

  if (!banners.length) return null;

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden mt-20"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {banners[current].type === 'image' && banners[current].image_url ? (
            <>
              <img
                src={banners[current].image_url}
                alt={banners[current].title || 'Banner'}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center bg-[#1a1a1a] relative overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 blur-3xl"></div>
              <div className="relative z-10 p-8 text-center max-w-4xl">
                {banners[current].title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                    {banners[current].title}
                  </h1>
                )}
                {banners[current].description && (
                  <p className="text-lg md:text-2xl text-gray-300 leading-relaxed">
                    {banners[current].description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Text Overlay for Image Banners */}
          {(banners[current].type === 'image' && banners[current].image_url) && (banners[current].title || banners[current].description) && (
            <div className="absolute inset-0 flex flex-col justify-end pb-20 md:pb-32 px-4 md:px-20 z-20">
              <div className="max-w-4xl">
                {banners[current].title && (
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
                  >
                    {banners[current].title}
                  </motion.h1>
                )}
                {banners[current].description && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-200 drop-shadow-md max-w-2xl"
                  >
                    {banners[current].description}
                  </motion.p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${current === idx ? 'w-8 bg-accent' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
