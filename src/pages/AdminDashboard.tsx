import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Download, Users, X, ZoomIn } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../lib/supabase';
import type { Client, ClientContent, Page, Service, Specialization } from '../types/database';
import { resolveCoreServicesWithPages } from '../data/coreServices';
import { optimizeImage, isImageFile } from '../utils/imageOptimization';

type FormMode = 'page' | 'spec' | 'client' | 'content' | 'customers' | null;

const emptyPageForm = { name: '', name_en: '', description: '', description_en: '', image_url: '', banner_url: '' };
const emptySpecForm = { service_id: '', name: '', name_en: '', description: '', description_en: '', image_url: '' };
const emptyClientForm = { specialization_id: '', name: '', name_en: '', description: '', description_en: '', image_url: '', project_url: '', logo_url: '' };
const emptyContentForm = { client_id: '', title: '', description: '', image_url: '', video_url: '', content_type: 'image' as 'image' | 'video' | 'text' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeForm, setActiveForm] = useState<FormMode>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [contents, setContents] = useState<ClientContent[]>([]);
  const [customerRequests, setCustomerRequests] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingSpec, setEditingSpec] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [specForm, setSpecForm] = useState(emptySpecForm);
  const [clientForm, setClientForm] = useState(emptyClientForm);
  const [contentForm, setContentForm] = useState(emptyContentForm);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const linkedCoreServices = useMemo(() => resolveCoreServicesWithPages(pages), [pages]);
  const selectedPageServiceIds = useMemo(() => services.filter(s => s.page_id === selectedPage).map(s => s.id), [services, selectedPage]);
  const filteredSpecs = useMemo(() => specializations.filter(s => !selectedPage || selectedPageServiceIds.includes(s.service_id)), [specializations, selectedPage, selectedPageServiceIds]);
  const filteredClients = useMemo(() => clients.filter(c => !selectedSpec || c.specialization_id === selectedSpec), [clients, selectedSpec]);
  const filteredContents = useMemo(() => contents.filter(c => !selectedClient || c.client_id === selectedClient), [contents, selectedClient]);

  const primaryService = (pageId: string | null) => services.find(s => s.page_id === pageId) || null;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, s, sp, c, cc, cr] = await Promise.all([
        supabase.from('pages').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('services').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('specializations').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('clients').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('client_content').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('collaboration_requests').select('*').order('created_at', { ascending: false }),
      ]);
      if (p.error) throw p.error;
      if (s.error) throw s.error;
      if (sp.error) throw sp.error;
      if (c.error) throw c.error;
      if (cc.error) throw cc.error;
      if (cr.error) throw cr.error;
      setPages(p.data || []);
      setServices(s.data || []);
      setSpecializations(sp.data || []);
      setClients(c.data || []);
      setContents(cc.data || []);
      setCustomerRequests(cr.data || []);
    } catch (error: any) {
      toast.error(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/admin/login');
      await fetchData();
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (selectedPage && !editingSpec) setSpecForm(v => ({ ...v, service_id: primaryService(selectedPage)?.id || '' }));
  }, [selectedPage, editingSpec, services]);

  const resetForms = () => {
    setActiveForm(null);
    setEditingPage(null);
    setEditingSpec(null);
    setEditingClient(null);
    setEditingContent(null);
    setPageForm(emptyPageForm);
    setSpecForm({ ...emptySpecForm, service_id: selectedPage ? (primaryService(selectedPage)?.id || '') : '' });
    setClientForm({ ...emptyClientForm, specialization_id: selectedSpec || '' });
    setContentForm({ ...emptyContentForm, client_id: selectedClient || '' });
  };

  const uploadImage = async (file: File, target: 'page-image' | 'page-banner' | 'spec' | 'client' | 'content') => {
    setUploading(true);
    try {
      // التحقق من أن الملف هو صورة
      if (!isImageFile(file)) {
        throw new Error('الملف يجب أن يكون صورة (JPEG, PNG, WebP, GIF)');
      }

      // تحسين الصورة قبل الرفع
      let optimizedFile = file;
      try {
        toast.info('جاري تحسين الصورة...');
        optimizedFile = await optimizeImage(file, {
          maxWidth: 1280,
          maxHeight: 1280,
          quality: 0.65,
          format: 'webp',
        });
      } catch (error) {
        console.warn('Failed to optimize image, using original:', error);
        // إذا فشل التحسين، استخدم الصورة الأصلية
      }

      const ext = optimizedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      
      toast.info('جاري رفع الصورة...');
      const uploaded = await supabase.storage.from('services').upload(fileName, optimizedFile, { upsert: true });
      
      if (uploaded.error) throw uploaded.error;
      
      const { data } = supabase.storage.from('services').getPublicUrl(fileName);
      
      if (target === 'page-image') setPageForm(v => ({ ...v, image_url: data.publicUrl }));
      if (target === 'page-banner') setPageForm(v => ({ ...v, banner_url: data.publicUrl }));
      if (target === 'spec') setSpecForm(v => ({ ...v, image_url: data.publicUrl }));
      if (target === 'client') setClientForm(v => ({ ...v, image_url: data.publicUrl }));
      if (target === 'content') setContentForm(v => ({ ...v, image_url: data.publicUrl }));
      
      toast.success('تم رفع الصورة بنجاح ✨');
    } catch (error: any) {
      toast.error(`خطأ: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const ensurePrimaryService = async (pageId: string) => {
    const current = primaryService(pageId);
    if (current) return current.id;
    const page = pages.find(p => p.id === pageId);
    const result = await supabase.from('services').insert([{ page_id: pageId, name: page?.name || 'خدمة', description: page?.description || '', image_url: page?.image_url || '' }]).select().single();
    if (result.error) throw result.error;
    setServices(prev => [result.data, ...prev]);
    return result.data.id;
  };

  const savePage = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = editingPage ? supabase.from('pages').update(pageForm).eq('id', editingPage) : supabase.from('pages').insert([pageForm]);
    const { error } = await op;
    if (error) return toast.error(`خطأ: ${error.message}`);
    toast.success(editingPage ? 'تم تحديث الخدمة الرئيسية.' : 'تم ربط الخدمة الرئيسية.');
    resetForms();
    await fetchData();
  };

  const saveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceId = specForm.service_id || (selectedPage ? await ensurePrimaryService(selectedPage) : '');
    const op = editingSpec ? supabase.from('specializations').update({ ...specForm, service_id: serviceId }).eq('id', editingSpec) : supabase.from('specializations').insert([{ ...specForm, service_id: serviceId }]);
    const { error } = await op;
    if (error) return toast.error(`خطأ: ${error.message}`);
    toast.success(editingSpec ? 'تم تحديث القسم.' : 'تمت إضافة القسم.');
    resetForms();
    await fetchData();
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = editingClient ? supabase.from('clients').update(clientForm).eq('id', editingClient) : supabase.from('clients').insert([clientForm]);
    const { error } = await op;
    if (error) return toast.error(`خطأ: ${error.message}`);
    toast.success(editingClient ? 'تم تحديث العمل.' : 'تمت إضافة العمل.');
    resetForms();
    await fetchData();
  };

  const saveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const op = editingContent ? supabase.from('client_content').update(contentForm).eq('id', editingContent) : supabase.from('client_content').insert([contentForm]);
    const { error } = await op;
    if (error) return toast.error(`خطأ: ${error.message}`);
    toast.success(editingContent ? 'تم تحديث المحتوى.' : 'تمت إضافة المحتوى.');
    resetForms();
    await fetchData();
  };

  const removeItem = async (table: 'pages' | 'specializations' | 'clients' | 'client_content' | 'collaboration_requests', id: string) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return toast.error(`خطأ: ${error.message}`);
    toast.success('تم الحذف.');
    await fetchData();
  };

  const exportCustomersToCSV = () => {
    if (customerRequests.length === 0) return toast.info('لا توجد بيانات لتصديرها');
    
    const headers = ['الاسم', 'رقم الهاتف', 'الخدمات المختارة', 'تاريخ الطلب'];
    const rows = customerRequests.map(req => [
      req.name,
      req.phone,
      Array.isArray(req.selected_services) ? req.selected_services.join(' - ') : req.selected_services,
      new Date(req.created_at).toLocaleString('ar-EG')
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customer_data_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTopCard = (item: ReturnType<typeof resolveCoreServicesWithPages>[number]) => {
    const linkedPage = item.page;
    return (
      <div
        key={item.slug}
        className={`group relative overflow-hidden rounded-3xl border bg-[#0d0d0d] p-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:bg-[#151515] hover:shadow-2xl cursor-pointer ${item.borderColor}`}
      >
        <button
          onClick={() => {
            if (linkedPage) {
              setSelectedPage(linkedPage.id);
              setSelectedSpec(null);
              setSelectedClient(null);
            } else {
              setEditingPage(null);
              setPageForm({ name: item.title, name_en: '', description: item.description, description_en: '', image_url: '', banner_url: '' });
              setActiveForm('page');
            }
          }}
          className="absolute inset-0 z-20"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-100 transition-opacity duration-500`}
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col">
          <div className="mb-6 flex items-start justify-between">
            <div
              className={`h-16 w-16 scale-110 rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-lg transition-transform duration-500 ease-out group-hover:scale-125 ${item.iconColor} flex items-center justify-center`}
            >
              <item.icon className="h-8 w-8 drop-shadow-[0_0_8px_currentColor]" strokeWidth={1.5} />
            </div>
          </div>

          <h3 className="mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-2xl font-bold leading-[1.4] text-transparent transition-all duration-300 group-hover:to-white">
            {item.title}
          </h3>

          <div className="flex-grow" />
        </div>

        <item.icon
          className={`pointer-events-none absolute -bottom-8 -left-8 h-44 w-44 rotate-12 opacity-10 transition-all duration-1000 ease-in-out group-hover:rotate-45 group-hover:scale-125 ${item.iconColor}`}
        />
      </div>
    );
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">جاري التحميل...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" dir="rtl">
      <ToastContainer position="top-right" />
      <div className="container mx-auto p-6 flex-grow">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777437920/agency-logo_lbppdi.png" 
              alt="POVA Agency" 
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-bold text-transparent">لوحة التحكم</h1>
              <p className="mt-2 text-sm text-gray-400">الخدمات الرئيسية هنا هي نفس كروت قسم حلول متكاملة لنجاحك الرقمي.</p>
            </div>
          </div>
          <button onClick={() => { supabase.auth.signOut(); navigate('/admin/login'); }} className="rounded-xl border border-red-500/30 bg-red-500/20 px-5 py-3 text-red-300">تسجيل الخروج</button>
        </div>

        <div className="mb-6 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => { setActiveForm(null); setSelectedPage(null); setSelectedSpec(null); setSelectedClient(null); }} className={!selectedPage && activeForm !== 'customers' ? 'font-bold text-blue-400' : 'text-gray-400'}>الخدمات الرئيسية</button>
            {selectedPage && <><span>/</span><button onClick={() => { setSelectedSpec(null); setSelectedClient(null); }} className={!selectedSpec ? 'font-bold text-pink-400' : 'text-gray-400'}>الأقسام</button></>}
            {selectedSpec && <><span>/</span><button onClick={() => setSelectedClient(null)} className={!selectedClient ? 'font-bold text-green-400' : 'text-gray-400'}>العملاء</button></>}
            {selectedClient && <><span>/</span><span className="font-bold text-orange-400">محتوى العميل</span></>}
          </div>
          <div className="h-4 w-px bg-gray-700 mx-2" />
        </div>

        <div className="rounded-3xl border border-gray-700/50 bg-gray-800/50 p-6">
          {!selectedPage && (
            <div>
              <h2 className="text-3xl font-bold text-blue-300">الخدمات الرئيسية</h2>
              <p className="mt-2 mb-6 text-sm text-gray-400">كل الخدمات الظاهرة في قسم حلول متكاملة لنجاحك الرقمي موجودة هنا دائمًا، سواء كانت مربوطة بالقاعدة أو لا.</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{linkedCoreServices.map(renderTopCard)}</div>
              {activeForm === 'page' && (
                <form onSubmit={savePage} className="mt-6 grid gap-4 rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5">
                  <input value={pageForm.name} onChange={e => setPageForm({ ...pageForm, name: e.target.value })} placeholder="اسم الخدمة الرئيسية" className="rounded-xl bg-gray-800/50 p-4" required />
                  <input value={pageForm.name_en} onChange={e => setPageForm({ ...pageForm, name_en: e.target.value })} placeholder="اسم الخدمة الرئيسية (إنجليزي)" className="rounded-xl bg-gray-800/50 p-4" />
                  <textarea value={pageForm.description} onChange={e => setPageForm({ ...pageForm, description: e.target.value })} placeholder="وصف الخدمة الرئيسية" rows={3} className="rounded-xl bg-gray-800/50 p-4" />
                  <textarea value={pageForm.description_en} onChange={e => setPageForm({ ...pageForm, description_en: e.target.value })} placeholder="وصف الخدمة الرئيسية (إنجليزي)" rows={3} className="rounded-xl bg-gray-800/50 p-4" />
                  <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'page-image')} className="rounded-xl bg-gray-800/50 p-3" />
                  <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'page-banner')} className="rounded-xl bg-gray-800/50 p-3" />
                  {uploading && <div className="text-sm text-blue-300">جارٍ الرفع...</div>}
                  <div className="grid grid-cols-2 gap-3">
                    <button type="submit" className="rounded-xl bg-blue-600 p-4">{editingPage ? 'تحديث' : 'ربط الخدمة'}</button>
                    <button type="button" onClick={resetForms} className="rounded-xl bg-gray-700 p-4">إغلاق</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedPage && !selectedSpec && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-pink-300">الأقسام - {pages.find(p => p.id === selectedPage)?.name}</h2>
                  <p className="mt-2 text-sm text-gray-400">هذه الأقسام تظهر مباشرة داخل صفحة الخدمة الرئيسية.</p>
                </div>
                <button onClick={() => { resetForms(); setSpecForm(v => ({ ...v, service_id: primaryService(selectedPage)?.id || '' })); setActiveForm('spec'); }} className="rounded-xl bg-pink-500/20 px-4 py-2 text-pink-200">إضافة قسم</button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{filteredSpecs.map(spec => (
                <div key={spec.id} className="overflow-hidden rounded-2xl border border-gray-600/50 bg-gray-700/30 flex flex-col">
                  <button onClick={() => { setSelectedSpec(spec.id); setSelectedClient(null); }} className="w-full text-right flex-grow">
                    <div className="relative aspect-square">
                      {spec.image_url ? <img src={spec.image_url} alt={spec.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-800/50" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="line-clamp-2 font-bold">{spec.name}</h3></div>
                    </div>
                  </button>
                  <div className="flex gap-2 p-3">
                    <button onClick={() => { setEditingSpec(spec.id); setSpecForm({ service_id: spec.service_id, name: spec.name, name_en: spec.name_en || '', description: spec.description || '', description_en: spec.description_en || '', image_url: spec.image_url || '' }); setActiveForm('spec'); }} className="flex-1 rounded-lg bg-pink-500/20 py-2 text-pink-200"><Edit className="mx-auto h-4 w-4" /></button>
                    <button onClick={() => removeItem('specializations', spec.id)} className="flex-1 rounded-lg bg-red-500/20 py-2 text-red-200"><Trash2 className="mx-auto h-4 w-4" /></button>
                  </div>
                  <button onClick={() => { setSelectedSpec(spec.id); setSelectedClient(null); }} className="w-full rounded-none bg-pink-600/40 px-4 py-3 font-bold text-pink-200 hover:bg-pink-600/60 transition-colors flex items-center justify-center gap-2">
                    <span>الدخول إلى القسم</span>
                    <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              ))}</div>
              {activeForm === 'spec' && <form onSubmit={saveSpec} className="mt-6 grid gap-4 rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5"><input value={specForm.name} onChange={e => setSpecForm({ ...specForm, name: e.target.value })} placeholder="اسم القسم" className="rounded-xl bg-gray-800/50 p-4" required /><input value={specForm.name_en} onChange={e => setSpecForm({ ...specForm, name_en: e.target.value })} placeholder="اسم القسم (إنجليزي)" className="rounded-xl bg-gray-800/50 p-4" /><textarea value={specForm.description} onChange={e => setSpecForm({ ...specForm, description: e.target.value })} placeholder="وصف القسم" rows={3} className="rounded-xl bg-gray-800/50 p-4" /><textarea value={specForm.description_en} onChange={e => setSpecForm({ ...specForm, description_en: e.target.value })} placeholder="وصف القسم (إنجليزي)" rows={3} className="rounded-xl bg-gray-800/50 p-4" /><input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'spec')} className="rounded-xl bg-gray-800/50 p-3" />{uploading && <div className="text-sm text-pink-300">جارٍ الرفع...</div>}<div className="grid grid-cols-2 gap-3"><button type="submit" className="rounded-xl bg-pink-600 p-4">{editingSpec ? 'تحديث' : 'إضافة'}</button><button type="button" onClick={resetForms} className="rounded-xl bg-gray-700 p-4">إغلاق</button></div></form>}
            </div>
          )}

          {selectedSpec && !selectedClient && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-green-300">العملاء - {specializations.find(s => s.id === selectedSpec)?.name}</h2>
                <button onClick={() => { resetForms(); setClientForm(v => ({ ...v, specialization_id: selectedSpec })); setActiveForm('client'); }} className="rounded-xl bg-green-500/20 px-4 py-2 text-green-200">إضافة عميل</button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{filteredClients.map(client => (
                <div key={client.id} className="overflow-hidden rounded-2xl border border-gray-600/50 bg-gray-700/30 flex flex-col">
                  <button onClick={() => setSelectedClient(client.id)} className="w-full text-right flex-grow">
                    <div className="relative aspect-square">
                      {client.image_url ? <img src={client.image_url} alt={client.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-800/50" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="line-clamp-2 font-bold">{client.name}</h3></div>
                    </div>
                  </button>
                  <div className="flex gap-2 p-3">
                    <button onClick={() => { setEditingClient(client.id); setClientForm({ specialization_id: client.specialization_id, name: client.name, name_en: client.name_en || '', description: client.description || '', description_en: client.description_en || '', image_url: client.image_url || '', project_url: client.project_url || '', logo_url: client.logo_url || '' }); setActiveForm('client'); }} className="flex-1 rounded-lg bg-green-500/20 py-2 text-green-200"><Edit className="mx-auto h-4 w-4" /></button>
                    <button onClick={() => removeItem('clients', client.id)} className="flex-1 rounded-lg bg-red-500/20 py-2 text-red-200"><Trash2 className="mx-auto h-4 w-4" /></button>
                  </div>
                  <button onClick={() => setSelectedClient(client.id)} className="w-full rounded-none bg-green-600/40 px-4 py-3 font-bold text-green-200 hover:bg-green-600/60 transition-colors flex items-center justify-center gap-2">
                    <span>الدخول إلى محتوى العميل</span>
                    <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              ))}</div>
              {activeForm === 'client' && <form onSubmit={saveClient} className="mt-6 grid gap-4 rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5"><input value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} placeholder="اسم العمل أو العميل" className="rounded-xl bg-gray-800/50 p-4" required /><input value={clientForm.name_en} onChange={e => setClientForm({ ...clientForm, name_en: e.target.value })} placeholder="اسم العمل أو العميل (إنجليزي)" className="rounded-xl bg-gray-800/50 p-4" /><textarea value={clientForm.description} onChange={e => setClientForm({ ...clientForm, description: e.target.value })} placeholder="وصف العمل" rows={3} className="rounded-xl bg-gray-800/50 p-4" /><textarea value={clientForm.description_en} onChange={e => setClientForm({ ...clientForm, description_en: e.target.value })} placeholder="وصف العمل (إنجليزي)" rows={3} className="rounded-xl bg-gray-800/50 p-4" /><input value={clientForm.project_url} onChange={e => setClientForm({ ...clientForm, project_url: e.target.value })} placeholder="رابط المشروع" className="rounded-xl bg-gray-800/50 p-4" /><input value={clientForm.logo_url} onChange={e => setClientForm({ ...clientForm, logo_url: e.target.value })} placeholder="رابط الشعار" className="rounded-xl bg-gray-800/50 p-4" /><input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'client')} className="rounded-xl bg-gray-800/50 p-3" />{uploading && <div className="text-sm text-green-300">جارٍ الرفع...</div>}<div className="grid grid-cols-2 gap-3"><button type="submit" className="rounded-xl bg-green-600 p-4">{editingClient ? 'تحديث' : 'إضافة'}</button><button type="button" onClick={resetForms} className="rounded-xl bg-gray-700 p-4">إغلاق</button></div></form>}
            </div>
          )}

          {selectedClient && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold text-orange-300">محتوى العميل - {clients.find(c => c.id === selectedClient)?.name}</h2>
                <button onClick={() => { resetForms(); setContentForm(v => ({ ...v, client_id: selectedClient })); setActiveForm('content'); }} className="rounded-xl bg-orange-500/20 px-4 py-2 text-orange-200">إضافة محتوى</button>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{filteredContents.map(item => <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-600/50 bg-gray-700/30"><div className="relative aspect-square">{item.image_url ? <><img src={item.image_url} alt={item.title} className="h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setZoomedImage(item.image_url)} /><button onClick={() => setZoomedImage(item.image_url)} className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm p-2 rounded-lg transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"><ZoomIn className="h-4 w-4 text-white" /></button></> : <div className="h-full w-full bg-gray-800/50" />}<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-3"><h3 className="line-clamp-2 font-bold">{item.title}</h3><p className="mt-1 text-xs text-gray-400">{item.content_type}</p></div></div><div className="flex gap-2 p-3"><button onClick={() => { setEditingContent(item.id); setContentForm({ client_id: item.client_id, title: item.title, description: item.description || '', image_url: item.image_url || '', video_url: item.video_url || '', content_type: item.content_type || 'image' }); setActiveForm('content'); }} className="flex-1 rounded-lg bg-orange-500/20 py-2 text-orange-200"><Edit className="mx-auto h-4 w-4" /></button><button onClick={() => removeItem('client_content', item.id)} className="flex-1 rounded-lg bg-red-500/20 py-2 text-red-200"><Trash2 className="mx-auto h-4 w-4" /></button></div></div>)}</div>
              {activeForm === 'content' && <form onSubmit={saveContent} className="mt-6 grid gap-4 rounded-2xl border border-gray-600/50 bg-gray-700/30 p-5"><input value={contentForm.title} onChange={e => setContentForm({ ...contentForm, title: e.target.value })} placeholder="عنوان المحتوى" className="rounded-xl bg-gray-800/50 p-4" required /><textarea value={contentForm.description} onChange={e => setContentForm({ ...contentForm, description: e.target.value })} placeholder="وصف المحتوى" rows={3} className="rounded-xl bg-gray-800/50 p-4" /><select value={contentForm.content_type} onChange={e => setContentForm({ ...contentForm, content_type: e.target.value as 'image' | 'video' | 'text' })} className="rounded-xl bg-gray-800/50 p-4"><option value="image">صورة</option><option value="video">فيديو</option><option value="text">نص</option></select>{contentForm.content_type === 'image' && <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0], 'content')} className="rounded-xl bg-gray-800/50 p-3" />}{contentForm.content_type === 'video' && <input value={contentForm.video_url} onChange={e => setContentForm({ ...contentForm, video_url: e.target.value })} placeholder="رابط الفيديو" className="rounded-xl bg-gray-800/50 p-4" />}{uploading && <div className="text-sm text-orange-300">جارٍ الرفع...</div>}<div className="grid grid-cols-2 gap-3"><button type="submit" className="rounded-xl bg-orange-600 p-4">{editingContent ? 'تحديث' : 'إضافة'}</button><button type="button" onClick={resetForms} className="rounded-xl bg-gray-700 p-4">إغلاق</button></div></form>}
            </div>
          )}



        </div>

        {/* Footer - بيانات العملاء */}
        {activeForm === 'customers' && (
          <div className="mt-12">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-accent">بيانات العملاء</h2>
                  <p className="mt-2 text-sm text-gray-400">جميع طلبات التعاون التي تم إرسالها من خلال الموقع.</p>
                </div>
                <button 
                  onClick={exportCustomersToCSV}
                  className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Download className="h-5 w-5" />
                  تصدير البيانات (CSV)
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-700/50 bg-gray-900/50">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-gray-700/50 bg-gray-800/30">
                      <th className="px-6 py-4 text-sm font-bold text-gray-300">الاسم</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-300">رقم الهاتف</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-300">الخدمات</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-300">التاريخ</th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-300">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerRequests.length > 0 ? (
                      customerRequests.map((req) => (
                        <tr key={req.id} className="border-b border-gray-800/30 transition-colors hover:bg-white/5">
                          <td className="px-6 py-4 font-medium text-white">{req.name}</td>
                          <td className="px-6 py-4 font-mono text-gray-300" dir="ltr">{req.phone}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(req.selected_services) ? req.selected_services.map((s: string, i: number) => (
                                <span key={i} className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent border border-accent/20">
                                  {s}
                                </span>
                              )) : req.selected_services}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(req.created_at).toLocaleString('ar-EG')}
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => removeItem('collaboration_requests', req.id)}
                              className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد بيانات متاحة حالياً</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* True Footer - بيانات العملاء Button */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 mt-auto">
        <div className="container mx-auto p-6 flex flex-col items-center justify-center">
          <button 
            onClick={() => { setActiveForm('customers'); setSelectedPage(null); setSelectedSpec(null); setSelectedClient(null); }} 
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-bold ${activeForm === 'customers' ? 'bg-accent/20 text-accent' : 'bg-gray-700/30 text-gray-300 hover:text-white hover:bg-gray-700/50'}`}
          >
            <Users className="w-5 h-5" />
            بيانات العملاء
          </button>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img 
              src={zoomedImage} 
              alt="Zoomed" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition-all"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
