import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X as Close, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';
import type { Page, StoreSettings, Client } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  storeSettings?: StoreSettings | null;
}

export default function Header({ storeSettings }: HeaderProps) {
  const { t, language, toggleLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const [pages, setPages] = useState<Page[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      // Search in clients table
      const { data: clients, error } = await supabase
        .from('clients')
        .select(`*, specialization:specializations(name)`)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      if (!clients) {
        setSearchResults([]);
        return;
      }
      setSearchResults(clients);
    } catch (error) {
      console.error('Error searching clients:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data: pagesData, error: pageErr } = await supabase
          .from('pages')
          .select('*')
          .order('name');

        if (pageErr) throw pageErr;
        setPages(pagesData || []);
      } catch (err) {
        console.error('Error fetching navigation:', err);
      }
    };

    fetchPages();
  }, []);

  // ... (Click outside logic kept same) ...
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.services-dropdown-button')) {
        setIsServicesDropdownOpen(false);
      }
      if ('touches' in event) {
        const target = event.target as HTMLElement;
        if (searchInputRef.current && searchInputRef.current.contains(target)) return;
      } else {
        const target = event.target as HTMLElement;
        if (searchRef.current && !searchRef.current.contains(target)) setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);


  return (
    <header className="bg-primary/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-50">
            <img 
              src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png" 
              alt="POVA Agency" 
              className="h-12 w-auto object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">{t('header.home')}</Link>

            {/* Services Dropdown */}
            <div ref={servicesDropdownRef} className="relative group">
              <button 
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className="services-dropdown-button flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
              >
                {t('header.services') || 'الخدمات'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {pages.map(page => (
                        <Link
                          key={page.id}
                          to={`/page/${page.id}`}
                          onClick={() => setIsServicesDropdownOpen(false)}
                          className="block px-4 py-3 text-sm font-medium hover:bg-white/5 hover:text-accent transition-colors"
                        >
                          {page.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">{t('header.aboutUs')}</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-accent transition-colors">{t('header.contactUs')}</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {/* Language Toggle */}
             <button 
               onClick={toggleLanguage}
               className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-2 text-sm font-medium"
               title={t('header.language')}
             >
               <Globe className="w-5 h-5" />
               <span className="hidden sm:inline">{language.toUpperCase()}</span>
             </button>
             
             {/* Search */}
             <div className="relative" ref={searchRef}>
                <button onClick={() => setIsSearchFocused(!isSearchFocused)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                   <Search className="w-5 h-5" />
                </button>
                
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                       <div className="p-3">
                          <input 
                             ref={searchInputRef}
                             type="text" 
                             placeholder={t('header.searchPlaceholder')}
                             value={searchQuery}
                             onChange={(e) => handleSearch(e.target.value)}
                             className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent"
                             autoFocus
                          />
                       </div>
                       
                       {searchResults.length > 0 && (
                          <div className="max-h-60 overflow-y-auto border-t border-white/10">
                             {searchResults.map(client => (
                                <Link key={client.id} to={`/client/${client.id}`} onClick={clearSearch} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                                   <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                                      {client.logo_url ? <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" /> : <Search className="w-4 h-4 text-gray-500" />}
                                   </div>
                                   <div>
                                      <div className="text-sm font-medium text-white">{client.name}</div>
                                      <div className="text-xs text-gray-400">{client.specialization?.name}</div>
                                   </div>
                                </Link>
                             ))}
                          </div>
                       )}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Mobile Menu Button */}
             <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-white/5 rounded-full mobile-menu-button">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 lg:hidden backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
             <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-[#1a1a1a] border-l border-white/10 shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                   <div className="flex items-center justify-between mb-8">
                      <span className="text-xl font-bold text-white">{t('header.menu')}</span>
                      <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                         <Close className="w-6 h-6" />
                      </button>
                   </div>
                   
                   {/* Language Toggle in Mobile Menu */}
                   <div className="mb-6 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                      <button 
                        onClick={toggleLanguage}
                        className="w-full flex items-center justify-center gap-2 font-medium"
                      >
                        <Globe className="w-5 h-5" />
                        <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                      </button>
                   </div>
                   
                   <nav className="space-y-2">
                      <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">{t('header.home')}</Link>

                      {/* Services Dropdown Mobile */}
                      <div className="space-y-2">
                        <details className="group rounded-xl overflow-hidden hover:bg-white/5 transition-colors">
                          <summary className="px-4 py-3 font-medium cursor-pointer flex items-center justify-between">
                            {t('header.services') || 'الخدمات'}
                            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="bg-white/5 space-y-1 px-4 py-2">
                            {pages.map(page => (
                              <Link
                                key={page.id}
                                to={`/page/${page.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-lg hover:bg-white/5 hover:text-accent transition-colors text-sm"
                              >
                                {page.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      </div>

                      <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">{t('header.aboutUs')}</Link>
                      <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">{t('header.contactUs')}</Link>
                   </nav>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
