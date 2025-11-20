import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string | string[];
  price?: number | null;
  salePrice?: number | null;
  id: string | number;
  gallery?: string[];
}

export default function ServiceCard({ title, description, imageUrl, price, salePrice, id, gallery = [] }: ProductCardProps) {
  // Convert single image to array for consistent handling
  const images = useMemo(() => {
    if (Array.isArray(imageUrl)) return imageUrl;
    return imageUrl ? [imageUrl] : [];
  }, [imageUrl]);

  // Add gallery images if available
  const allImages = useMemo(() => {
    const mainImages = images.filter(Boolean);
    const additionalImages = Array.isArray(gallery) ? gallery.filter(Boolean) : [];
    return [...new Set([...mainImages, ...additionalImages])]; // Remove duplicates
  }, [images, gallery]);

  // Pricing: show only if present in DB
  const { displayPrice, displaySalePrice } = useMemo(() => {
    const priceAsFloat = price ? parseFloat(price as any) : null;
    const salePriceAsFloat = salePrice ? parseFloat(salePrice as any) : null;

    if (priceAsFloat || salePriceAsFloat) {
      return {
        displayPrice: priceAsFloat,
        displaySalePrice: salePriceAsFloat
      };
    }

    return {
      displayPrice: null,
      displaySalePrice: null
    };
  }, [price, salePrice]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${window.location.origin}/service/${id}`;
    const message = `استفسار عن الخدمة: ${title}\nرابط الخدمة: ${productUrl}`;
    window.open(`https://wa.me/message/IUSOLSYPTTE6G1?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="group relative bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/30">
      <Link to={`/service/${id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {allImages.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              loop={allImages.length > 1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-accent',
                renderBullet: (index, className) => {
                  return `<span class="${className} w-2 h-2 mx-1 rounded-full transition-all duration-300"></span>`;
                }
              }}
              className="w-full h-full"
            >
              {allImages.map((img, index) => (
                <SwiperSlide key={index} className="w-full h-full">
                  <img
                    src={img}
                    alt={`${title} - صورة ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-service.jpg';
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-[#222] flex items-center justify-center">
              <span className="text-gray-600">لا توجد صورة</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Floating Badge if sale */}
          {displaySalePrice && displayPrice && (
            <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
              خصم مميز
            </div>
          )}
        </div>

        <div className="p-6 relative">
          <h3 className="text-xl font-bold mb-2 text-white flex items-center gap-2 group-hover:text-accent transition-colors duration-300">
            {title}
            <Sparkles className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
            {description ? description.split(/\r?\n/)[0] : ''}
          </p>

          <div className="flex justify-between items-end border-t border-white/10 pt-4">
            <div className="flex flex-col">
              {displaySalePrice ? (
                <>
                  <div className="flex items-center gap-1 text-accent">
                    <span className="font-bold text-2xl">{displaySalePrice}</span>
                    <span className="text-sm font-bold">ج.م</span>
                  </div>
                  {displayPrice && (
                    <div className="flex items-center gap-1 text-gray-500 text-xs line-through">
                      <span>{displayPrice}</span>
                      <span>ج.م</span>
                    </div>
                  )}
                </>
              ) : displayPrice ? (
                <div className="flex items-center gap-1 text-white">
                  <span className="font-bold text-2xl">{displayPrice}</span>
                  <span className="text-sm font-bold">ج.م</span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">السعر عند الطلب</span>
              )}
            </div>

            <button
              onClick={handleContactClick}
              className="bg-white/5 hover:bg-accent text-white p-3 rounded-xl transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent/20 flex items-center justify-center"
              aria-label="تواصل معنا"
            >
              <ArrowRight className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}