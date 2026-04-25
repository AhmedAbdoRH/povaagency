import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Layers } from 'lucide-react';
import type { Client, Page, Specialization } from '../types/database';
import type { CoreServiceDefinition } from '../data/coreServices';

export interface SpecializationWithClients extends Specialization {
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

export default function CoreServicePageView({
  coreService,
  page,
  sections,
}: CoreServicePageViewProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(sections[0]?.id || null);

  useEffect(() => {
    setSelectedSectionId(current =>
      sections.some(section => section.id === current) ? current : sections[0]?.id || null
    );
  }, [sections]);

  const selectedSection = useMemo(
    () => sections.find(section => section.id === selectedSectionId) || null,
    [sections, selectedSectionId]
  );

  const selectedClients = [...(selectedSection?.clients || [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

  const HeroIcon = coreService.icon;
  const heroImage = page?.banner_url || page?.image_url || null;
  const summary = page?.description || coreService.description;
  const hasLinkedPage = Boolean(page);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-accent">{coreService.title}</span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          {heroImage && (
            <div className="absolute inset-0">
              <img src={heroImage} alt={coreService.title} className="h-full w-full object-cover opacity-25" />
              <div className="absolute inset-0 bg-gradient-to-l from-black via-black/85 to-black/60" />
            </div>
          )}
          {!heroImage && (
            <div className={`absolute inset-0 bg-gradient-to-br ${coreService.bgGradient} opacity-100`} />
          )}

          <div className="relative z-10 grid gap-10 p-8 md:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 backdrop-blur-md">
                <HeroIcon className={`h-4 w-4 ${coreService.iconColor}`} />
                <span>الخدمة الرئيسية</span>
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-[1.3] md:text-5xl">
                {coreService.title}
              </h1>

              <p className="max-w-3xl text-lg leading-8 text-gray-200">
                {summary}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <div className="mb-2 text-sm text-gray-400">عدد الأقسام</div>
                <div className="text-3xl font-bold">{sections.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md">
                <div className="mb-2 text-sm text-gray-400">عدد الأعمال</div>
                <div className="text-3xl font-bold">
                  {sections.reduce((count, section) => count + (section.clients?.length || 0), 0)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-6 md:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">الأقسام والأعمال</h2>
              <p className="text-sm text-gray-400">
                الضغط على أي قسم يعرض الأعمال المرتبطة به مباشرة.
              </p>
            </div>
          </div>

          {!hasLinkedPage ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-gray-300">
              لم يتم ربط هذه الخدمة ببياناتها في قاعدة البيانات بعد. أضف محتواها من لوحة التحكم أو اربطها بصفحة مناسبة.
            </div>
          ) : sections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-gray-300">
              لا توجد أقسام مضافة لهذه الخدمة حتى الآن.
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap gap-3">
                {sections.map(section => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`rounded-2xl border px-5 py-3 text-right transition-all ${
                      selectedSectionId === section.id
                        ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                        : 'border-white/10 bg-white/[0.03] text-gray-200 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="font-bold">{section.name}</div>
                    <div className="mt-1 text-xs opacity-80">
                      {(section.clients?.length || 0).toString()} عمل
                    </div>
                  </button>
                ))}
              </div>

              {selectedSection && (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6">
                  <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedSection.name}</h3>
                      {selectedSection.description && (
                        <p className="mt-3 max-w-3xl leading-8 text-gray-300">
                          {selectedSection.description}
                        </p>
                      )}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-gray-300">
                      <Briefcase className="h-4 w-4 text-accent" />
                      <span>{selectedClients.length} عمل</span>
                    </div>
                  </div>

                  {selectedClients.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-gray-400">
                      لا توجد أعمال داخل هذا القسم حتى الآن.
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {selectedClients.map(client => (
                        <Link
                          key={client.id}
                          to={`/client/${client.id}`}
                          className="group rounded-[1.5rem] border border-white/10 bg-black/25 p-5 transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-black/35"
                        >
                          <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-white/[0.03]">
                            {client.logo_url || client.image_url ? (
                              <img
                                src={client.logo_url || client.image_url || ''}
                                alt={client.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 text-3xl font-bold text-accent">
                                {client.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-xl font-bold text-white">{client.name}</h4>
                            <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:-translate-x-1" />
                          </div>

                          {client.description && (
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-400">
                              {client.description}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
