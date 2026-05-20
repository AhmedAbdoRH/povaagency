import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import { resolveCoreServicesWithPages } from '../data/coreServices';

interface WishlistItem {
  id: string;
  service_id: string;
  user_id: string;
  services: {
    id: string;
    name: string;
    page_id: string;
    price?: number | null;
    image_url?: string | null;
  };
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchWishlist();
  }, []);

  const routeByPageId = useMemo(
    () =>
      new Map(
        resolveCoreServicesWithPages(pages)
          .filter(item => item.page)
          .map(item => [item.page!.id, `/service/${item.slug}`])
      ),
    [pages]
  );

  async function checkUserAndFetchWishlist() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const [wishlistResult, pagesResult] = await Promise.all([
        supabase
          .from('wishlist')
          .select(
            `
            *,
            services (
              id,
              name,
              page_id,
              price,
              image_url
            )
          `
          )
          .eq('user_id', session.user.id),
        supabase
          .from('pages')
          .select('*')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true }),
      ]);

      if (wishlistResult.error) throw wishlistResult.error;
      if (pagesResult.error) throw pagesResult.error;

      setWishlist(wishlistResult.data || []);
      setPages(pagesResult.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase.from('wishlist').delete().eq('id', itemId);
      if (error) throw error;

      setWishlist(current => current.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1426]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1426] pb-20 pt-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="rounded-full p-2 transition-colors hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">المفضلة</h1>
          </div>

          {wishlist.length === 0 ? (
            <div className="py-16 text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-gray-600" />
              <h2 className="mb-2 text-xl font-semibold text-white">المفضلة فارغة</h2>
              <p className="mb-6 text-gray-400">أضف خدماتك المفضلة هنا</p>
              <button
                onClick={() => navigate('/')}
                className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent/90"
              >
                استكشف الخدمات
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {wishlist.map(item => {
                const targetRoute = routeByPageId.get(item.services.page_id) || '/';

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#162341]"
                  >
                    <div className="relative aspect-[4/3] bg-[#203158]">
                      {item.services.image_url ? (
                        <img
                          src={item.services.image_url}
                          alt={item.services.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Heart className="h-8 w-8 text-gray-600" />
                        </div>
                      )}

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute left-4 top-4 rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                        {item.services.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-accent">
                          {item.services.price
                            ? `${item.services.price} ج.م`
                            : 'السعر عند الطلب'}
                        </div>

                        <button
                          onClick={() => navigate(targetRoute)}
                          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
