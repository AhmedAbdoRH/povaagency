import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PageDetails from './pages/PageDetails';
import SpecializationDetails from './pages/SpecializationDetails';
import ClientDetails from './pages/ClientDetails';
import ServiceDetails from './pages/ServiceDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import DownloadPage from './pages/DownloadPage';
import StructuredData from './components/StructuredData';
import Hero from './components/Hero';
import CollaborationForm from './components/CollaborationForm';
import DesignRequest from './pages/DesignRequest';
import Features from './components/Features';
import Stats from './components/Stats';
import WhySocialMarketing from './components/WhySocialMarketing';
import VisualStorytellingReasons from './components/VisualStorytellingReasons';
import VisionMission from './components/VisionMission';
import CompanyValues from './components/CompanyValues';
import DigitalMarketingBenefits from './components/DigitalMarketingBenefits';
import BrandDifferentiation from './components/BrandDifferentiation';
import MarketingCoreServices from './components/MarketingCoreServices';
import LoadingScreen from './components/LoadingScreenNew';
import type { StoreSettings, Banner } from './types/database';
import { ThemeProvider } from './theme/ThemeContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// PrivateRoute component for Admin only
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  }

  if (isAuthenticated === null) {
    return <div className="loading-spinner"></div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

interface LayoutProps {
  children: React.ReactNode;
  banners: Banner[];
  storeSettings?: StoreSettings | null;
}

const Layout = ({ children, banners: layoutBanners, storeSettings }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const pageMatch = location.pathname.match(/^\/page\/([a-zA-Z0-9-]+)$/);
  const currentPageId = pageMatch ? pageMatch[1] : null;

  const currentBanners = layoutBanners.filter(banner => {
     if (!banner.is_active || banner.type !== 'image') return false;
     if (isHome) return false;
     if (currentPageId) return banner.page_id === currentPageId;
     return false;
  });

  return (
    <div className="min-h-screen font-cairo bg-primary text-gray-900">
      <Header storeSettings={storeSettings} />
      {currentBanners.length > 0 && <BannerSlider banners={currentBanners} />}
      {isHome && <Hero />}
      {isHome && <MarketingCoreServices />}
      <main>{children}</main>
      <CollaborationForm />
      <Footer storeSettings={storeSettings} />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  store_name: 'POVA Agency',
  store_description: 'وكالة تسويق رقمي متكاملة لتصميم الهوية وإنتاج المحتوى والإعلانات',
  logo_url: 'https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png',
  meta_title: 'POVA | وكالة تسويق رقمي متكاملة',
  meta_description: 'نقدم حلول تسويقية مبتكرة لتنمية أعمالك',
  theme_settings: {
    primaryColor: '#ffffff',
    secondaryColor: '#f8f9fa',
    fontFamily: 'Cairo, sans-serif',
    backgroundColor: '#ffffff',
    backgroundGradient: ''
  }
} as StoreSettings;

function App() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Auto-dismiss splash screen after at most 800ms
    const splashTimer = setTimeout(() => {
      if (isMounted) setShowSplash(false);
    }, 800);

    async function initApp() {
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Fetch timeout')), 1500)
        );

        const fetchPromise = Promise.all([
          supabase.from('store_settings').select('*').limit(1).maybeSingle(),
          supabase.from('banners').select('*').order('created_at', { ascending: false }),
          supabase.from('pages').select('*').order('name')
        ]);

        const [settingsRes, bannersRes, pagesRes] = (await Promise.race([
          fetchPromise,
          timeoutPromise
        ])) as any;

        if (isMounted) {
          if (settingsRes?.data) {
            setStoreSettings(settingsRes.data);
          }
          if (bannersRes?.data) {
            setBanners(bannersRes.data);
          }
          if (pagesRes?.data) {
            setCategories(pagesRes.data);
          }
        }
      } catch (error) {
        console.warn("App initialized with fallback data:", error);
      }
    }
    
    initApp();
    return () => { 
      isMounted = false;
      clearTimeout(splashTimer);
    };
  }, []);

  useEffect(() => {
    if (storeSettings) {
      const theme = (storeSettings as any).theme_settings || {};
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primaryColor || '#ffffff');
      root.style.setProperty('--color-secondary', theme.secondaryColor || '#f8f9fa');
      root.style.setProperty('--color-accent', '#ec533a');
      root.style.setProperty('--font-family', theme.fontFamily || 'Cairo, sans-serif');
    }
  }, [storeSettings]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AnimatePresence>
          {showSplash && (
            <LoadingScreen 
              logoUrl={storeSettings?.logo_url || 'https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png'} 
              onFinish={() => setShowSplash(false)}
            />
          )}
        </AnimatePresence>
        <Helmet>
          <title>{storeSettings?.meta_title || 'POVA Agency'}</title>
          <meta name="description" content={storeSettings?.meta_description || 'وكالة تسويق رقمي'} />
        </Helmet>
        <StructuredData type="organization" data={storeSettings || undefined} services={[]} categories={categories} />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard onSettingsUpdate={() => window.location.reload()} /></PrivateRoute>} />
            
            <Route path="/page/:id" element={<Layout banners={banners} storeSettings={storeSettings}><PageDetails /></Layout>} />
            <Route path="/specialization/:id" element={<Layout banners={banners} storeSettings={storeSettings}><SpecializationDetails /></Layout>} />
            <Route path="/client/:id" element={<Layout banners={banners} storeSettings={storeSettings}><ClientDetails /></Layout>} />
            <Route path="/service/:slug" element={<Layout banners={banners} storeSettings={storeSettings}><ServiceDetails /></Layout>} />
            
            <Route path="/about" element={<Layout banners={banners} storeSettings={storeSettings}><AboutUs /></Layout>} />
            <Route path="/contact" element={<Layout banners={banners} storeSettings={storeSettings}><ContactUs /></Layout>} />
            <Route path="/download" element={<Layout banners={banners} storeSettings={storeSettings}><DownloadPage /></Layout>} />
            <Route path="/design-request" element={<Layout banners={banners} storeSettings={storeSettings}><DesignRequest /></Layout>} />
            
            <Route path="/" element={
              <Layout banners={banners} storeSettings={storeSettings}>
                <StaggeredHome />
              </Layout>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function StaggeredHome() {
  return (
    <>
      <Features />
      <WhySocialMarketing />
      <BrandDifferentiation />
      <VisualStorytellingReasons />
      <Stats />
      <VisionMission />
      <CompanyValues />
      <DigitalMarketingBenefits />
    </>
  );
}

export default App;
