import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Specialization, Client } from '../types/database';
import ClientCard from '../components/ClientCard';
import { ArrowRight, Users, Layers } from 'lucide-react';

export default function SpecializationDetails() {
  const { id } = useParams<{ id: string }>();
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchSpecDetails();
  }, [id]);

  const fetchSpecDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch Specialization
      const { data: specData, error: specError } = await supabase
        .from('specializations')
        .select('*, page:pages(id, name)')
        .eq('id', id)
        .single();

      if (specError) throw specError;
      setSpecialization(specData);

      // Fetch Clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('specialization_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#1a1a1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee5239]"></div>
      </div>
    );
  }

  if (error || !specialization) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 bg-[#1a1a1a] text-white">
        <div className="text-xl text-red-400">{error || 'التخصص غير موجود'}</div>
        <Link to="/" className="bg-[#ee5239] text-white px-6 py-2 rounded-lg hover:bg-[#d63d2a] transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#1a1a1a] text-white font-[Cairo]">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-[#ee5239] transition-colors">الرئيسية</Link>
          <span className="text-gray-600">/</span>
          <Link to={`/page/${specialization.page_id}`} className="hover:text-[#ee5239] transition-colors">{specialization.page?.name}</Link>
          <span className="text-gray-600">/</span>
          <span className="text-white font-medium">{specialization.name_ar}</span>
        </div>

        <div className="bg-[#2a2a2a]/50 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-2xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ee5239]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
             <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-[#ee5239]">{specialization.name_ar}</h1>
                  {specialization.name_en && <h2 className="text-xl text-gray-500 font-medium">{specialization.name_en}</h2>}
                </div>
                <div className="bg-[#ee5239]/10 text-[#ee5239] px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-[#ee5239]/20">
                   <Layers size={16} />
                   <span>{clients.length} عميل</span>
                </div>
             </div>
             
             {specialization.description_ar && (
               <p className="text-gray-300 text-lg max-w-3xl leading-relaxed border-r-4 border-[#ee5239] pr-4">{specialization.description_ar}</p>
             )}
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-20 bg-[#2a2a2a]/30 rounded-2xl border border-white/5 border-dashed">
            <Users className="w-20 h-20 mx-auto text-gray-700 mb-6" />
            <h3 className="text-2xl font-bold text-gray-500 mb-2">لا يوجد عملاء</h3>
            <p className="text-gray-600 text-lg">لم يتم إضافة أي عملاء لهذا التخصص حتى الآن.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
               <span className="w-2 h-8 bg-[#ee5239] rounded-full block"></span>
               عملاؤنا ومشاريعنا في هذا التخصص
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  id={client.id}
                  name={client.name}
                  description={client.description || ''}
                  logoUrl={client.logo_url || ''}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
