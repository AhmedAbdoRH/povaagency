import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page, Service, Specialization, Client, ClientContent } from '../types/database';
import { Trash2, Edit } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const [pages, setPages] = useState<Page[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientContent, setClientContent] = useState<ClientContent[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingSpecialization, setEditingSpecialization] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingClientContent, setEditingClientContent] = useState<string | null>(null);

  const [showPageForm, setShowPageForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showSpecializationForm, setShowSpecializationForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showClientContentForm, setShowClientContentForm] = useState(false);

  const [newPage, setNewPage] = useState({ name: '', description: '', image_url: '', banner_url: '' });
  const [newService, setNewService] = useState({ page_id: '', name: '', description: '', image_url: '' });
  const [newSpecialization, setNewSpecialization] = useState({ service_id: '', name: '', description: '', image_url: '' });
  const [newClient, setNewClient] = useState({ specialization_id: '', name: '', description: '', image_url: '', project_url: '', logo_url: '' });
  const [newClientContent, setNewClientContent] = useState({ client_id: '', title: '', description: '', image_url: '', video_url: '', content_type: 'image' as 'image' | 'video' | 'text' });

  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pagesData, servicesData, specializationsData, clientsData, clientContentData] = await Promise.all([
        supabase.from('pages').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*, page:pages(name)').order('created_at', { ascending: false }),
        supabase.from('specializations').select('*, service:services(name)').order('created_at', { ascending: false }),
        supabase.from('clients').select('*, specialization:specializations(name)').order('created_at', { ascending: false }),
        supabase.from('client_content').select('*, client:clients(name)').order('created_at', { ascending: false }),
      ]);

      console.log('Fetched data:', { pagesData, servicesData, specializationsData, clientsData, clientContentData });

      if (pagesData.error) console.error('Pages error:', pagesData.error);
      if (servicesData.error) console.error('Services error:', servicesData.error);
      if (specializationsData.error) console.error('Specializations error:', specializationsData.error);
      if (clientsData.error) console.error('Clients error:', clientsData.error);
      if (clientContentData.error) console.error('Client content error:', clientContentData.error);

      setPages(pagesData.data || []);
      setServices(servicesData.data || []);
      setSpecializations(specializationsData.data || []);
      setClients(clientsData.data || []);
      setClientContent(clientContentData.data || []);
    } catch (err: any) {
      console.error('Fetch error:', err);
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin/login');
      else fetchData();
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!selectedPage || editingService) return;
    setNewService(prev => ({ ...prev, page_id: selectedPage }));
  }, [selectedPage, editingService]);

  useEffect(() => {
    if (!selectedService || editingSpecialization) return;
    setNewSpecialization(prev => ({ ...prev, service_id: selectedService }));
  }, [selectedService, editingSpecialization]);

  useEffect(() => {
    if (!selectedSpecialization || editingClient) return;
    setNewClient(prev => ({ ...prev, specialization_id: selectedSpecialization }));
  }, [selectedSpecialization, editingClient]);

  useEffect(() => {
    if (!selectedClient || editingClientContent) return;
    setNewClientContent(prev => ({ ...prev, client_id: selectedClient }));
  }, [selectedClient, editingClientContent]);

  const handleImageUpload = async (file: File, type: 'page' | 'page-image' | 'page-banner' | 'service' | 'specialization' | 'client' | 'client-content') => {
    setUploading(true);
    try {
      // Generate random filename with extension only
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('services')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(fileName);

      if (type === 'page' || type === 'page-image') setNewPage(prev => ({ ...prev, image_url: publicUrl }));
      if (type === 'page-banner') setNewPage(prev => ({ ...prev, banner_url: publicUrl }));
      if (type === 'service') setNewService(prev => ({ ...prev, image_url: publicUrl }));
      if (type === 'specialization') setNewSpecialization(prev => ({ ...prev, image_url: publicUrl }));
      if (type === 'client') setNewClient(prev => ({ ...prev, image_url: publicUrl }));
      if (type === 'client-content') setNewClientContent(prev => ({ ...prev, image_url: publicUrl }));

      toast.success('تم رفع الصورة بنجاح!');
    } catch (err: any) {
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (type: 'page' | 'service' | 'specialization' | 'client' | 'client-content', e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('يجب تسجيل الدخول أولاً');
        navigate('/admin/login');
        return;
      }

      console.log('Adding', type, 'with data:', 
        type === 'page' ? newPage :
        type === 'service' ? newService :
        type === 'specialization' ? newSpecialization :
        type === 'client' ? newClient : newClientContent
      );

      let data;
      if (type === 'page') {
        data = await supabase.from('pages').insert([newPage]).select();
      } else if (type === 'service') {
        const payload = {
          ...newService,
          page_id: newService.page_id || selectedPage || null,
        };
        data = await supabase.from('services').insert([payload]).select();
      } else if (type === 'specialization') {
        const payload = {
          ...newSpecialization,
          service_id: newSpecialization.service_id || selectedService || null,
        };
        data = await supabase.from('specializations').insert([payload]).select();
      } else if (type === 'client') {
        const payload = {
          ...newClient,
          specialization_id: newClient.specialization_id || selectedSpecialization || null,
        };
        data = await supabase.from('clients').insert([payload]).select();
      } else if (type === 'client-content') {
        const payload = {
          ...newClientContent,
          client_id: newClientContent.client_id || selectedClient || null,
        };
        data = await supabase.from('client_content').insert([payload]).select();
      }

      console.log('Insert result:', data);

      if (data?.error) {
        console.error('Insert error:', data.error);
        throw data.error;
      }

      if (type === 'page') setNewPage({ name: '', description: '', image_url: '', banner_url: '' });
      if (type === 'service') setNewService({ page_id: '', name: '', description: '', image_url: '' });
      if (type === 'specialization') setNewSpecialization({ service_id: '', name: '', description: '', image_url: '' });
      if (type === 'client') setNewClient({ specialization_id: '', name: '', description: '', image_url: '', project_url: '', logo_url: '' });
      if (type === 'client-content') setNewClientContent({ client_id: '', title: '', description: '', image_url: '', video_url: '', content_type: 'image' });

      await fetchData();
      toast.success('تمت الإضافة بنجاح!');
    } catch (err: any) {
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (type: 'page' | 'service' | 'specialization' | 'client' | 'client-content', id: string, e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let data;
      if (type === 'page') data = await supabase.from('pages').update(newPage).eq('id', id);
      else if (type === 'service') data = await supabase.from('services').update(newService).eq('id', id);
      else if (type === 'specialization') data = await supabase.from('specializations').update(newSpecialization).eq('id', id);
      else if (type === 'client') data = await supabase.from('clients').update(newClient).eq('id', id);
      else if (type === 'client-content') data = await supabase.from('client_content').update(newClientContent).eq('id', id);

      if (data?.error) throw data.error;

      if (type === 'page') { setEditingPage(null); setNewPage({ name: '', description: '', image_url: '', banner_url: '' }); }
      if (type === 'service') { setEditingService(null); setNewService({ page_id: '', name: '', description: '', image_url: '' }); }
      if (type === 'specialization') { setEditingSpecialization(null); setNewSpecialization({ service_id: '', name: '', description: '', image_url: '' }); }
      if (type === 'client') { setEditingClient(null); setNewClient({ specialization_id: '', name: '', description: '', image_url: '', project_url: '', logo_url: '' }); }
      if (type === 'client-content') { setEditingClientContent(null); setNewClientContent({ client_id: '', title: '', description: '', image_url: '', video_url: '', content_type: 'image' }); }

      await fetchData();
      toast.success('تم التحديث بنجاح!');
    } catch (err: any) {
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (type: 'page' | 'service' | 'specialization' | 'client' | 'client-content', id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setIsLoading(true);
    try {
      let data;
      if (type === 'page') data = await supabase.from('pages').delete().eq('id', id);
      else if (type === 'service') data = await supabase.from('services').delete().eq('id', id);
      else if (type === 'specialization') data = await supabase.from('specializations').delete().eq('id', id);
      else if (type === 'client') data = await supabase.from('clients').delete().eq('id', id);
      else if (type === 'client-content') data = await supabase.from('client_content').delete().eq('id', id);

      if (data?.error) throw data.error;
      await fetchData();
      toast.success('تم الحذف بنجاح!');
    } catch (err: any) {
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (type: 'page' | 'service' | 'specialization' | 'client' | 'client-content', item: any) => {
    if (type === 'page') {
      setEditingPage(item.id);
      setShowPageForm(true);
      setNewPage({ name: item.name, description: item.description || '', image_url: item.image_url || '', banner_url: item.banner_url || '' });
      setTimeout(() => document.getElementById('page-form')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (type === 'service') {
      setEditingService(item.id);
      setShowServiceForm(true);
      setNewService({ page_id: item.page_id, name: item.name, description: item.description || '', image_url: item.image_url || '' });
      setTimeout(() => document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (type === 'specialization') {
      setEditingSpecialization(item.id);
      setShowSpecializationForm(true);
      setNewSpecialization({ service_id: item.service_id, name: item.name, description: item.description || '', image_url: item.image_url || '' });
      setTimeout(() => document.getElementById('specialization-form')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (type === 'client') {
      setEditingClient(item.id);
      setShowClientForm(true);
      setNewClient({ specialization_id: item.specialization_id, name: item.name, description: item.description || '', image_url: item.image_url || '', project_url: item.project_url || '', logo_url: item.logo_url || '' });
      setTimeout(() => document.getElementById('client-form')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
    if (type === 'client-content') {
      setEditingClientContent(item.id);
      setShowClientContentForm(true);
      setNewClientContent({ client_id: item.client_id, title: item.title, description: item.description || '', image_url: item.image_url || '', video_url: item.video_url || '', content_type: item.content_type || 'image' });
      setTimeout(() => document.getElementById('client-content-form')?.scrollIntoView({ behavior: 'smooth' }), 0);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">جاري التحميل...</div>;

  const filteredServices = services.filter(s => !selectedPage || s.page_id === selectedPage);
  const filteredSpecializations = specializations.filter(s => !selectedService || s.service_id === selectedService);
  const filteredClients = clients.filter(c => !selectedSpecialization || c.specialization_id === selectedSpecialization);
  const filteredClientContent = clientContent.filter(c => !selectedClient || c.client_id === selectedClient);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" dir="rtl">
      <ToastContainer position="top-right" />
      
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">لوحة التحكم</h1>
          <button onClick={() => { supabase.auth.signOut(); navigate('/admin/login'); }} className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 px-6 py-3 rounded-xl transition-all duration-300 border border-red-500/30">
            <Trash2 className="w-5 h-5" /> تسجيل الخروج
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button onClick={() => { setSelectedPage(null); setSelectedService(null); setSelectedSpecialization(null); setSelectedClient(null); }} className={`hover:text-blue-400 transition-colors ${!selectedPage ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>الصفحات</button>
          {selectedPage && (
            <>
              <span className="text-gray-600">/</span>
              <button onClick={() => { setSelectedService(null); setSelectedSpecialization(null); setSelectedClient(null); }} className={`hover:text-purple-400 transition-colors ${selectedPage && !selectedService ? 'text-purple-400 font-bold' : 'text-gray-400'}`}>الخدمات</button>
            </>
          )}
          {selectedService && (
            <>
              <span className="text-gray-600">/</span>
              <button onClick={() => { setSelectedSpecialization(null); setSelectedClient(null); }} className={`hover:text-pink-400 transition-colors ${selectedService && !selectedSpecialization ? 'text-pink-400 font-bold' : 'text-gray-400'}`}>التخصصات</button>
            </>
          )}
          {selectedSpecialization && (
            <>
              <span className="text-gray-600">/</span>
              <button onClick={() => { setSelectedClient(null); }} className={`hover:text-green-400 transition-colors ${selectedSpecialization && !selectedClient ? 'text-green-400 font-bold' : 'text-gray-400'}`}>العملاء</button>
            </>
          )}
          {selectedClient && (
            <>
              <span className="text-gray-600">/</span>
              <span className="text-orange-400 font-bold">محتوى العميل</span>
            </>
          )}
        </div>

        {/* Tree View */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-xl">
          {!selectedPage && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">الصفحات</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {pages.map(page => (
                  <div key={page.id} className="group bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => setSelectedPage(page.id)}>
                    <div className="aspect-square relative">
                      {page.image_url ? (
                        <img src={page.image_url} alt={page.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold leading-tight line-clamp-2">{page.name}</h3>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit('page', page)} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 rounded-xl transition-all duration-300 border border-blue-500/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('page', page.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setShowPageForm(true); setEditingPage(null); setNewPage({ name: '', description: '', image_url: '', banner_url: '' }); setTimeout(() => document.getElementById('page-form')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="bg-gray-700/20 hover:bg-gray-700/40 rounded-2xl border border-dashed border-gray-600/70 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl font-bold text-blue-400">+</div>
                  <div className="mt-2 text-sm text-gray-300">إضافة صفحة</div>
                </button>
              </div>

              {showPageForm && (
                <form id="page-form" onSubmit={(e) => editingPage ? handleUpdate('page', editingPage, e) : handleAdd('page', e)} className="mb-2 bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50">
                  <div className="grid gap-4">
                    <input value={newPage.name} onChange={(e) => setNewPage({...newPage, name: e.target.value})} placeholder="اسم الصفحة" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-blue-500/50 focus:outline-none transition-all" required />
                    <textarea value={newPage.description} onChange={(e) => setNewPage({...newPage, description: e.target.value})} placeholder="الوصف" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-blue-500/50 focus:outline-none transition-all" rows={3} />
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">الصورة الرئيسية المربعة (تُعرض في الموقع)</label>
                      <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'page-image')} className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-blue-500/50 focus:outline-none transition-all" accept="image/*" />
                      {uploading && <span className="ml-2 text-blue-400">جاري الرفع...</span>}
                      {newPage.image_url && <img src={newPage.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600/50" />}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">البانر (يُعرض في الصفحة من الداخل)</label>
                      <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'page-banner')} className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-blue-500/50 focus:outline-none transition-all" accept="image/*" />
                      {uploading && <span className="ml-2 text-blue-400">جاري الرفع...</span>}
                      {newPage.banner_url && <img src={newPage.banner_url} alt="Banner Preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-gray-600/50" />}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 p-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/30">{editingPage ? 'تحديث' : 'إضافة'}</button>
                      <button type="button" onClick={() => { setShowPageForm(false); setEditingPage(null); setNewPage({ name: '', description: '', image_url: '', banner_url: '' }); }} className="bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-xl transition-all duration-300">إغلاق</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedPage && !selectedService && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">الخدمات - {pages.find(p => p.id === selectedPage)?.name}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {filteredServices.map(service => (
                  <div key={service.id} className="group bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => setSelectedService(service.id)}>
                    <div className="aspect-square relative">
                      {service.image_url ? (
                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800/50 p-4 flex flex-col justify-between" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold leading-tight line-clamp-2">{service.name}</h3>
                        <p className="text-gray-300 text-sm mt-1 line-clamp-2">{service.description}</p>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit('service', service)} className="p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 rounded-xl transition-all duration-300 border border-purple-500/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('service', service.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setShowServiceForm(true); setEditingService(null); setNewService({ page_id: selectedPage, name: '', description: '', image_url: '' }); setTimeout(() => document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="bg-gray-700/20 hover:bg-gray-700/40 rounded-2xl border border-dashed border-gray-600/70 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl font-bold text-purple-400">+</div>
                  <div className="mt-2 text-sm text-gray-300">إضافة خدمة</div>
                </button>
              </div>

              {showServiceForm && (
                <form id="service-form" onSubmit={(e) => editingService ? handleUpdate('service', editingService, e) : handleAdd('service', e)} className="mb-2 bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50">
                  <div className="grid gap-4">
                    <input type="hidden" value={newService.page_id} onChange={(e) => setNewService({...newService, page_id: e.target.value})} />
                    <input value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} placeholder="اسم الخدمة" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-purple-500/50 focus:outline-none transition-all" required />
                    <textarea value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} placeholder="الوصف" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-purple-500/50 focus:outline-none transition-all" rows={3} />
                    <div>
                      <label className="block text-gray-400 mb-2">صورة الخدمة</label>
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'service')} className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-purple-500/50 focus:outline-none transition-all" />
                      {newService.image_url && (
                        <img src={newService.image_url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg" />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="submit" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 p-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/30">{editingService ? 'تحديث' : 'إضافة'}</button>
                      <button type="button" onClick={() => { setShowServiceForm(false); setEditingService(null); setNewService({ page_id: selectedPage, name: '', description: '', image_url: '' }); }} className="bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-xl transition-all duration-300">إغلاق</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedService && !selectedSpecialization && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">التخصصات - {services.find(s => s.id === selectedService)?.name}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {filteredSpecializations.map(specialization => (
                  <div key={specialization.id} className="group bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 hover:border-pink-500/50 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => setSelectedSpecialization(specialization.id)}>
                    <div className="aspect-square relative">
                      {specialization.image_url ? (
                        <img src={specialization.image_url} alt={specialization.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold leading-tight line-clamp-2">{specialization.name}</h3>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit('specialization', specialization)} className="p-2 bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 rounded-xl transition-all duration-300 border border-pink-500/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('specialization', specialization.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setShowSpecializationForm(true); setEditingSpecialization(null); setNewSpecialization({ service_id: selectedService, name: '', description: '', image_url: '' }); setTimeout(() => document.getElementById('specialization-form')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="bg-gray-700/20 hover:bg-gray-700/40 rounded-2xl border border-dashed border-gray-600/70 hover:border-pink-500/50 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl font-bold text-pink-400">+</div>
                  <div className="mt-2 text-sm text-gray-300">إضافة تخصص</div>
                </button>
              </div>

              {showSpecializationForm && (
                <form id="specialization-form" onSubmit={(e) => editingSpecialization ? handleUpdate('specialization', editingSpecialization, e) : handleAdd('specialization', e)} className="mb-2 bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50">
                  <div className="grid gap-4">
                    <input type="hidden" value={newSpecialization.service_id} onChange={(e) => setNewSpecialization({...newSpecialization, service_id: e.target.value})} />
                    <input value={newSpecialization.name} onChange={(e) => setNewSpecialization({...newSpecialization, name: e.target.value})} placeholder="اسم التخصص" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-pink-500/50 focus:outline-none transition-all" required />
                    <textarea value={newSpecialization.description} onChange={(e) => setNewSpecialization({...newSpecialization, description: e.target.value})} placeholder="الوصف" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-pink-500/50 focus:outline-none transition-all" rows={3} />
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">صورة التخصص</label>
                      <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'specialization')} className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-pink-500/50 focus:outline-none transition-all" accept="image/*" />
                      {uploading && <span className="ml-2 text-pink-400">جاري الرفع...</span>}
                      {newSpecialization.image_url && <img src={newSpecialization.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600/50" />}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 p-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-pink-500/30">{editingSpecialization ? 'تحديث' : 'إضافة'}</button>
                      <button type="button" onClick={() => { setShowSpecializationForm(false); setEditingSpecialization(null); setNewSpecialization({ service_id: selectedService, name: '', description: '', image_url: '' }); }} className="bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-xl transition-all duration-300">إغلاق</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedSpecialization && !selectedClient && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">العملاء - {specializations.find(s => s.id === selectedSpecialization)?.name}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {filteredClients.map(client => (
                  <div key={client.id} className="group bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer overflow-hidden" onClick={() => setSelectedClient(client.id)}>
                    <div className="aspect-square relative">
                      {client.image_url ? (
                        <img src={client.image_url} alt={client.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold leading-tight line-clamp-2">{client.name}</h3>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit('client', client)} className="p-2 bg-green-500/20 hover:bg-green-500/40 text-green-200 rounded-xl transition-all duration-300 border border-green-500/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('client', client.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setShowClientForm(true); setEditingClient(null); setNewClient({ specialization_id: selectedSpecialization, name: '', description: '', image_url: '', project_url: '', logo_url: '' }); setTimeout(() => document.getElementById('client-form')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="bg-gray-700/20 hover:bg-gray-700/40 rounded-2xl border border-dashed border-gray-600/70 hover:border-green-500/50 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl font-bold text-green-400">+</div>
                  <div className="mt-2 text-sm text-gray-300">إضافة عميل</div>
                </button>
              </div>

              {showClientForm && (
                <form id="client-form" onSubmit={(e) => editingClient ? handleUpdate('client', editingClient, e) : handleAdd('client', e)} className="mb-2 bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50">
                  <div className="grid gap-4">
                    <input type="hidden" value={newClient.specialization_id} onChange={(e) => setNewClient({...newClient, specialization_id: e.target.value})} />
                    <input value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} placeholder="اسم العميل" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-green-500/50 focus:outline-none transition-all" required />
                    <textarea value={newClient.description} onChange={(e) => setNewClient({...newClient, description: e.target.value})} placeholder="الوصف" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-green-500/50 focus:outline-none transition-all" rows={3} />
                    <input value={newClient.project_url} onChange={(e) => setNewClient({...newClient, project_url: e.target.value})} placeholder="رابط المشروع" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-green-500/50 focus:outline-none transition-all" />
                    <div>
                      <label className="block mb-2 text-sm text-gray-400">صورة العميل</label>
                      <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'client')} className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-green-500/50 focus:outline-none transition-all" accept="image/*" />
                      {uploading && <span className="ml-2 text-green-400">جاري الرفع...</span>}
                      {newClient.image_url && <img src={newClient.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600/50" />}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-500/30">{editingClient ? 'تحديث' : 'إضافة'}</button>
                      <button type="button" onClick={() => { setShowClientForm(false); setEditingClient(null); setNewClient({ specialization_id: selectedSpecialization, name: '', description: '', image_url: '', project_url: '', logo_url: '' }); }} className="bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-xl transition-all duration-300">إغلاق</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedClient && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">محتوى العميل - {clients.find(c => c.id === selectedClient)?.name}</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {filteredClientContent.map(content => (
                  <div key={content.id} className="group bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/50 hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
                    <div className="aspect-square relative">
                      {content.image_url ? (
                        <img src={content.image_url} alt={content.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-800/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold leading-tight line-clamp-2">{content.title}</h3>
                        <p className="text-gray-400 text-xs mt-1">{content.content_type}</p>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        <button onClick={() => startEdit('client-content', content)} className="p-2 bg-orange-500/20 hover:bg-orange-500/40 text-orange-200 rounded-xl transition-all duration-300 border border-orange-500/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('client-content', content.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-xl transition-all duration-300 border border-red-500/30"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={() => { setShowClientContentForm(true); setEditingClientContent(null); setNewClientContent({ client_id: selectedClient, title: '', description: '', image_url: '', video_url: '', content_type: 'image' }); setTimeout(() => document.getElementById('client-content-form')?.scrollIntoView({ behavior: 'smooth' }), 0); }} className="bg-gray-700/20 hover:bg-gray-700/40 rounded-2xl border border-dashed border-gray-600/70 hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
                  <div className="text-5xl font-bold text-orange-400">+</div>
                  <div className="mt-2 text-sm text-gray-300">إضافة محتوى</div>
                </button>
              </div>

              {showClientContentForm && (
                <form id="client-content-form" onSubmit={(e) => editingClientContent ? handleUpdate('client-content', editingClientContent, e) : handleAdd('client-content', e)} className="mb-2 bg-gray-700/30 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50">
                  <div className="grid gap-4">
                    <input type="hidden" value={newClientContent.client_id} onChange={(e) => setNewClientContent({...newClientContent, client_id: e.target.value})} />
                    <input value={newClientContent.title} onChange={(e) => setNewClientContent({...newClientContent, title: e.target.value})} placeholder="العنوان" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-all" required />
                    <textarea value={newClientContent.description} onChange={(e) => setNewClientContent({...newClientContent, description: e.target.value})} placeholder="الوصف" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-all" rows={3} />
                    <select value={newClientContent.content_type} onChange={(e) => setNewClientContent({...newClientContent, content_type: e.target.value as 'image' | 'video' | 'text'})} className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-all">
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                      <option value="text">نص فقط</option>
                    </select>
                    {newClientContent.content_type === 'image' && (
                      <div>
                        <label className="block mb-2 text-sm text-gray-400">صورة المحتوى</label>
                        <input type="file" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'client-content')} className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-all" accept="image/*" />
                        {uploading && <span className="ml-2 text-orange-400">جاري الرفع...</span>}
                        {newClientContent.image_url && <img src={newClientContent.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600/50" />}
                      </div>
                    )}
                    {newClientContent.content_type === 'video' && (
                      <div>
                        <label className="block mb-2 text-sm text-gray-400">رابط الفيديو</label>
                        <input value={newClientContent.video_url} onChange={(e) => setNewClientContent({...newClientContent, video_url: e.target.value})} placeholder="رابط الفيديو (YouTube, Vimeo, etc.)" className="p-4 bg-gray-800/50 rounded-xl border border-gray-600/50 focus:border-orange-500/50 focus:outline-none transition-all" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 p-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/30">{editingClientContent ? 'تحديث' : 'إضافة'}</button>
                      <button type="button" onClick={() => { setShowClientContentForm(false); setEditingClientContent(null); setNewClientContent({ client_id: selectedClient, title: '', description: '', image_url: '', video_url: '', content_type: 'image' }); }} className="bg-gray-700/50 hover:bg-gray-600/50 p-4 rounded-xl transition-all duration-300">إغلاق</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
