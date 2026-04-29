import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X as Close, Globe, ChevronDown, ChevronLeft } from 'lucide-react';
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
  const [servicesOpenMobile, setServicesOpenMobile] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); return; }
    try {
      const { data: clients, error } = await supabase
        .from('clients')
        .select(`*, specialization:specializations(name)`)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);
      if (error) throw error;
      setSearchResults(clients || []);
    } catch { setSearchResults([]); }
  };

  const clearSearch = () => { setSearchQuery(''); setSearchResults([]); setIsSearchFocused(false); };

  useEffect(() => {
    supabase.from('pages').select('*').order('name').then(({ data }) => setPages(data || []));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as HTMLElement;
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(target) && !target.closest('.services-dropdown-button')) {
        setIsServicesDropdownOpen(false);
      }
      if (!('touches' in e)) {
        if (searchRef.current && !searchRef.current.contains(target)) setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('touchstart', handleClickOutside); };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => { setIsMenuOpen(false); setServicesOpenMobile(false); };

  return (
    <>
      <header className="bg-primary/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png"
                alt="POVA Agency"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">{t('header.home')}</Link>

              <div ref={servicesDropdownRef} className="relative">
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className="services-dropdown-button flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors py-2"
                >
                  {t('header.services') || 'الخدمات'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isServicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full start-0 mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="py-2">
                        {pages.map(page => (
                          <Link key={page.id} to={`/page/${page.id}`} onClick={() => setIsServicesDropdownOpen(false)} className="block px-5 py-3 text-sm font-medium hover:bg-white/5 hover:text-accent transition-colors">
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

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-1.5 text-sm font-medium"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline text-xs">{language.toUpperCase()}</span>
              </button>

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button onClick={() => setIsSearchFocused(!isSearchFocused)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <Search className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full end-0 mt-2 w-72 md:w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-3">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder={t('header.searchPlaceholder')}
                          value={searchQuery}
                          onChange={e => handleSearch(e.target.value)}
                          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                          autoFocus
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <div className="max-h-60 overflow-y-auto border-t border-white/10">
                          {searchResults.map(client => (
                            <Link key={client.id} to={`/client/${client.id}`} onClick={clearSearch} className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors">
                              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                {client.logo_url ? <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" /> : <Search className="w-4 h-4 text-gray-500" />}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{client.name}</div>
                                <div className="text-xs text-gray-400">{(client as any).specialization?.name}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={openMenu}
                aria-label="Open menu"
                className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Sidebar (CSS-based, RTL-safe) ── */}
      {/* Backdrop */}
      {/* Backdrop */}
      <div
        dir="ltr"
        onClick={closeMenu}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: language === 'ar' ? (isMenuOpen ? 0 : '-100vw') : 'auto',
          right: language === 'en' ? (isMenuOpen ? 0 : '-100vw') : 'auto',
          bottom: 0,
          width: '85vw',
          maxWidth: '360px',
          background: '#0f0f0f',
          borderLeft: language === 'en' ? '1px solid rgba(255,255,255,0.08)' : 'none',
          borderRight: language === 'ar' ? '1px solid rgba(255,255,255,0.08)' : 'none',
          boxShadow: language === 'en' ? '-20px 0 60px rgba(0,0,0,0.5)' : '20px 0 60px rgba(0,0,0,0.5)',
          zIndex: 9999,
          transition: language === 'ar' ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <img
            src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png"
            alt="POVA"
            className="h-9 w-auto"
          />
          <button
            onClick={closeMenu}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            aria-label="Close menu"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 p-5 flex flex-col gap-6 overflow-y-auto">

          {/* Language toggle */}
          <button
            onClick={() => { toggleLanguage(); closeMenu(); }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-bold transition-colors hover:bg-accent/20"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </div>
            <span className="text-xs opacity-60 font-mono">{language.toUpperCase()}</span>
          </button>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-base transition-colors"
            >
              {t('header.home')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>

            {/* Services accordion */}
            <div className="rounded-2xl bg-white/5 overflow-hidden">
              <button
                onClick={() => setServicesOpenMobile(!servicesOpenMobile)}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-base transition-colors hover:bg-white/10"
              >
                {t('header.services') || 'الخدمات'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpenMobile ? 'rotate-180' : ''}`} />
              </button>
              <div
                style={{
                  maxHeight: servicesOpenMobile ? `${pages.length * 60 + 16}px` : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}
              >
                <div className="px-3 pb-3 flex flex-col gap-1">
                  {pages.map(page => (
                    <Link
                      key={page.id}
                      to={`/page/${page.id}`}
                      onClick={closeMenu}
                      className="block px-4 py-3 rounded-xl hover:bg-white/10 hover:text-accent text-sm font-medium transition-colors text-gray-300"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-base transition-colors"
            >
              {t('header.aboutUs')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold text-base transition-colors"
            >
              {t('header.contactUs')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-white/5">
          <p className="text-gray-600 text-xs text-center">© POVA Agency. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
