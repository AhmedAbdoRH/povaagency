import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Page, Specialization, Client, Banner } from '../types/database';
import { Trash2, Edit, Plus, Save, X, Upload, Image, Layout, Layers, Users, Monitor } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const successGreen = '#228B22'; 

interface AdminDashboardProps {
  onSettingsUpdate?: () => void;
}

export default function AdminDashboard({ onSettingsUpdate }: AdminDashboardProps) {
  // State for Pages (formerly Categories)
  const [pages, setPages] = useState<Page[]>([]);
  // State for Specializations (formerly Subcategories)
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  // State for Clients (formerly Services/Products)
  const [clients, setClients] = useState<Client[]>([]);
  // State for Banners
  const [banners, setBanners] = useState<Banner[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

  // Editing states
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editingSpecialization, setEditingSpecialization] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);

  // Modal state
  const [deleteModal, setDeleteModal] = useState<{ id: string; type: 'page' | 'specialization' | 'client' | 'banner' } | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'pages' | 'specializations' | 'banners'>('pages');

  // New Item States
  const [newPage, setNewPage] = useState({ name: '', description: '', slug: '' });
  const [newSpecialization, setNewSpecialization] = useState({ page_id: '', name_ar: '', name_en: '', description_ar: '', description_en: '' });
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    description: '',
    logo_url: '',
    specialization_id: '',
    is_active: true
  });
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    type: 'image',
    title: '',
    description: '',
    image_url: '',
    page_id: '', // Added page selection
    is_active: true
  });

  const navigate = useNavigate();

  // Helper: Resize Image
  const resizeImageIfNeeded = async (file: File, maxMegaBytes: number): Promise<File> => {
    const maxSize = maxMegaBytes * 1024 * 1024;
    if (file.size <= maxSize) return file;

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const reader = new FileReader();
      reader.onload = (e: any) => { img.src = e.target.result; };
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));

        let width = img.width;
        let height = img.height;
        const ratio = Math.sqrt(file.size / maxSize);
        width = Math.floor(width / ratio);
        height = Math.floor(height / ratio);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Failed to create blob'));
          const resizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }, 'image/webp', 0.85);
      };
      img.onerror = reject;
    });
  };

  // Helper: Handle Image Upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'client' | 'banner'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const bucket = type === 'banner' ? 'banners' : 'services'; // Keeping 'services' bucket for clients to reuse existing storage or create 'clients' bucket
    if (type === 'client') setUploadingImage(true);
    if (type === 'banner') setUploadingBannerImage(true);

    try {
      if (!file.type.startsWith('image/')) throw new Error('الرجاء اختيار ملف صورة صالح');
      const processedFile = await resizeImageIfNeeded(file, 2);
      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, processedFile, { upsert: true });
      
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      if (type === 'client') {
        setNewClient(prev => ({ ...prev, logo_url: publicUrl }));
      } else if (type === 'banner') {
        setNewBanner(prev => ({ ...prev, image_url: publicUrl }));
      }
      setSuccessMsg('تم رفع الصورة بنجاح!');
    } catch (err: any) {
      setError(`خطأ في رفع الصورة: ${err.message}`);
    } finally {
      if (type === 'client') setUploadingImage(false);
      if (type === 'banner') setUploadingBannerImage(false);
      event.target.value = '';
    }
  };

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Pages (formerly Categories)
      const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });
      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // 2. Fetch Specializations (formerly Subcategories)
      const { data: specsData, error: specsError } = await supabase
        .from('specializations')
        .select('*, page:pages(name)')
        .order('created_at', { ascending: false });
      if (specsError) {
          // If table not renamed yet, try 'subcategories' for fallback or just log
          console.error("Error fetching specializations (check if table renamed):", specsError);
      } else {
          setSpecializations(specsData || []);
      }

      // 3. Fetch Clients (New table)
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*, specialization:specializations(name_ar)')
        .order('created_at', { ascending: false });
      
      if (clientsError) {
           console.error("Error fetching clients (check if table created):", clientsError);
           // Fallback: try fetching from 'services' if clients table doesn't exist yet, just to show something? 
           // No, we strictly follow the new structure.
      } else {
           setClients(clientsData || []);
      }

      // 4. Fetch Banners
      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*, page:pages(name)')
        .order('created_at', { ascending: false });
      if (bannersError) throw bannersError;
      setBanners(bannersData || []);

    } catch (err: any) {
      setError(`خطأ في جلب البيانات: ${err.message}`);
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
    if (error) { toast.error(error); setError(null); }
    if (successMsg) { toast.success(successMsg); setSuccessMsg(null); }
  }, [error, successMsg]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // --- Page Operations ---
  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.name.trim()) return setError("اسم الصفحة مطلوب.");
    setIsLoading(true);
    try {
      const { error } = await supabase.from('pages').insert([newPage]);
      if (error) throw error;
      setNewPage({ name: '', description: '', slug: '' });
      await fetchData();
      setSuccessMsg("تمت إضافة الصفحة بنجاح!");
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('pages').update(newPage).eq('id', editingPage);
      if (error) throw error;
      setEditingPage(null);
      setNewPage({ name: '', description: '', slug: '' });
      await fetchData();
      setSuccessMsg("تم تحديث الصفحة بنجاح!");
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleDeletePage = async (id: string) => {
      // Logic handled in modal
      setDeleteModal({ id, type: 'page' });
  };

  // --- Specialization Operations ---
  const handleAddSpecialization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialization.name_ar.trim() || !newSpecialization.page_id) return setError("الاسم والصفحة مطلوبان.");
    setIsLoading(true);
    try {
      const { error } = await supabase.from('specializations').insert([newSpecialization]);
      if (error) throw error;
      setNewSpecialization({ page_id: '', name_ar: '', name_en: '', description_ar: '', description_en: '' });
      await fetchData();
      setSuccessMsg("تمت إضافة التخصص بنجاح!");
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleUpdateSpecialization = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingSpecialization) return;
      setIsLoading(true);
      try {
          const { error } = await supabase.from('specializations').update(newSpecialization).eq('id', editingSpecialization);
          if (error) throw error;
          setEditingSpecialization(null);
          setNewSpecialization({ page_id: '', name_ar: '', name_en: '', description_ar: '', description_en: '' });
          await fetchData();
          setSuccessMsg("تم تحديث التخصص بنجاح!");
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  // --- Client Operations ---
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name?.trim() || !newClient.specialization_id) return setError("اسم العميل والتخصص مطلوبان.");
    setIsLoading(true);
    try {
      const { error } = await supabase.from('clients').insert([newClient]);
      if (error) throw error;
      setNewClient({ name: '', description: '', logo_url: '', specialization_id: '', is_active: true });
      await fetchData();
      setSuccessMsg("تمت إضافة العميل بنجاح!");
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingClient) return;
      setIsLoading(true);
      try {
          const { error } = await supabase.from('clients').update(newClient).eq('id', editingClient);
          if (error) throw error;
          setEditingClient(null);
          setNewClient({ name: '', description: '', logo_url: '', specialization_id: '', is_active: true });
          await fetchData();
          setSuccessMsg("تم تحديث بيانات العميل بنجاح!");
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  // --- Banner Operations ---
  const handleAddBanner = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newBanner.image_url) return setError("صورة البانر مطلوبة.");
      setIsLoading(true);
      try {
          const { error } = await supabase.from('banners').insert([{...newBanner, page_id: newBanner.page_id || null}]);
          if (error) throw error;
          setNewBanner({ type: 'image', title: '', description: '', image_url: '', page_id: '', is_active: true });
          await fetchData();
          setSuccessMsg("تمت إضافة البانر بنجاح!");
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingBanner) return;
      setIsLoading(true);
      try {
          const { error } = await supabase.from('banners').update({...newBanner, page_id: newBanner.page_id || null}).eq('id', editingBanner);
          if (error) throw error;
          setEditingBanner(null);
          setNewBanner({ type: 'image', title: '', description: '', image_url: '', page_id: '', is_active: true });
          await fetchData();
          setSuccessMsg("تم تحديث البانر بنجاح!");
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  // --- Delete Confirmation ---
  const handleConfirmDelete = async () => {
      if (!deleteModal) return;
      setIsLoading(true);
      try {
          if (deleteModal.type === 'page') {
              await supabase.from('pages').delete().eq('id', deleteModal.id);
          } else if (deleteModal.type === 'specialization') {
              await supabase.from('specializations').delete().eq('id', deleteModal.id);
          } else if (deleteModal.type === 'client') {
              await supabase.from('clients').delete().eq('id', deleteModal.id);
          } else if (deleteModal.type === 'banner') {
              await supabase.from('banners').delete().eq('id', deleteModal.id);
          }
          setDeleteModal(null);
          await fetchData();
          setSuccessMsg("تم الحذف بنجاح.");
      } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
  };

  // --- Render Helpers ---
  const renderSidebar = () => (
      <div className="md:col-span-1 space-y-2">
          <button onClick={() => setActiveTab('pages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'pages' ? 'bg-[#ee5239] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <Layout className="h-5 w-5" /> <span>الصفحات (الأقسام)</span>
          </button>
          <button onClick={() => setActiveTab('specializations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'specializations' ? 'bg-[#ee5239] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <Layers className="h-5 w-5" /> <span>التخصصات والعملاء</span>
          </button>
          <button onClick={() => setActiveTab('banners')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'banners' ? 'bg-[#ee5239] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <Image className="h-5 w-5" /> <span>البانرات</span>
          </button>
      </div>
  );

  return (
    <div className="min-h-screen font-[Cairo] bg-[#1a1a1a] text-white" dir="rtl">
        <ToastContainer position="bottom-right" theme="dark" rtl />
        
        {/* Modal */}
        {deleteModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
                    <h3 className="text-xl font-bold mb-4 text-red-500">تأكيد الحذف</h3>
                    <p className="text-gray-300 mb-6">هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">إلغاء</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700">حذف</button>
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#ee5239]">لوحة التحكم - POVA</h1>
                <button onClick={handleLogout} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm font-bold transition-colors">تسجيل خروج</button>
            </div>
        </div>

        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {renderSidebar()}
            
            <div className="md:col-span-3">
                {/* Pages Tab */}
                {activeTab === 'pages' && (
                    <div className="space-y-8">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Layout className="text-[#ee5239]" /> {editingPage ? 'تعديل صفحة' : 'إضافة صفحة جديدة'}</h2>
                            <form onSubmit={editingPage ? handleUpdatePage : handleAddPage} className="space-y-4">
                                <input type="text" placeholder="اسم الصفحة (مثال: خدماتنا، من نحن)" value={newPage.name} onChange={e => setNewPage({...newPage, name: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" />
                                <input type="text" placeholder="Slug (رابط الصفحة - اختياري)" value={newPage.slug || ''} onChange={e => setNewPage({...newPage, slug: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" dir="ltr" />
                                <textarea placeholder="وصف الصفحة" value={newPage.description || ''} onChange={e => setNewPage({...newPage, description: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" rows={3} />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-[#ee5239] hover:bg-[#d63d2a] text-white px-6 py-2 rounded font-bold flex-1">{editingPage ? 'حفظ التعديلات' : 'إضافة الصفحة'}</button>
                                    {editingPage && <button type="button" onClick={() => {setEditingPage(null); setNewPage({name:'', description:'', slug:''})}} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-bold">إلغاء</button>}
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {pages.map(page => (
                                <div key={page.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex justify-between items-center group hover:border-[#ee5239] transition-colors">
                                    <div>
                                        <h3 className="font-bold text-lg">{page.name}</h3>
                                        {page.slug && <p className="text-xs text-gray-400 font-mono">/{page.slug}</p>}
                                        <p className="text-gray-400 text-sm">{page.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => {setEditingPage(page.id); setNewPage({name: page.name, description: page.description, slug: page.slug || ''})}} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit size={18} /></button>
                                        <button onClick={() => setDeleteModal({id: page.id, type: 'page'})} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specializations & Clients Tab */}
                {activeTab === 'specializations' && (
                    <div className="space-y-8">
                         {/* 1. Specializations Management */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Layers className="text-[#ee5239]" /> {editingSpecialization ? 'تعديل تخصص' : 'إضافة تخصص جديد'}</h2>
                            <form onSubmit={editingSpecialization ? handleUpdateSpecialization : handleAddSpecialization} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select value={newSpecialization.page_id} onChange={e => setNewSpecialization({...newSpecialization, page_id: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none">
                                        <option value="">اختر الصفحة التابعة لها</option>
                                        {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    <input type="text" placeholder="اسم التخصص (عربي)" value={newSpecialization.name_ar} onChange={e => setNewSpecialization({...newSpecialization, name_ar: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" />
                                </div>
                                <textarea placeholder="وصف التخصص" value={newSpecialization.description_ar || ''} onChange={e => setNewSpecialization({...newSpecialization, description_ar: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" rows={2} />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-[#ee5239] hover:bg-[#d63d2a] text-white px-6 py-2 rounded font-bold flex-1">{editingSpecialization ? 'حفظ التعديلات' : 'إضافة التخصص'}</button>
                                    {editingSpecialization && <button type="button" onClick={() => {setEditingSpecialization(null); setNewSpecialization({page_id:'', name_ar:'', name_en:'', description_ar:'', description_en:''})}} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-bold">إلغاء</button>}
                                </div>
                            </form>
                        </div>

                        {/* List of Specializations */}
                        <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto mb-8 border border-gray-700 rounded p-2">
                             {specializations.map(spec => (
                                <div key={spec.id} className="bg-gray-800 p-3 rounded flex justify-between items-center">
                                    <div>
                                        <span className="font-bold text-[#ee5239] ml-2">[{spec.page?.name}]</span>
                                        <span>{spec.name_ar}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => {setEditingSpecialization(spec.id); setNewSpecialization({page_id: spec.page_id, name_ar: spec.name_ar, name_en: spec.name_en, description_ar: spec.description_ar, description_en: spec.description_en})}} className="text-blue-400"><Edit size={16} /></button>
                                        <button onClick={() => setDeleteModal({id: spec.id, type: 'specialization'})} className="text-red-400"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                             ))}
                        </div>

                        {/* 2. Clients Management */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 border-t-4 border-t-[#ee5239]">
                             <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-[#ee5239]" /> {editingClient ? 'تعديل بيانات عميل' : 'إضافة عميل جديد'}</h2>
                             <form onSubmit={editingClient ? handleUpdateClient : handleAddClient} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <select value={newClient.specialization_id} onChange={e => setNewClient({...newClient, specialization_id: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none">
                                        <option value="">اختر التخصص التابع له</option>
                                        {specializations.map(s => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                                    </select>
                                    <input type="text" placeholder="اسم العميل / المشروع" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" />
                                </div>
                                <div className="flex gap-4 items-center">
                                     <div className="flex-1">
                                         <label className="block text-sm text-gray-400 mb-1">شعار العميل / صورة المشروع</label>
                                         <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'client')} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ee5239] file:text-white hover:file:bg-[#d63d2a]" disabled={uploadingImage} />
                                     </div>
                                     {newClient.logo_url && <img src={newClient.logo_url} alt="Logo" className="w-16 h-16 object-cover rounded bg-white" />}
                                </div>
                                <textarea placeholder="وصف العميل / تفاصيل المشروع" value={newClient.description || ''} onChange={e => setNewClient({...newClient, description: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" rows={3} />
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-[#ee5239] hover:bg-[#d63d2a] text-white px-6 py-2 rounded font-bold flex-1" disabled={uploadingImage}>{editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}</button>
                                    {editingClient && <button type="button" onClick={() => {setEditingClient(null); setNewClient({name:'', description:'', logo_url:'', specialization_id:'', is_active: true})}} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-bold">إلغاء</button>}
                                </div>
                             </form>
                        </div>

                        {/* Clients List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {clients.map(client => (
                                <div key={client.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg flex gap-4 group hover:border-[#ee5239] transition-all">
                                    <div className="w-16 h-16 flex-shrink-0 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
                                        {client.logo_url ? <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" /> : <Users className="text-gray-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold">{client.name}</h3>
                                        <p className="text-xs text-[#ee5239] mb-1">{client.specialization?.name_ar}</p>
                                        <p className="text-xs text-gray-400 line-clamp-2">{client.description}</p>
                                        <div className="flex gap-2 mt-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {setEditingClient(client.id); setNewClient({name: client.name, description: client.description, logo_url: client.logo_url, specialization_id: client.specialization_id, is_active: client.is_active})}} className="text-blue-400"><Edit size={16} /></button>
                                            <button onClick={() => setDeleteModal({id: client.id, type: 'client'})} className="text-red-400"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Banners Tab */}
                {activeTab === 'banners' && (
                     <div className="space-y-8">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Image className="text-[#ee5239]" /> {editingBanner ? 'تعديل بانر' : 'إضافة بانر جديد'}</h2>
                            <form onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <input type="text" placeholder="عنوان البانر (اختياري)" value={newBanner.title || ''} onChange={e => setNewBanner({...newBanner, title: e.target.value})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none" />
                                     <select value={newBanner.page_id || ''} onChange={e => setNewBanner({...newBanner, page_id: e.target.value || null})} className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:border-[#ee5239] focus:outline-none">
                                         <option value="">عرض في الصفحة الرئيسية (افتراضي)</option>
                                         {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                     </select>
                                </div>
                                <div>
                                     <label className="block text-sm text-gray-400 mb-1">صورة البانر</label>
                                     <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ee5239] file:text-white hover:file:bg-[#d63d2a]" disabled={uploadingBannerImage} />
                                     {newBanner.image_url && <img src={newBanner.image_url} alt="Banner Preview" className="mt-2 w-full h-32 object-cover rounded border border-gray-600" />}
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="bg-[#ee5239] hover:bg-[#d63d2a] text-white px-6 py-2 rounded font-bold flex-1" disabled={uploadingBannerImage}>{editingBanner ? 'حفظ التعديلات' : 'إضافة البانر'}</button>
                                    {editingBanner && <button type="button" onClick={() => {setEditingBanner(null); setNewBanner({type:'image', title:'', description:'', image_url:'', page_id:''})}} className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-bold">إلغاء</button>}
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                             {banners.map(banner => (
                                <div key={banner.id} className="bg-gray-800 border border-gray-700 p-4 rounded-lg group hover:border-[#ee5239] transition-colors">
                                     <div className="relative h-32 mb-3 rounded overflow-hidden">
                                         <img src={banner.image_url || ''} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                                         <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                                             {banner.page ? banner.page.name : 'الرئيسية'}
                                         </div>
                                     </div>
                                     <div className="flex justify-between items-center">
                                         <h3 className="font-bold">{banner.title || 'بدون عنوان'}</h3>
                                         <div className="flex gap-2">
                                             <button onClick={() => {setEditingBanner(banner.id); setNewBanner({type: banner.type, title: banner.title, description: banner.description, image_url: banner.image_url, page_id: banner.page_id, is_active: banner.is_active})}} className="text-blue-400"><Edit size={18} /></button>
                                             <button onClick={() => setDeleteModal({id: banner.id, type: 'banner'})} className="text-red-400"><Trash2 size={18} /></button>
                                         </div>
                                     </div>
                                </div>
                             ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
    </div>
  );
}
