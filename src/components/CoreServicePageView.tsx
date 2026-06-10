import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Client, Page } from '../types/database';
import type { CoreServiceDefinition } from '../data/coreServices';
import { useLanguage } from '../hooks/useLanguage';
import ClientCard from './ClientCard';

// Default translations fallback
const defaultTranslations: Record<string, string> = {
  'header.home': 'الرئيسية',
  'coreServicePage.mainService': 'الخدمة الرئيسية',
  'coreServicePage.all': 'الكل',
  'coreServicePage.noPageLinked': 'لا توجد صفحة مرتبطة بهذه الخدمة',
  'coreServicePage.noSections': 'لا توجد أقسام متاحة',
  'coreServicePage.noWorksInSection': 'لا توجد أعمال في هذا القسم',
};

export interface SpecializationWithClients {
  id: string;
  service_id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  clients?: Client[];
  service?: {
    id: string;
    name: string;
  } | null;
}

interface CoreServicePageViewProps {
  coreService: CoreServiceDefinition;
  page: Page | null;
  sections: SpecializationWithClients[];
}

type SectionLike = Pick<
  SpecializationWithClients,
  'id' | 'name' | 'name_en' | 'description' | 'description_en' | 'clients'
>;

const ALL_SECTION_ID = '__all__';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function CoreServicePageView({
  coreService,
  page,
  sections,
}: CoreServicePageViewProps) {
  const { language, t } = useLanguage();
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 2 ** 32));

  const sectionsWithAll = useMemo<SectionLike[]>(() => {
    if (sections.length === 0) return [];

    const uniqueClientsById = new Map<string, Client>();
    sections.forEach(section => {
      section.clients?.forEach(client => {
        if (!uniqueClientsById.has(client.id)) uniqueClientsById.set(client.id, client);
      });
    });

    const allSection: SectionLike = {
      id: ALL_SECTION_ID,
      name: t('coreServicePage.all') || defaultTranslations['coreServicePage.all'] || 'الكل',
      name_en: 'All',
      description: null,
      description_en: null,
      clients: Array.from(uniqueClientsById.values()),
    };

    return [allSection, ...sections];
  }, [sections, t]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sectionsWithAll.length > 0 ? ALL_SECTION_ID : null
  );

  useEffect(() => {
    setSelectedSectionId(current => {
      const isValid = sectionsWithAll.some(section => section.id === current);
      if (isValid) return current;
      return sectionsWithAll.length > 0 ? ALL_SECTION_ID : null;
    });
  }, [sectionsWithAll]);

  const selectedSection = useMemo(
    () => sectionsWithAll.find(section => section.id === selectedSectionId) || null,
    [sectionsWithAll, selectedSectionId]
  );

  const selectedClients = useMemo(() => {
    const clients = selectedSection?.clients || [];
    if (selectedSection?.id === ALL_SECTION_ID) {
      return shuffleWithSeed(clients, shuffleSeed);
    }
    return [...clients].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [selectedSection, shuffleSeed]);

  const HeroIcon = coreService.icon;
  const heroImage = page?.banner_url || page?.image_url || null;
  const summary = language === 'en' 
    ? (page?.description_en || page?.description || coreService.description)
    : (page?.description || coreService.description);
  const pageTitle = language === 'en'
    ? (page?.name_en || page?.name || coreService.title)
    : (page?.name || coreService.title);
  const hasLinkedPage = Boolean(page);

  return (
    <div className="min-h-screen bg-[#040810] pt-20 pb-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            {t('header.home')}
          </Link>
          <span>/</span>
          <span className="text-accent">{pageTitle}</span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#060b14] shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
          {heroImage && (
            <div className="absolute inset-0">
              <img src={heroImage} alt={coreService.title} className="h-full w-full object-cover opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-l from-black via-black/85 to-black/60" />
            </div>
          )}
          {!heroImage && (
            <div className={`absolute inset-0 bg-gradient-to-br ${coreService.bgGradient} opacity-60`} />
          )}

          <div className="relative z-10 p-8 md:p-10">
            <div className="mb-12">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0a1121]/80 px-4 py-2 text-sm text-gray-200 backdrop-blur-md">
                <HeroIcon className={`h-4 w-4 ${coreService.iconColor}`} />
                <span>{t('coreServicePage.mainService')}</span>
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-[1.3] md:text-5xl">
                {pageTitle}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-gray-200">
                {summary}
              </p>
            </div>

            <div className="border-t border-white/10 pt-10">
              {!hasLinkedPage ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a1121]/60 p-8 text-center text-gray-400">
                  {t('coreServicePage.noPageLinked')}
                </div>
              ) : sectionsWithAll.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a1121]/60 p-8 text-center text-gray-400">
                  {t('coreServicePage.noSections')}
                </div>
              ) : (
                <>
                  <div className="mb-8 flex flex-wrap gap-2">
                    {sectionsWithAll.map(section => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setSelectedSectionId(section.id)}
                        className={`rounded-xl border px-3 py-2 text-sm text-right transition-all backdrop-blur-md ${
                          selectedSectionId === section.id
                            ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                            : 'border-white/10 bg-[#060b14]/80 text-gray-200 hover:border-white/20 hover:bg-[#0a1121]'
                        }`}
                      >
                        <div className="font-bold">
                          {section.id === ALL_SECTION_ID
                            ? t('coreServicePage.all') || defaultTranslations['coreServicePage.all'] || 'الكل'
                            : language === 'en'
                              ? (section.name_en || section.name)
                              : section.name}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedSection && (
                    <>
                      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {selectedSection.id === ALL_SECTION_ID
                              ? t('coreServicePage.all') || defaultTranslations['coreServicePage.all'] || 'الكل'
                              : language === 'en'
                                ? (selectedSection.name_en || selectedSection.name)
                                : selectedSection.name}
                          </h3>
                          {selectedSection.description && (
                            <p className="mt-3 max-w-3xl leading-8 text-gray-300">
                              {language === 'en' ? (selectedSection.description_en || selectedSection.description) : selectedSection.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedClients.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0a1121]/60 p-8 text-center text-gray-400">
                          {t('coreServicePage.noWorksInSection')}
                        </div>
                      ) : (
                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-3">
                          {selectedClients.map(client => {
                            const videoContent = (client as any).content?.find((c: any) => c.content_type === 'video');
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
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
