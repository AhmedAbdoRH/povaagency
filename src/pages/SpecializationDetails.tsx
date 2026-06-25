import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Client, Page, Specialization } from '../types/database';
import ClientCard from '../components/ClientCard';
import { findCoreServiceByPageId } from '../data/coreServices';
import { useLanguage } from '../hooks/useLanguage';
import ContentProtection from '../components/ContentProtection';

export default function SpecializationDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
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
        .select('*, service:services(*, page:pages(id, name, name_en))')
        .eq('id', specializationId)
        .single();

      if (specError) throw specError;
      setSpecialization(specData);

      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*, content:client_content(*)')
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
      setError(err.message || t('specDetails.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#162341] pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ec533a]" />
      </div>
    );
  }

  if (error || !specialization) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#162341] pt-24 text-white">
        <div className="text-xl text-red-400">{error || t('specDetails.notFound')}</div>
        <Link to="/" className="rounded-lg bg-[#ec533a] px-6 py-2 text-white transition-colors hover:bg-[#d63d2a]">
          {t('header.home')}
        </Link>
      </div>
    );
  }

  const linkedPageId = specialization.service?.page?.id;
  const linkedCoreService = linkedPageId ? findCoreServiceByPageId(pages, linkedPageId) : null;
  const parentRoute = linkedCoreService ? `/service/${linkedCoreService.slug}` : linkedPageId ? `/page/${linkedPageId}` : '/';
  
  const parentLabel = language === 'en' 
    ? (linkedCoreService?.title || specialization.service?.page?.name_en || specialization.service?.page?.name || t('specDetails.defaultServiceLabel'))
    : (linkedCoreService?.title || specialization.service?.page?.name || t('specDetails.defaultServiceLabel'));

  const specName = language === 'en' ? (specialization.name_en || specialization.name) : specialization.name;
  const specDesc = language === 'en' ? (specialization.description_en || specialization.description) : specialization.description;

  return (
    <div className="min-h-screen bg-[#162341] pb-16 pt-24 text-white font-[Cairo]">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="transition-colors hover:text-[#ec533a]">
            {t('header.home')}
          </Link>
          <span className="text-gray-600">/</span>
          <Link to={parentRoute} className="transition-colors hover:text-[#ec533a]">
            {parentLabel}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-medium text-white">{specName}</span>
        </div>

        <div className="relative mb-12 overflow-hidden rounded-2xl border border-white/5 bg-[#203158]/50 p-8 shadow-2xl backdrop-blur-md">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ec533a]/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 text-4xl font-bold text-[#ec533a]">{specName}</h1>
                {specialization.service?.name && (
                  <h2 className="text-xl font-medium text-gray-500">
                    {language === 'en' ? (specialization.service.name_en || specialization.service.name) : specialization.service.name}
                  </h2>
                )}
              </div>


            </div>

            {specDesc && (
              <p className={`max-w-3xl ${language === 'ar' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-[#ec533a] text-lg leading-relaxed text-gray-300`}>
                {specDesc}
              </p>
            )}
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/5 bg-[#203158]/30 py-20 text-center">
            <Users className="mx-auto mb-6 h-20 w-20 text-gray-700" />
            <h3 className="mb-2 text-2xl font-bold text-gray-500">{t('specDetails.noWorksTitle')}</h3>
            <p className="text-lg text-gray-600">{t('specDetails.noWorksDesc')}</p>
          </div>
        ) : (
          <ContentProtection>
            <div>
              <h2 className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4 text-2xl font-bold">
                <span className="block h-8 w-2 rounded-full bg-[#ec533a]" />
                {t('specDetails.worksInSection')}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {clients.map(client => {
                  const videoContent = client.content?.find(c => c.content_type === 'video');
                  return (
                    <ClientCard
                      key={client.id}
                      id={client.id}
                      name={language === 'en' ? (client.name_en || client.name) : client.name}
                      description={language === 'en' ? (client.description_en || client.description || '') : (client.description || '')}
                      logoUrl={client.logo_url || ''}
                      imageUrl={client.image_url || ''}
                      videoUrl={videoContent?.video_url || ''}
                      isVerticalVideo={videoContent?.is_vertical_video}
                    />
                  );
                })}
              </div>
            </div>
          </ContentProtection>
        )}
      </div>
    </div>
  );
}
