import React from 'react';
import type { Banner } from '../types/database';
import { motion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

interface BannerStripProps {
  banners: Banner[];
}

export default function BannerStrip({ banners }: BannerStripProps) {
  const { language } = useLanguage();
  
  // Filter only strip banners that are active and positioned below main
  const stripBanners = banners.filter(banner =>
    banner.type === 'strip' &&
    banner.is_active &&
    (banner.title?.trim() || (banner as any).title_en?.trim()) &&
    (banner as any).strip_position === 'below_main'
  );

  if (stripBanners.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {stripBanners.map((banner) => {
        const title = language === 'en' ? (banner.title_en || banner.title) : banner.title;
        const description = language === 'en' ? (banner.description_en || banner.description) : banner.description;

        return (
          <div
            key={banner.id}
            className="w-full py-1 px-4 text-center md:py-3"
            style={{
              backgroundColor: (banner as any).strip_background_color || '#ec533a',
              color: (banner as any).strip_text_color || '#ffffff',
            }}
          >
            <div className="container mx-auto">
              <motion.h2
                className="text-lg md:text-xl font-medium text-wrap-balance leading-tight"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {title}
              </motion.h2>
              {description && (
                <motion.p
                  className="text-sm md:text-base mt-1 opacity-90"
                  animate={{
                    scale: [1, 1.01, 1],
                    opacity: [0.8, 0.9, 0.8]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  {description}
                </motion.p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
