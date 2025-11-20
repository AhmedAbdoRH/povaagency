import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Testimonial } from '../types/database';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Constants for styling and animation
const VISIBLE_CARDS = 3;
const CARD_OFFSET_X = '8%';
const CARD_OFFSET_Y = '10px';
const CARD_SCALE_DECREMENT = 0.08;
const ANIMATION_DURATION = 500;

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const { data, error } = await supabase
          .from('testimonials')
          .select('id, customer_image_url, is_active, created_at, customer_name, content')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        clearTimeout(timeoutId);

        if (error) throw error;
        setTestimonials(data || []);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const testimonialsWithImages = testimonials; // Use all testimonials, even if image is missing (we can use placeholder)
  const totalTestimonials = testimonialsWithImages.length;

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || totalTestimonials <= 1) return;
    setIsAnimating(true);

    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % totalTestimonials;
      } else {
        return (prevIndex - 1 + totalTestimonials) % totalTestimonials;
      }
    });

    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, totalTestimonials]);

  const nextTestimonial = useCallback(() => handleNavigation('next'), [handleNavigation]);
  const prevTestimonial = useCallback(() => handleNavigation('prev'), [handleNavigation]);

  const goToTestimonial = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || totalTestimonials <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  }, [isAnimating, currentIndex, totalTestimonials]);

  useEffect(() => {
    if (totalTestimonials <= 1) return;
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, [totalTestimonials, nextTestimonial]);

  if (loading) {
    return (
      <div className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (totalTestimonials === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <section className="py-20 bg-black border-t border-white/5 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">ماذا يقول عملاؤنا</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نفخر بثقة عملائنا ونسعى دائماً لتقديم الأفضل. إليك بعض آراء شركاء النجاح.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative h-[450px] md:h-[500px] w-full flex justify-center items-center">
            {testimonialsWithImages.map((testimonial, index) => {
              let positionFactor = index - currentIndex;
              if (positionFactor < -totalTestimonials / 2) {
                positionFactor += totalTestimonials;
              } else if (positionFactor > totalTestimonials / 2) {
                positionFactor -= totalTestimonials;
              }

              let zIndex = totalTestimonials - Math.abs(positionFactor);
              let scale = 1 - Math.abs(positionFactor) * CARD_SCALE_DECREMENT;
              let opacity = positionFactor === 0 ? 1 : (Math.abs(positionFactor) < VISIBLE_CARDS ? 0.7 - Math.abs(positionFactor) * 0.2 : 0);
              let translateX = `${positionFactor * 100}%`;
              let cardOffsetY = `${Math.abs(positionFactor) * parseFloat(CARD_OFFSET_Y)}px`;

              if (positionFactor === 0) {
                translateX = '0%';
                cardOffsetY = '0px';
                scale = 1;
                opacity = 1;
                zIndex = VISIBLE_CARDS + 1;
              } else if (positionFactor > 0 && positionFactor < VISIBLE_CARDS) {
                translateX = `calc(${positionFactor * parseFloat(CARD_OFFSET_X)}% + ${positionFactor * 20}px)`;
                cardOffsetY = `${positionFactor * parseFloat(CARD_OFFSET_Y)}px`;
                scale = 1 - positionFactor * CARD_SCALE_DECREMENT;
                opacity = 1 - positionFactor * 0.3;
                zIndex = VISIBLE_CARDS - positionFactor;
              } else if (positionFactor < 0) {
                translateX = '-100%';
                opacity = 0;
                scale = 0.8;
                zIndex = 0;
              } else {
                translateX = '100%';
                opacity = 0;
                scale = 0.8;
                zIndex = 0;
              }

              return (
                <div
                  key={testimonial.id}
                  className="absolute w-full md:w-[600px] transition-all duration-500 ease-out origin-center"
                  style={{
                    transform: `translateX(${translateX}) translateY(${cardOffsetY}) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                  }}
                >
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-accent/30 transition-colors duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Quote className="w-24 h-24 text-white transform rotate-180" />
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className="w-24 h-24 rounded-full border-4 border-accent/20 overflow-hidden mb-6 shadow-lg">
                        <img
                          src={testimonial.customer_image_url || '/placeholder-user.jpg'}
                          alt={testimonial.customer_name || 'عميل'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://ui-avatars.com/api/?name=User&background=random';
                          }}
                        />
                      </div>

                      <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 font-light italic">
                        "{testimonial.content || 'تجربة رائعة مع POVA Agency. فريق محترف ونتائج مبهرة.'}"
                      </p>

                      <div>
                        <h4 className="text-white font-bold text-lg">{testimonial.customer_name || 'عميل مميز'}</h4>
                        <div className="flex gap-1 justify-center mt-2 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          {totalTestimonials > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4 rtl:space-x-reverse">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-accent text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="السابق"
                disabled={isAnimating}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex space-x-2 rtl:space-x-reverse">
                {testimonialsWithImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    disabled={isAnimating}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-accent w-8' : 'bg-white/20 w-2 hover:bg-white/40'
                      }`}
                    aria-label={`انتقل إلى ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-accent text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
                aria-label="التالي"
                disabled={isAnimating}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
