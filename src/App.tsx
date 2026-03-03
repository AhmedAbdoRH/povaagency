import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import BannerStrip from './components/BannerStrip';
import Services from './components/Services';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import WhatsAppButton from './components/WhatsAppButton';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PageDetails from './pages/PageDetails';
import SpecializationDetails from './pages/SpecializationDetails';
import ClientDetails from './pages/ClientDetails';
import ServiceDetails from './pages/ServiceDetails';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import DownloadPage from './pages/DownloadPage';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import StructuredData from './components/StructuredData';
import Hero from './components/Hero';
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

// PrivateRoute component
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

function App() {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function initApp() {
      await fetchStoreSettings();

      const { data: bannersData } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
      // Fetch pages instead of categories for structured data if needed
      const { data: pagesData } = await supabase.from('pages').select('*').order('name');

      if (isMounted) {
        setBanners(bannersData || []);
        setCategories(pagesData || []);
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

  const fetchStoreSettings = async () => {
    try {
      const { data } = await supabase.from('store_settings').select('*').limit(1).maybeSingle();

      if (data) {
        setStoreSettings(data);
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
    } catch (error) {
      console.error("Error fetching settings", error);
    }
  };

  interface LayoutProps {
    children: React.ReactNode;
    banners: Banner[];
  }

  const Layout = ({ children, banners: layoutBanners }: LayoutProps) => {
    const location = useLocation();
    
    // Determine banners for current page
    const isHome = location.pathname === '/';
    
    // Extract page ID from path /page/:id
    const pageMatch = location.pathname.match(/^\/page\/([a-zA-Z0-9-]+)$/);
    const currentPageId = pageMatch ? pageMatch[1] : null;

    const currentBanners = layoutBanners.filter(banner => {
       if (!banner.is_active || banner.type !== 'image') return false;
       if (isHome) return false; // No banners on home page
       if (currentPageId) return banner.page_id === currentPageId; // Specific page banners
       return false;
    });

    const stripBanners = layoutBanners.filter(banner => banner.type === 'strip' && banner.is_active);

    return (
      <div className="min-h-screen font-cairo bg-primary text-white">
        <Header storeSettings={storeSettings} />
        {currentBanners.length > 0 && <BannerSlider banners={currentBanners} />}
        {/* BannerStrip removed from Home as per request */}
        
        {isHome && <Hero />}
        {isHome && <MarketingCoreServices />}
        <main>{children}</main>
        {/* {isHome && <Testimonials />} */}
        <Footer storeSettings={storeSettings} />
        <WhatsAppButton />
      </div>
    );
  };

  return (
    <ThemeProvider>
      <CartProvider>
        <Helmet>
          <title>{storeSettings?.meta_title || 'POVA Agency'}</title>
          <meta name="description" content={storeSettings?.meta_description || 'وكالة تسويق رقمي'} />
        </Helmet>
        <StructuredData type="organization" data={storeSettings || undefined} services={services} categories={categories} />
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard onSettingsUpdate={fetchStoreSettings} /></PrivateRoute>} />
            
            {/* New Routes */}
            <Route path="/page/:id" element={<Layout banners={banners}><PageDetails /></Layout>} />
            <Route path="/specialization/:id" element={<Layout banners={banners}><SpecializationDetails /></Layout>} />
            <Route path="/client/:id" element={<Layout banners={banners}><ClientDetails /></Layout>} />
            <Route path="/service/:slug" element={<Layout banners={banners}><ServiceDetails /></Layout>} />
            
            {/* Standard Pages */}
            <Route path="/about" element={<Layout banners={banners}><AboutUs /></Layout>} />
            <Route path="/contact" element={<Layout banners={banners}><ContactUs /></Layout>} />
            <Route path="/download" element={<Layout banners={banners}><DownloadPage /></Layout>} />
            <Route path="/design-request" element={<Layout banners={banners}><DesignRequest /></Layout>} />
            <Route path="/profile" element={<Layout banners={banners}><Profile /></Layout>} />
            <Route path="/orders" element={<Layout banners={banners}><Orders /></Layout>} />
            <Route path="/wishlist" element={<Layout banners={banners}><Wishlist /></Layout>} />
            
            <Route path="/" element={
              <Layout banners={banners}>
                <StaggeredHome />
              </Layout>
            } />
            
            {/* Catch all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
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
      <Services />
    </>
  );
}

export default App;
