import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, X, Menu, X as Close } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page, StoreSettings, Client } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';
import UserLogin from './UserLogin';

interface HeaderProps {
  storeSettings?: StoreSettings | null;
}

export default function Header({ storeSettings }: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Renamed states
  const [pages, setPages] = useState<Page[]>([]);
  const [specsByPage, setSpecsByPage] = useState<Record<string, { id: string; name: string }[]>>({});
  
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loadingPages, setLoadingPages] = useState(true);

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
        .select(`*, specialization:specializations(name_ar)`)
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

  const togglePageExpansion = (pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) newSet.delete(pageId);
      else newSet.add(pageId);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchPagesAndSpecs = async () => {
      try {
        const { data: pagesData, error: pageErr } = await supabase
          .from('pages')
          .select('id, name, created_at, description, slug')
          .order('name');

        if (pageErr) throw pageErr;
        setPages(pagesData || []);

        const { data: specs, error: specErr } = await supabase
          .from('specializations')
          .select('id, name_ar, page_id')
          .order('name_ar');
          
        if (specErr) {
             console.warn("Could not fetch specializations (table might not exist yet)", specErr);
        } else {
            const grouped: Record<string, { id: string; name: string }[]> = {};
            (specs || []).forEach((s: any) => {
              const key = s.page_id as string;
              if (!key) return;
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push({ id: s.id, name: s.name_ar });
            });
            setSpecsByPage(grouped);
        }
      } catch (err) {
        console.error('Error fetching navigation:', err);
      } finally {
        setLoadingPages(false);
      }
    };

    fetchPagesAndSpecs();
  }, []);

  // ... (Click outside logic kept same) ...
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
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
            {storeSettings?.logo_url ? (
              <img src={storeSettings.logo_url} alt={storeSettings.store_name || 'Logo'} className="h-12 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-bold bg-gradient-to-r from-accent to-gold bg-clip-text text-transparent">
                {storeSettings?.store_name || 'POVA'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">الرئيسية</Link>
            
            {/* Dynamic Pages Menu */}
            {pages.map(page => (
               <div key={page.id} className="relative group">
                  <Link to={`/page/${page.id}`} className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 py-2">
                    {page.name}
                    {specsByPage[page.id]?.length > 0 && <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />}
                  </Link>
                  
                  {/* Dropdown for Specializations */}
                  {specsByPage[page.id]?.length > 0 && (
                    <div className="absolute top-full right-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                       <div className="py-2">
                          {specsByPage[page.id].map(spec => (
                             <Link key={spec.id} to={`/specialization/${spec.id}`} className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-accent transition-colors">
                                {spec.name}
                             </Link>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            ))}
            
            <Link to="/about" className="text-sm font-medium hover:text-accent transition-colors">من نحن</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-accent transition-colors">اتصل بنا</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
             {/* User Login */}
             <UserLogin />
             
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
                             placeholder="بحث عن عميل..." 
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
                                      <div className="text-xs text-gray-400">{client.specialization?.name_ar}</div>
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
                      <span className="text-xl font-bold text-white">القائمة</span>
                      <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                         <Close className="w-6 h-6" />
                      </button>
                   </div>
                   
                   <nav className="space-y-2">
                      <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">الرئيسية</Link>
                      
                      {pages.map(page => (
                         <div key={page.id}>
                            <button onClick={() => togglePageExpansion(page.id)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 font-medium text-right">
                               {page.name}
                               {specsByPage[page.id]?.length > 0 && <ChevronDown className={`w-4 h-4 transition-transform ${expandedPages.has(page.id) ? 'rotate-180' : ''}`} />}
                            </button>
                            
                            <AnimatePresence>
                               {expandedPages.has(page.id) && specsByPage[page.id]?.length > 0 && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/20 rounded-xl mt-1">
                                     {specsByPage[page.id].map(spec => (
                                        <Link key={spec.id} to={`/specialization/${spec.id}`} onClick={() => setIsMenuOpen(false)} className="block px-8 py-3 text-sm text-gray-300 hover:text-white border-r-2 border-transparent hover:border-accent">
                                           {spec.name}
                                        </Link>
                                     ))}
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      ))}
                      
                      <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">من نحن</Link>
                      <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-white/5 font-medium">اتصل بنا</Link>
                   </nav>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
