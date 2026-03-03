import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, LogOut, Menu, X } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
}

export default function UserLogin() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? {
        id: session.user.id,
        full_name: session.user.user_metadata?.full_name || '',
        email: session.user.email || '',
        avatar_url: session.user.user_metadata?.avatar_url || ''
      } : null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ? {
      id: session.user.id,
      full_name: session.user.user_metadata?.full_name || '',
      email: session.user.email || '',
      avatar_url: session.user.user_metadata?.avatar_url || ''
    } : null);
    setLoading(false);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
  };

  const handleRegister = () => {
    // يمكن إضافة صفحة تسجيل لاحقاً
    window.open('https://wa.me/message/IUSOLSYPTTE6G1?text=أريد إنشاء حساب جديد', '_blank');
  };

  if (loading) {
    return (
      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </button>

        {/* User Menu */}
        {showUserMenu && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-white">
                    {user.full_name || 'مستخدم'}
                  </div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/profile');
                }}
                className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                الملف الشخصي
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/orders');
                }}
                className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                طلباتي
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/wishlist');
                }}
                className="w-full text-right px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                المفضلة
              </button>
              <hr className="my-2 border-white/10" />
              <button
                onClick={handleLogout}
                className="w-full text-right px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg transition-colors flex items-center justify-end gap-2"
              >
                تسجيل الخروج
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors text-sm font-medium"
      >
        <User className="w-4 h-4" />
        تسجيل الدخول
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">تسجيل الدخول</h3>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
                className="p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {error && (
              <div className="bg-red-800/30 border border-red-700 text-red-300 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleRegister}
                className="text-accent hover:text-accent/80 text-sm"
              >
                ليس لديك حساب؟ تواصل معنا لإنشاء حساب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
