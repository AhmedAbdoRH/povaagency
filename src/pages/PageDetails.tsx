import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page, Service, Specialization, Client } from '../types/database';
import { Layers } from 'lucide-react';

interface SpecializationWithClients extends Specialization {
  clients?: Client[];
}

interface ServiceWithSpecializations extends Service {
  specializations?: SpecializationWithClients[];
}

export default function PageDetails() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [services, setServices] = useState<ServiceWithSpecializations[]>([]);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [expandedSpecialization, setExpandedSpecialization] = useState<string | null>(null);
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

      // Fetch Services with Specializations and Clients
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*, specializations(*, clients(*))')
        .eq('page_id', id)
        .order('created_at', { ascending: true });

      if (servicesError) throw servicesError;
      setServices(servicesData || []);

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
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2">
            ← العودة للرئيسية
          </Link>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl">
          {/* Banner */}
          {page.banner_url ? (
            <div className="w-full h-64 md:h-96 relative">
              <img src={page.banner_url} alt={page.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            </div>
          ) : page.image_url ? (
            <div className="w-full h-64 md:h-96 relative">
              <img src={page.image_url} alt={page.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            </div>
          ) : null}

          <div className="p-8 md:p-12">
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{page.name}</h1>
              {page.description && (
                <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">{page.description}</p>
              )}
            </div>

          {services.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/30">
              <Layers className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">لا توجد خدمات مضافة في هذه الصفحة حالياً.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Services as rectangular buttons */}
              <div className="flex flex-wrap gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                    className={`px-8 py-5 rounded-2xl border-2 font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      expandedService === service.id
                        ? 'bg-accent border-accent text-white shadow-lg shadow-accent/30'
                        : 'bg-gray-800 border-gray-600 text-gray-200 hover:border-accent/50 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>

              {/* Divider line when service is expanded */}
              {expandedService && (
                <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-in fade-in duration-500" />
              )}

              {/* Specializations as sub-buttons when service is expanded */}
              {expandedService && (
                <div className="pl-8 space-y-6 animate-in slide-in-from-left-6 duration-500">
                  {(() => {
                    const service = services.find(s => s.id === expandedService);
                    if (!service) return null;

                    return service.specializations && service.specializations.length > 0 ? (
                      <>
                        <div className="flex flex-wrap gap-3">
                          {service.specializations.map((spec) => (
                            <button
                              key={spec.id}
                              onClick={(e) => { e.stopPropagation(); setExpandedSpecialization(expandedSpecialization === spec.id ? null : spec.id); }}
                              className={`px-6 py-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                                expandedSpecialization === spec.id
                                  ? 'bg-accent/90 border-accent text-white shadow-lg shadow-accent/20'
                                  : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:border-accent/40 hover:text-white hover:bg-gray-700/50'
                              }`}
                            >
                              {spec.name}
                            </button>
                          ))}
                        </div>

                        {/* Divider line when specialization is expanded */}
                        {expandedSpecialization && (
                          <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-in fade-in duration-500" />
                        )}

                        {/* Clients when specialization is expanded */}
                        {expandedSpecialization && (
                          <div className="pl-6 animate-in slide-in-from-left-6 duration-500">
                            {(() => {
                              const spec = service.specializations?.find(s => s.id === expandedSpecialization);
                              if (!spec) return null;

                              return (
                                <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-accent rounded-full" />
                                    <h4 className="text-xl font-bold text-accent">العملاء في {spec.name}</h4>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {spec.clients && spec.clients.length > 0 ? (
                                      spec.clients.map((client: Client) => (
                                        <Link
                                          key={client.id}
                                          to={`/client/${client.id}`}
                                          className="bg-gray-800/50 border-2 border-gray-700/50 hover:border-accent/50 rounded-2xl p-6 transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-accent/10"
                                        >
                                          {(client.logo_url || client.image_url) ? (
                                            <img src={client.logo_url || client.image_url || ''} alt={client.name} className="w-20 h-20 object-contain mx-auto mb-4" />
                                          ) : (
                                            <div className="w-20 h-20 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                              <span className="text-2xl font-bold text-accent">{client.name.charAt(0)}</span>
                                            </div>
                                          )}
                                          <h5 className="text-xl font-bold text-white group-hover:text-accent transition-colors text-center mb-2">{client.name}</h5>
                                          {client.description && (
                                            <p className="text-gray-400 text-sm line-clamp-2 text-center">{client.description}</p>
                                          )}
                                        </Link>
                                      ))
                                    ) : (
                                      <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/30">
                                        <Layers className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                                        <p className="text-gray-500">لا يوجد عملاء في هذا التخصص</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700/30">
                        <p className="text-gray-500">لا توجد تخصصات في هذه الخدمة</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
