import { useEffect, useState, useCallback } from 'react';
import ServiceCard from './ServiceCard';
import { supabase } from '../lib/supabase';
import type { Service, Category, Subcategory } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | 'best_sellers' | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBestSellerProducts, setHasBestSellerProducts] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchServices();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      clearTimeout(timeoutId);

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('حدث خطأ في تحميل الفئات. يرجى المحاولة مرة أخرى.');
      setCategories([]);
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*),
          subcategory:subcategories(*)
        `)
        .order('created_at', { ascending: false });

      clearTimeout(timeoutId);

      if (error) throw error;
      setServices(data || []);

      const hasBestSellers = data?.some(service => service.is_best_seller) || false;
      setHasBestSellerProducts(hasBestSellers);
    } catch (err: any) {
      console.error('Error fetching services:', err);
      setError('حدث خطأ في تحميل الخدمات. يرجى المحاولة مرة أخرى.');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubcategories = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name_ar, description_ar, category_id')
        .order('name_ar');

      clearTimeout(timeoutId);

      if (error) throw error;
      const mapped: Subcategory[] = (data || []).map((sc: any) => ({
        id: sc.id,
        name: sc.name_ar ?? '',
        description: sc.description_ar ?? null,
        category_id: sc.category_id,
      }));
      setSubcategories(mapped);
    } catch (err) {
      console.error('Failed to fetch subcategories', err);
      setSubcategories([]);
    }
  };

  const filteredServices = useCallback((): Service[] => {
    let filtered = services;

    if (selectedCategory && selectedCategory !== 'best_sellers') {
      filtered = filtered.filter(service => service.category_id === selectedCategory);
    } else if (selectedCategory === 'best_sellers') {
      filtered = filtered.filter(service => service.is_best_seller === true);
    }

    if (selectedSubcategory) {
      filtered = filtered.filter(service => service.subcategory_id === selectedSubcategory);
    }

    return filtered;
  }, [selectedCategory, selectedSubcategory, services]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setOpenCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  const handleSubcategoryClick = (subcategoryId: string | null) => {
    setSelectedSubcategory(subcategoryId);
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center text-red-500">
          حدث خطأ أثناء تحميل الخدمات: {error}
        </div>
      </div>
    );
  }

  return (
    <section className="pt-8 pb-16 bg-primary" id="products-section">

      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, delayChildren: 0.3, staggerChildren: 0.2 } },
        }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl font-bold mb-4 text-white">
            {selectedSubcategory ? (
              <>
                {subcategories.find(sc => sc.id === selectedSubcategory)?.name} -
                {categories.find(c => c.id === selectedCategory)?.name}
              </>
            ) : selectedCategory ? (
              categories.find(c => c.id === selectedCategory)?.name || ''
            ) : (
              'خدماتنا المميزة'
            )}
          </h2>

          <div className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
            {selectedSubcategory ? (
              <p>
                اكتشف مجموعة واسعة من <strong>{subcategories.find(sc => sc.id === selectedSubcategory)?.name}</strong>
                في قسم <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>.
              </p>
            ) : selectedCategory ? (
              <p>
                تصفح مجموعة متنوعة من <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>.
              </p>
            ) : (
              <p>نقدم لك أفضل الحلول الرقمية والإبداعية لتنمية أعمالك</p>
            )}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* All Products Button */}
          <motion.button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
              setOpenCategoryId(null);
            }}
            className={`px-6 py-3 rounded-xl transition-all duration-300 font-bold ${!selectedCategory
                ? 'bg-accent text-white shadow-lg shadow-accent/30'
                : 'bg-secondary/10 text-gray-300 hover:bg-secondary/20 hover:text-white'
              }`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            جميع الخدمات
          </motion.button>

          {/* Best Services Category */}
          {hasBestSellerProducts && (
            <motion.button
              onClick={() => {
                setSelectedCategory('best_sellers');
                setSelectedSubcategory(null);
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-300 font-bold flex items-center gap-2 ${selectedCategory === 'best_sellers'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-secondary/10 text-gray-300 hover:bg-secondary/20 hover:text-white'
                }`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <span>🔥</span> الأكثر مبيعاً
            </motion.button>
          )}

          <AnimatePresence>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-bold ${category.id === selectedCategory
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'bg-secondary/10 text-gray-300 hover:bg-secondary/20 hover:text-white'
                  }`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {category.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Subcategories Section */}
        {openCategoryId && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-3 justify-center">
              <motion.button
                onClick={() => handleSubcategoryClick(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedSubcategory === null
                    ? 'bg-white text-primary'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                الكل
              </motion.button>

              <AnimatePresence>
                {subcategories
                  .filter(sc => sc.category_id === openCategoryId)
                  .map((subcategory, idx) => (
                    <motion.button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${selectedSubcategory === subcategory.id
                          ? 'bg-white text-primary'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {subcategory.name}
                    </motion.button>
                  ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <AnimatePresence mode="wait">
            {filteredServices().length > 0 ? (
              filteredServices().map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <ServiceCard
                    id={service.id}
                    title={service.title}
                    description={service.description || ''}
                    imageUrl={service.image_url || ''}
                    price={service.price}
                    salePrice={service.sale_price}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-services"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center text-gray-500 text-xl py-12"
                transition={{ duration: 0.5 }}
              >
                لا توجد خدمات في هذه الفئة حالياً.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
}