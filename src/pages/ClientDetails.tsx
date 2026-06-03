import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Client, ClientContent } from '../types/database';
import { ArrowRight, ExternalLink, Play, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { getEmbedUrl, isEmbeddable } from '../utils/videoUtils';
import { useVideoAspectRatio } from '../hooks/useVideoAspectRatio';
import VideoItem from '../components/VideoItem';

interface ClientWithPartialSpec extends Omit<Client, 'specialization'> {
  specialization?: {
    id: string;
    name: string;
    name_en: string | null;
    service_id: string;
  } | null;
}

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [client, setClient] = useState<ClientWithPartialSpec | null>(null);
  const [contents, setContents] = useState<ClientContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        supabase.from('clients').select('id, name, name_en, description, description_en, image_url, logo_url, project_url, specialization_id, is_active, display_order, created_at, updated_at, specializations(id, name, name_en, service_id)').eq('id', id).single(),
        supabase.from('client_content').select('*').eq('client_id', id).order('created_at', { ascending: true })
      ]).then(([clientRes, contentRes]) => {
         if (!clientRes.error && clientRes.data) {
           const { specializations, ...clientData } = clientRes.data;
           const clientWithSpec = {
             ...clientData,
             specialization: specializations?.[0] || null
           };
           setClient(clientWithSpec);
         }
         if (!contentRes.error && contentRes.data) {
           setContents(contentRes.data);
         }
         setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-white bg-[#162341] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ec533a]"></div></div>;
  if (!client) return <div className="min-h-screen pt-24 text-center text-white bg-[#162341] flex flex-col items-center justify-center gap-4"><h2 className="text-2xl font-bold">{t('clientDetails.notFound')}</h2><Link to="/" className="text-[#ec533a]">{t('clientDetails.backToHome')}</Link></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#162341] text-white font-[Cairo]">
       <div className="container mx-auto px-4 max-w-6xl">
          {/* Header & Client Info Section */}
          <div className="mb-8">
             <Link to={`/specialization/${client.specialization_id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ec533a] transition-colors group mb-6">
                <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('clientDetails.backToSpecialization')}
             </Link>
             
             <div className="bg-[#203158] rounded-2xl p-6 md:p-8 shadow-2xl border border-white/5 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ec533a]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Client Logo - Small & on the side */}
                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-[#162341] rounded-2xl border border-white/10 flex items-center justify-center p-3 shadow-lg relative z-10">
                   {(client.logo_url || client.image_url) ? (
                       <img src={client.logo_url || client.image_url!} alt={client.name} className="w-full h-full object-contain" />
                   ) : (
                       <div className="text-gray-500 text-xl font-bold">{client.name.substring(0, 2)}</div>
                   )}
                </div>

                {/* Client Details */}
                <div className="flex-1 relative z-10">
                   <div className="flex flex-wrap items-center gap-3 mb-3">
                     <h1 className="text-3xl md:text-4xl font-black text-white">
                        {language === 'en' ? (client.name_en || client.name) : client.name}
                     </h1>
                     <span className="bg-[#ec533a]/10 text-[#ec533a] border border-[#ec533a]/20 px-3 py-1 rounded-full text-sm font-bold">
                        {language === 'en' ? (client.specialization?.name_en || client.specialization?.name) : client.specialization?.name}
                     </span>
                   </div>
                   
                   {(language === 'en' ? (client.description_en || client.description) : client.description) && (
                     <p className="text-gray-400 leading-relaxed max-w-3xl text-sm md:text-base whitespace-pre-line mb-6">
                       {language === 'en' ? (client.description_en || client.description) : client.description}
                     </p>
                   )}

                    {client.project_url && (
                      <div className="flex items-center gap-4 border-t border-white/10 pt-4 flex-wrap">
                         <a href={client.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#ec533a] hover:text-[#ff6b54] text-sm font-bold transition-colors">
                            <ExternalLink size={16} />
                            {t('clientDetails.viewLiveProject')}
                         </a>
                      </div>
                    )}
                </div>
             </div>
          </div>

          {/* Portfolio / Content Gallery */}
          {contents.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-[#ec533a] rounded-full inline-block"></span>
                {t('clientDetails.viewWorks')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {contents.map((item) => (
                  <div key={item.id} className="bg-[#203158] rounded-2xl overflow-hidden border border-white/5 group relative shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    {item.content_type === 'video' ? (
                      <VideoItem 
                        videoUrl={item.video_url || ''} 
                        title={item.title} 
                        poster={item.image_url || undefined} 
                        isVerticalVideo={item.is_vertical_video}
                      />
                    ) : (
                      <div className="aspect-square md:aspect-[4/3] relative overflow-hidden bg-black/40">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1426] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="p-5 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0c1426] via-[#162341]/80 to-transparent pt-12 pointer-events-none">
                      <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">
                        {language === 'en' ? (item.title_en || item.title) : item.title}
                      </h4>
                      {(item.description || item.description_en) && (
                        <p className="text-gray-300 text-sm line-clamp-2 drop-shadow-md">
                          {language === 'en' ? (item.description_en || item.description) : item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#203158] rounded-2xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t('clientDetails.addingWorksTitle')}</h3>
              <p className="text-gray-400">{t('clientDetails.addingWorksDesc')}</p>
            </div>
          )}
       </div>
    </div>
  );
}

