import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Mail, Phone, Calendar, LogOut, Edit } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Get user profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    setUser(profile || {
      id: session.user.id,
      full_name: session.user.user_metadata?.full_name || '',
      email: session.user.email || '',
      phone: profile?.phone || '',
      avatar_url: session.user.user_metadata?.avatar_url || '',
      created_at: session.user.created_at
    });

    setFormData({
      full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
      phone: profile?.phone || ''
    });

    setLoading(false);
  }

  const handleUpdate = async () => {
    if (!user) return;

    try {
      // Update profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name
        }
      });

      setUser({
        ...user,
        full_name: formData.full_name,
        phone: formData.phone
      });

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <p>يجب تسجيل الدخول أولاً</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-accent rounded-lg"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">الملف الشخصي</h1>

          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.full_name || 'مستخدم'}
                </h2>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">
                  عضو منذ: {new Date(user.created_at || '').toLocaleDateString('ar-SA')}
                </p>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Profile Form */}
            {editing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full p-3 rounded bg-black/20 border border-white/10 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded bg-black/20 border border-white/10 text-white focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">رقم الهاتف</p>
                      <p className="text-white">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">تاريخ الانضمام</p>
                    <p className="text-white">
                      {new Date(user.created_at || '').toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-400/10 py-3 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
