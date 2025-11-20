import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Phone, MessageCircle } from 'lucide-react';
import type { StoreSettings } from '../types/database';

interface FooterProps {
  storeSettings?: StoreSettings | null;
}

export default function Footer({ storeSettings }: FooterProps) {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">POVA Agency</h2>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              شريكك الاستراتيجي للنمو الرقمي. نحول الأفكار إلى علامات تجارية استثنائية من خلال التصميم المبتكر والتسويق الذكي.
            </p>
            <div className="flex gap-4">
              <a
                href={storeSettings?.facebook_url || 'https://www.facebook.com/share/1a8u31mdPk/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors text-white"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={storeSettings?.instagram_url || 'https://www.instagram.com/povaagency?igsh=MXZwaWoxMHg3bW81aA=='}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 transition-colors text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={storeSettings?.tiktok_url || 'https://www.tiktok.com/@pova.agency'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:border hover:border-white/20 transition-colors text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-accent transition-colors">من نحن</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">اتصل بنا</Link>
              </li>
              <li>
                <Link to="/design-request" className="text-gray-400 hover:text-accent transition-colors">اطلب تصميم</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">تواصل معنا</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+201006464349" className="flex items-center gap-3 text-gray-400 hover:text-accent transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="dir-ltr">+20 100 646 4349</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/message/IUSOLSYPTTE6G1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-accent transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>واتساب</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} POVA Agency. جميع الحقوق محفوظة.
          </p>
          <Link to="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}