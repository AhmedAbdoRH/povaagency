import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';

interface WishlistItem {
  id: string;
  service_id: string;
  user_id: string;
  services: {
    id: string;
    title: string;
    price: number;
    image_url: string;
  };
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchWishlist();
  }, []);

  async function checkUserAndFetchWishlist() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          *,
          services (
            id,
            title,
            price,
            image_url
          )
        `)
        .eq('user_id', session.user.id);

      if (error) throw error;
      setWishlist(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setWishlist(wishlist.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">المفضلة</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">المفضلة فارغة</h2>
              <p className="text-gray-400 mb-6">أضف خدماتك المفضلة هنا</p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors"
              >
                استكشف الخدمات
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden group">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-[#2a2a2a]">
                    {item.services.image_url ? (
                      <img 
                        src={item.services.image_url} 
                        alt={item.services.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {item.services.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-accent">
                        {item.services.price ? `${item.services.price} ج.م` : 'السعر عند الطلب'}
                      </div>
                      
                      <button
                        onClick={() => navigate(`/service/${item.services.id}`)}
                        className="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
