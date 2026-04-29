import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page } from '../types/database';
import {
  coreServices,
  findCoreServiceByPageId,
} from '../data/coreServices';
import CoreServicePageView, {
  type SpecializationWithClients,
} from '../components/CoreServicePageView';

export default function PageDetails() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<SpecializationWithClients[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPageDetails(id);
  }, [id]);

  const fetchPageDetails = async (pageId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: allPagesData, error: allPagesError } = await supabase
        .from('pages')
        .select('id, name, name_en, description, description_en, image_url, banner_url, is_active, display_order, created_at, updated_at')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (allPagesError) throw allPagesError;
      setPages(allPagesData || []);

      const selectedPage = (allPagesData || []).find(item => item.id === pageId) || null;
      if (!selectedPage) {
        throw new Error('الصفحة المطلوبة غير موجودة.');
      }

      setPage(selectedPage);

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, name_en, page_id, display_order, is_active')
        .eq('page_id', pageId)
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
        .select('id, name, name_en, description, description_en, image_url, service_id, is_active, display_order, created_at, updated_at, clients(id, name, name_en, description, description_en, image_url, logo_url, project_url, specialization_id, is_active, display_order, created_at, updated_at)')
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
    } catch (err: any) {
      console.error('Error fetching page details:', err);
      setError(err.message || 'تعذر تحميل الصفحة.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center px-4 text-center text-white">
        <div className="text-2xl font-bold">{error || 'الصفحة المطلوبة غير موجودة.'}</div>
      </div>
    );
  }

  const linkedCoreService =
    findCoreServiceByPageId(pages, page.id) || {
      ...coreServices[0],
      title: page.name,
      description: page.description || coreServices[0].description,
    };

  return <CoreServicePageView coreService={linkedCoreService} page={page} sections={sections} />;
}
