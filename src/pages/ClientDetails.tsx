import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Client } from '../types/database';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      supabase.from('clients').select('*, specialization:specializations(id, name_ar, page_id)').eq('id', id).single()
        .then(({ data, error }) => {
           if (!error) setClient(data);
           setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-white bg-[#1a1a1a] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ee5239]"></div></div>;
  if (!client) return <div className="min-h-screen pt-24 text-center text-white bg-[#1a1a1a] flex flex-col items-center justify-center gap-4"><h2 className="text-2xl font-bold">العميل غير موجود</h2><Link to="/" className="text-[#ee5239]">العودة للرئيسية</Link></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#1a1a1a] text-white font-[Cairo]">
       <div className="container mx-auto px-4">
          <div className="mb-8">
             <Link to={`/specialization/${client.specialization_id}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ee5239] transition-colors group">
                <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" /> العودة للتخصص
             </Link>
          </div>
          
          <div className="bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
             <div className="h-64 md:h-96 bg-black/40 relative flex items-center justify-center p-8">
                {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
                ) : (
                    <div className="text-gray-600 text-4xl font-bold opacity-20">{client.name}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] via-transparent to-transparent opacity-80"></div>
             </div>
             
             <div className="p-8 md:p-12 relative">
                <div className="absolute -top-10 right-8 md:right-12 bg-[#ee5239] text-white px-6 py-3 rounded-xl shadow-lg font-bold text-lg transform rotate-2">
                   {client.specialization?.name_ar}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 border-b border-white/10 pb-6">{client.name}</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold text-[#ee5239] mb-4 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-[#ee5239]"></span>
                         تفاصيل المشروع / العميل
                      </h3>
                      <div className="prose prose-invert prose-lg max-w-none">
                         <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">{client.description || 'لا يوجد وصف متاح لهذا العميل.'}</p>
                      </div>
                   </div>
                   
                   <div className="bg-black/20 rounded-xl p-6 border border-white/5 h-fit">
                      <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2">معلومات إضافية</h4>
                      <ul className="space-y-3">
                         <li className="flex items-center gap-3 text-gray-400 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>مشروع مكتمل</span>
                         </li>
                         <li className="flex items-center gap-3 text-gray-400 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>عميل موثوق</span>
                         </li>
                         <li className="flex items-center gap-3 text-gray-400 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>تاريخ الإضافة: {new Date(client.created_at).toLocaleDateString('ar-EG')}</span>
                         </li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
