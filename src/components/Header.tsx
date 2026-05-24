import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X as Close, Globe, ChevronDown, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';
import type { Page, StoreSettings, Client } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveCoreServicesWithPages } from '../data/coreServices';
import { Layers } from 'lucide-react';

interface HeaderProps {
  storeSettings?: StoreSettings | null;
}

export default function Header({ storeSettings }: HeaderProps) {
  const { t, language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [servicesOpenMobile, setServicesOpenMobile] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);

  const servicesDropdownRef = useRef<HTMLDivElement>(null);



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
        // No search to check here
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
      <header className="bg-[#0c1426] text-white sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png"
                alt="POVA Agency"
                className="h-10 md:h-12 w-auto object-contain brightness-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-white/90 hover:text-accent transition-colors">{t('header.home')}</Link>

              <div ref={servicesDropdownRef} className="relative">
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className="services-dropdown-button flex items-center gap-2 text-sm font-medium text-white/90 hover:text-accent transition-colors py-2"
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
                      className="absolute top-full start-0 mt-2 w-52 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-white"
                    >
                      <div className="py-2">
                        {resolveCoreServicesWithPages(pages).filter(cs => cs.page).map(cs => (
                          <Link 
                            key={cs.page!.id} 
                            to={`/page/${cs.page!.id}`} 
                            onClick={() => setIsServicesDropdownOpen(false)} 
                            className="flex items-center gap-3 px-5 py-3 text-sm font-medium hover:bg-neutral-800 hover:text-accent transition-colors group"
                          >
                            <div className={`p-1.5 rounded-lg bg-neutral-800 group-hover:bg-accent/15 transition-colors ${cs.iconColor || 'text-accent'}`}>
                              {cs.icon ? <cs.icon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                            </div>
                            {language === 'en' ? (cs.page!.name_en || cs.page!.name) : cs.page!.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/about" className="text-sm font-medium text-white/90 hover:text-accent transition-colors">{t('header.aboutUs')}</Link>
              <Link to="/contact" className="text-sm font-medium text-white/90 hover:text-accent transition-colors">{t('header.contactUs')}</Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-1.5 text-sm font-medium text-white/90"
              >
                <Globe className="w-5 h-5 text-white/80" />
                <span className="inline text-[10px] font-bold">
                  <span className={language === 'ar' ? 'text-accent font-extrabold' : 'text-white/40'}>AR</span>
                  <span className="mx-0.5 opacity-30 text-white/40">/</span>
                  <span className={language === 'en' ? 'text-accent font-extrabold' : 'text-white/40'}>EN</span>
                </span>
              </button>

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
          background: '#ffffff',
          borderLeft: language === 'en' ? '1px solid rgba(0,0,0,0.08)' : 'none',
          borderRight: language === 'ar' ? '1px solid rgba(0,0,0,0.08)' : 'none',
          boxShadow: language === 'en' ? '-20px 0 60px rgba(0,0,0,0.5)' : '20px 0 60px rgba(0,0,0,0.5)',
          zIndex: 9999,
          transition: language === 'ar' ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <img
            src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png"
            alt="POVA"
            className="h-9 w-auto"
          />
          <button
            onClick={closeMenu}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-900 transition-colors"
            aria-label="Close menu"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 p-5 flex flex-col gap-6 overflow-y-auto">



          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-base transition-colors"
            >
              {t('header.home')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>

            {/* Services accordion */}
            <div className="rounded-2xl bg-gray-50 text-gray-900 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-bold text-base text-accent flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {t('header.services') || 'الخدمات'}
                </h3>
              </div>
              <div className="px-3 py-2 flex flex-col gap-1">
                {resolveCoreServicesWithPages(pages).filter(cs => cs.page).map(cs => (
                  <Link
                    key={cs.page!.id}
                    to={`/page/${cs.page!.id}`}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 hover:text-accent text-sm font-medium transition-colors text-gray-700 group"
                  >
                    <div className={`p-2 rounded-lg bg-white group-hover:bg-accent/10 transition-colors ${cs.iconColor || 'text-accent'}`}>
                      {cs.icon ? <cs.icon className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                    </div>
                    {language === 'en' ? (cs.page!.name_en || cs.page!.name) : cs.page!.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/about"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-base transition-colors"
            >
              {t('header.aboutUs')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
              className="flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold text-base transition-colors"
            >
              {t('header.contactUs')}
              {language === 'ar' ? <ChevronLeft className="w-4 h-4 opacity-40" /> : <ChevronLeft className="w-4 h-4 opacity-40 rotate-180" />}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-gray-200">
          <p className="text-gray-600 text-xs text-center">© POVA Agency. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
