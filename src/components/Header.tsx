import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, X, Menu, X as Close } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, StoreSettings, Service } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  storeSettings?: StoreSettings | null;
}

export default function Header({ storeSettings }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcatsByCategory, setSubcatsByCategory] = useState<Record<string, { id: string; name: string }[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);


  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*),
          product_images(image_url)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      clearTimeout(timeoutId);

      if (servicesError) throw servicesError;

      if (!services) {
        setSearchResults([]);
        return;
      }

      const formattedServices = services.map(service => ({
        ...service,
        displayImage: service.product_images?.[0]?.image_url || service.image_url || '/placeholder-product.jpg'
      }));

      setSearchResults(formattedServices);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const { data, error } = await supabase
          .from('categories')
          .select('id, name, created_at, description')
          .order('name');

        clearTimeout(timeoutId);

        if (error) throw error;
        const mapped = (data || []).map((c: any) => ({
          id: c.id as string,
          name: (c.name as string) || '',
          description: (c.description as string) || null,
          created_at: (c.created_at as string) || ''
        }));
        setCategories(mapped);

        const { data: subs, error: subErr } = await supabase
          .from('subcategories')
          .select('id, name_ar, category_id')
          .order('name_ar');
        if (subErr) throw subErr;
        const grouped: Record<string, { id: string; name: string }[]> = {};
        (subs || []).forEach((s: any) => {
          const key = s.category_id as string;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push({ id: s.id as string, name: (s.name_ar as string) || '' });
        });
        setSubcatsByCategory(grouped);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
        setSubcatsByCategory({});
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
      if ('touches' in event) {
        const target = event.target as HTMLElement;
        if (searchInputRef.current && searchInputRef.current.contains(target)) {
          return;
        }
      } else {
        const target = event.target as HTMLElement;

        if (searchRef.current && !searchRef.current.contains(target)) {
          setIsSearchFocused(false);
        }

        if (isMobileSearchOpen && !target.closest('.mobile-search-container')) {
          const isSearchIcon = target.closest('button[aria-label="بحث"]');
          const isSearchInput = target.closest('input[type="text"]');

          if (!isSearchIcon && !isSearchInput) {
            setIsMobileSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          if ('virtualKeyboard' in navigator) {
            // @ts-ignore
            navigator.virtualKeyboard.show();
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-black/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white p-2 -ml-2 mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              {isMenuOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link to="/" className="flex-shrink-0">
              {storeSettings?.logo_url ? (
                <img
                  src={storeSettings.logo_url}
                  alt={storeSettings?.store_name || 'POVA Agency'}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              ) : (
                <img
                  src="/‏‏logo.png"
                  alt="POVA Agency Logo"
                  className="h-12 md:h-16 w-auto object-contain"
                />
              )}
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-xl mx-8" ref={searchRef}>
            <div className="relative hidden md:block flex-1 max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                }}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="ابحث عن خدمة..."
                className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 border border-white/10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSearch();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && (searchResults.length > 0 || (searchQuery.length >= 2 && searchResults.length === 0)) && (
              <div className="absolute mt-2 w-full bg-[#1a1a1a] backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50">
                {searchResults.map((service) => (
                  <Link
                    key={service.id}
                    to={`/service/${service.id}`}
                    className="flex items-center p-3 hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0"
                    onClick={clearSearch}
                  >
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                      <img
                        src={service.displayImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-service.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 text-right pr-3">
                      <h4 className="text-white font-medium">{service.title}</h4>
                      <p className="text-xs text-gray-400">
                        {service.category?.name || ''}
                      </p>
                    </div>
                  </Link>
                ))}

                {searchResults.length === 0 && searchQuery.length >= 2 && (
                  <div className="p-4 text-center text-gray-400">
                    لا توجد نتائج لـ "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const wasOpen = isMobileSearchOpen;
                setIsMobileSearchOpen(!wasOpen);
                if (wasOpen && document.activeElement) {
                  (document.activeElement as HTMLElement).blur();
                }
              }}
              className="md:hidden p-2 text-white hover:text-accent transition-colors"
              aria-label="بحث"
            >
              <Search className="h-6 w-6" />
            </button>

            <nav>
              <ul className="flex gap-4 md:gap-8 items-center">
                <li className="hidden md:block">
                  <Link to="/" className="text-white hover:text-accent transition-colors duration-300 font-medium">
                    الرئيسية
                  </Link>
                </li>

                <li className="hidden md:block relative group">
                  <button className="text-white hover:text-accent transition-colors duration-300 flex items-center gap-1 font-medium">
                    الأقسام
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div className="absolute top-full right-0 mt-4 w-64 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-2">
                      {loadingCategories ? (
                        <div className="text-gray-400 text-center py-4">جاري التحميل...</div>
                      ) : categories.length > 0 ? (
                        <div className="space-y-1">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              to={`/category/${category.id}`}
                              className="block px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center py-4">لا توجد أقسام متاحة</div>
                      )}
                    </div>
                  </div>
                </li>

                <li className="hidden md:block">
                  <Link to="/contact" className="px-6 py-2 bg-accent text-white rounded-full hover:bg-white hover:text-accent transition-all duration-300 font-bold shadow-lg shadow-accent/20">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="fixed top-[72px] left-0 right-0 bg-[#1a1a1a] p-4 z-40 border-b border-white/10 md:hidden">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="ابحث عن خدمة..."
                className="w-full bg-white/5 text-white placeholder-gray-400 rounded-xl py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-accent border border-white/10"
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-[#1a1a1a] rounded-xl shadow-xl border border-white/10 overflow-hidden z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((service) => (
                    <Link
                      key={service.id}
                      to={`/service/${service.id}`}
                      className="flex items-center p-3 hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0"
                      onClick={() => {
                        clearSearch();
                        setIsMobileSearchOpen(false);
                      }}
                    >
                      <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                        <img
                          src={service.displayImage}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-service.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 text-right pr-3">
                        <h4 className="text-white font-medium text-sm">{service.title}</h4>
                        {service.category?.name && (
                          <p className="text-xs text-gray-400">{service.category.name}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut' }}
              className="fixed inset-y-0 right-0 w-80 bg-[#1a1a1a] z-50 shadow-2xl md:hidden pt-20 flex flex-col border-l border-white/10"
              ref={menuRef}
            >
              <nav className="p-4 flex-1 overflow-y-auto">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="block px-5 py-4 text-lg text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      الرئيسية
                    </Link>
                  </li>

                  <li className="bg-white/5 rounded-xl overflow-hidden">
                    <div className="px-5 py-3 text-gray-400 text-sm font-medium border-b border-white/5">
                      الأقسام
                    </div>
                    {loadingCategories ? (
                      <div className="px-5 py-4 text-gray-500 text-center">جاري التحميل...</div>
                    ) : categories.length > 0 ? (
                      <ul className="py-2">
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              to={`/category/${category.id}`}
                              className="block px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-5 py-4 text-gray-500 text-center">لا توجد أقسام متاحة</div>
                    )}
                  </li>

                  <li>
                    <Link
                      to="/contact"
                      className="block px-5 py-4 text-lg text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      تواصل معنا
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span>إغلاق القائمة</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </header>
    </>
  );
}
