import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Snail as Snapchat, Youtube, Phone, MessageCircle } from 'lucide-react';
import type { StoreSettings } from '../types/database';

interface FooterProps {
  storeSettings?: StoreSettings | null;
}

export default function Footer({ storeSettings }: FooterProps) {
  const socialLinks = [
    { url: storeSettings?.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: storeSettings?.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: storeSettings?.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: storeSettings?.snapchat_url, icon: Snapchat, label: 'Snapchat' },
    { url: storeSettings?.tiktok_url, icon: Youtube, label: 'TikTok' },
  ].filter(link => link.url);

  return (
    <footer className="bg-secondary/5 backdrop-blur-md border-t border-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          {/* Social Media Section */}
          <div className="w-full flex flex-col items-center gap-4 mb-6">
            <h3 className="text-white text-xl font-bold mb-4">تابعنا على السوشيال ميديا</h3>
            <div className="flex gap-6 items-center justify-center flex-wrap">
              {/* Facebook Icon */}
              <a
                href={storeSettings?.facebook_url || 'https://www.facebook.com/share/1a8u31mdPk/'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50"
                title="Facebook"
              >
                <Facebook className="h-7 w-7 text-white" />
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* Instagram Icon */}
              <a
                href={storeSettings?.instagram_url || 'https://www.instagram.com/povaagency?igsh=MXZwaWoxMHg3bW81aA=='}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50"
                title="Instagram"
              >
                <Instagram className="h-7 w-7 text-white" />
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              {/* TikTok Icon */}
              <a
                href={storeSettings?.tiktok_url || 'https://www.tiktok.com/@pova.agency'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-black via-gray-800 to-gray-900 hover:from-gray-900 hover:via-black hover:to-gray-800 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-gray-500/50"
                title="TikTok"
              >
                <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>

          {/* Old Social Links (keeping for backward compatibility) */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mb-4 opacity-0 h-0 overflow-hidden">
              {socialLinks.map((link, index) => (
                link.url && (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary/80 hover:text-accent transition-colors duration-300"
                    title={link.label}
                  >
                    <link.icon className="h-6 w-6" />
                  </a>
                )
              ))}
            </div>
          )}

          {/* Branches and Contact Info */}
          <div className="w-full max-w-4xl">

            {/* Contact Numbers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href="tel:+201006464349"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">اتصل بنا الان</span>
              </a>
              
              <a
                href="https://wa.me/message/IUSOLSYPTTE6G1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 px-4 py-2 rounded-lg border border-green-500/30 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="text-white text-sm font-medium">تواصل معنا عبر واتساب</span>
              </a>
            </div>
          </div>

          
          <div className="flex gap-6">
            <Link
              to="/about"
              className="text-white/70 hover:text-accent transition-colors duration-300 text-sm font-medium"
            >
              من نحن
            </Link>
          </div>
          <div className="mt-2">
            <Link
                to="/admin/login"
                className="text-white/0 hover:text-accent transition-colors duration-300 text-xs font-medium"
              >
                لوحة التحكم
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}