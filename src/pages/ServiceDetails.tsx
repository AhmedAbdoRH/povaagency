import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import type { Page, Client } from '../types/database';
import {
  findCoreServiceBySlug,
  resolveCoreServicesWithPages,
  type CoreServiceDefinition,
} from '../data/coreServices';
import CoreServicePageView, {
  type SpecializationWithClients,
} from '../components/CoreServicePageView';

export default function ServiceDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [coreService, setCoreService] = useState<CoreServiceDefinition | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<SpecializationWithClients[]>([]);
  const [directClients, setDirectClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('الخدمة المطلوبة غير موجودة.');
      setIsLoading(false);
      return;
    }

    const selectedCoreService = findCoreServiceBySlug(slug);
    if (!selectedCoreService) {
      setError('الخدمة المطلوبة غير موجودة.');
      setIsLoading(false);
      return;
    }

    setCoreService(selectedCoreService);
    fetchCoreServiceData(selectedCoreService);
  }, [slug]);

  const fetchCoreServiceData = async (selectedCoreService: CoreServiceDefinition) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (pagesError) throw pagesError;

      const linkedCoreService = resolveCoreServicesWithPages(pagesData || []).find(
        item => item.slug === selectedCoreService.slug
      );
      const resolvedPage = linkedCoreService?.page || null;

      setPage(resolvedPage);

      if (!resolvedPage) {
        setSections([]);
        return;
      }

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, page_id, display_order, is_active')
        .eq('page_id', resolvedPage.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (servicesError) throw servicesError;

      const serviceIds = (servicesData || []).map(service => service.id);
      if (serviceIds.length === 0) {
        setSections([]);
        return;
      }

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('specializations')
        .select('*, clients(*, client_content(*))')
        .in('service_id', serviceIds)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (sectionsError) throw sectionsError;

      const serviceNameById = new Map((servicesData || []).map(service => [service.id, service.name]));
      const normalizedSections = (sectionsData || []).map(section => ({
        ...section,
        service: section.service_id
          ? { id: section.service_id, name: serviceNameById.get(section.service_id) || '' }
          : null,
        clients: [...(section.clients || [])].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
        ),
      }));

      setSections(normalizedSections);
      // For marketing-strategy, if no sections, fetch direct clients
      if (selectedCoreService?.slug === 'marketing-strategy' && normalizedSections.length === 0 && resolvedPage) {
        await fetchDirectClients(resolvedPage.id);
      }
    } catch (err: any) {
      console.error('Error loading core service page:', err);
      setError(err.message || 'تعذر تحميل بيانات الخدمة.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDirectClients = async (pageId: string) => {
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id')
        .eq('page_id', pageId)
        .eq('is_active', true);
      if (servicesError) throw servicesError;
      const serviceIds = servicesData.map(s => s.id);
      if (serviceIds.length === 0) {
        setDirectClients([]);
        return;
      }
      const { data: specsData, error: specsError } = await supabase
        .from('specializations')
        .select('id')
        .in('service_id', serviceIds)
        .eq('is_active', true);
      if (specsError) throw specsError;
      const specIds = specsData.map(s => s.id);
      if (specIds.length === 0) {
        setDirectClients([]);
        return;
      }
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*, client_content(*)')
        .in('specialization_id', specIds)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (clientsError) throw clientsError;
      setDirectClients(clientsData || []);
    } catch (err) {
      console.error('Error fetching direct clients:', err);
      setDirectClients([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1426] pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !coreService) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c1426] px-4 pt-24 text-center text-white">
        <div className="text-2xl font-bold">{error || 'الخدمة المطلوبة غير موجودة.'}</div>
      </div>
    );
  }

  const metaDescription = page?.description || coreService.description;
  const metaImage = page?.banner_url || page?.image_url || '/logo.png';

  return (
    <>
      <Helmet>
        <title>{`${coreService.title} | POVA Agency`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={coreService.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={coreService.title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
      </Helmet>

      <CoreServicePageView coreService={coreService} page={page} sections={sections} />
    </>
  );
}
