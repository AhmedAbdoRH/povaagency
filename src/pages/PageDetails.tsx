import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page, Specialization } from '../types/database';
import { Layers, ArrowRight } from 'lucide-react';

export default function PageDetails() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPageDetails();
  }, [id]);

  const fetchPageDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Page
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();

      if (pageError) throw pageError;
      setPage(pageData);

      // Fetch Specializations
      const { data: specsData, error: specsError } = await supabase
        .from('specializations')
        .select('*')
        .eq('page_id', id)
        .order('name_ar');

      if (specsError) throw specsError;
      setSpecializations(specsData || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 bg-primary text-white">
        <div className="text-xl text-red-400">{error || 'الصفحة غير موجودة'}</div>
        <Link to="/" className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/80 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2">
            <ArrowRight size={16} /> العودة للرئيسية
          </Link>
        </div>

        <div className="bg-secondary/30 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-2xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4 text-accent">{page.name}</h1>
            {page.description && (
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">{page.description}</p>
            )}
          </div>

          {specializations.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5">
              <Layers className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">لا توجد تخصصات مضافة في هذه الصفحة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializations.map((spec) => (
                <Link
                  key={spec.id}
                  to={`/specialization/${spec.id}`}
                  className="group block bg-secondary/50 hover:bg-secondary border border-white/5 hover:border-accent/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{spec.name_ar}</h3>
                    <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                  {spec.description_ar && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{spec.description_ar}</p>
                  )}
                  <span className="text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 block">
                    استعراض العملاء والمشاريع &larr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
