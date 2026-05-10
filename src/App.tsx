import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
    <div className="min-h-screen font-cairo bg-primary text-white">
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

function App() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function initApp() {
      try {
        // Fetch all essential data in parallel for speed and stability
        const [settingsRes, bannersRes, pagesRes] = await Promise.all([
          supabase.from('store_settings').select('*').limit(1).maybeSingle(),
          supabase.from('banners').select('*').order('created_at', { ascending: false }),
          supabase.from('pages').select('*').order('name')
        ]);

        if (isMounted) {
          // Handle Store Settings
          if (settingsRes.data) {
            setStoreSettings(settingsRes.data);
          } else {
            setStoreSettings({
              id: '00000000-0000-0000-0000-000000000001',
              store_name: 'POVA Agency',
              store_description: 'وكالة تسويق رقمي متكاملة',
              logo_url: '/agency-logo.png',
              meta_title: 'POVA | وكالة تسويق رقمي',
              meta_description: 'نقدم حلول تسويقية مبتكرة لتنمية أعمالك',
              theme_settings: {
                primaryColor: '#000000',
                secondaryColor: '#1a1a1a',
                fontFamily: 'Cairo, sans-serif',
                backgroundColor: '#000000',
                backgroundGradient: ''
              }
            } as StoreSettings);
          }

          // Handle other data
          setBanners(bannersRes.data || []);
          setCategories(pagesRes.data || []);
          
          // Signal that the app is ready
          setIsAppLoading(false);
        }
      } catch (error) {
        console.error("Critical error during app initialization:", error);
        if (isMounted) setIsAppLoading(false);
      }
    }
    
    initApp();
    return () => { isMounted = false; };
  }, []);


  useEffect(() => {
    if (storeSettings) {
      const theme = (storeSettings as any).theme_settings || {};
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primaryColor || '#000000');
      root.style.setProperty('--color-secondary', theme.secondaryColor || '#1a1a1a');
      root.style.setProperty('--color-accent', '#ee5239');
      root.style.setProperty('--font-family', theme.fontFamily || 'Cairo, sans-serif');
    }
  }, [storeSettings]);


  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center gap-6" dir="rtl">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-accent/10 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-white/60 font-bold tracking-widest animate-pulse">جاري التحميل...</p>
      </div>
    );
  }
  return (
    <ThemeProvider>
      <LanguageProvider>
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
