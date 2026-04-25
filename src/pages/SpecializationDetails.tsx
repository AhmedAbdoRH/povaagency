import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layers, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Client, Page, Specialization } from '../types/database';
import ClientCard from '../components/ClientCard';
import { findCoreServiceByPageId } from '../data/coreServices';

export default function SpecializationDetails() {
  const { id } = useParams<{ id: string }>();
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchSpecDetails(id);
  }, [id]);

  const fetchSpecDetails = async (specializationId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: specData, error: specError } = await supabase
        .from('specializations')
        .select('*, service:services(*, page:pages(id, name))')
        .eq('id', specializationId)
        .single();

      if (specError) throw specError;
      setSpecialization(specData);

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('specialization_id', specializationId)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);
    } catch (err: any) {
      console.error('Error fetching specialization details:', err);
      setError(err.message || 'تعذر تحميل القسم.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a] pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ee5239]" />
      </div>
    );
  }

  if (error || !specialization) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#1a1a1a] pt-24 text-white">
        <div className="text-xl text-red-400">{error || 'القسم غير موجود'}</div>
        <Link to="/" className="rounded-lg bg-[#ee5239] px-6 py-2 text-white transition-colors hover:bg-[#d63d2a]">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const linkedPageId = specialization.service?.page?.id;
  const linkedCoreService = linkedPageId ? findCoreServiceByPageId(pages, linkedPageId) : null;
  const parentRoute = linkedCoreService ? `/service/${linkedCoreService.slug}` : linkedPageId ? `/page/${linkedPageId}` : '/';
  const parentLabel = linkedCoreService?.title || specialization.service?.page?.name || 'الخدمة';

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-16 pt-24 text-white font-[Cairo]">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="transition-colors hover:text-[#ee5239]">
            الرئيسية
          </Link>
          <span className="text-gray-600">/</span>
          <Link to={parentRoute} className="transition-colors hover:text-[#ee5239]">
            {parentLabel}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-medium text-white">{specialization.name}</span>
        </div>

        <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/5 bg-[#2a2a2a]/50 p-8 shadow-2xl backdrop-blur-md">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ee5239]/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-[#ee5239]">{specialization.name}</h1>
                {specialization.service?.name && (
                  <h2 className="text-xl font-medium text-gray-500">{specialization.service.name}</h2>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[#ee5239]/20 bg-[#ee5239]/10 px-4 py-2 text-sm font-bold text-[#ee5239]">
                <Layers size={16} />
                <span>{clients.length} عمل</span>
              </div>
            </div>

            {specialization.description && (
              <p className="max-w-3xl border-r-4 border-[#ee5239] pr-4 text-lg leading-relaxed text-gray-300">
                {specialization.description}
              </p>
            )}
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/5 bg-[#2a2a2a]/30 py-20 text-center">
            <Users className="mx-auto mb-6 h-20 w-20 text-gray-700" />
            <h3 className="mb-2 text-2xl font-bold text-gray-500">لا توجد أعمال</h3>
            <p className="text-lg text-gray-600">لم يتم إضافة أعمال داخل هذا القسم حتى الآن.</p>
          </div>
        ) : (
          <div>
            <h2 className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4 text-2xl font-bold">
              <span className="block h-8 w-2 rounded-full bg-[#ee5239]" />
              الأعمال داخل هذا القسم
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {clients.map(client => (
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
