import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
// أزلنا Subcategory من الأنواع
import type { Category, Service, Banner } from '../types/database';
import { Trash2, Edit, Plus, Save, X, Upload, Image, Package } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// الدالة هذه لم تعد مستخدمة بعد إزالة روابط DST/EMB
// const transformGoogleDriveUrl = (url: string) => {
//   const match = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
//   if (match && match[1]) {
//     return `https://drive.google.com/uc?export=download&id=${match[1]}`;
//   }
//   return url;
// };

const lightGold = '#00BFFF';
const brownDark = '#3d2c1d';
const successGreen = '#228B22'; // Natural green color
const greenButtonClass = `bg-[${successGreen}] text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50`;
const greenTabClass = `bg-[${successGreen}] text-white shadow-lg border-b-4 border-[${successGreen}]`;
const greenTabInactiveClass = 'bg-black/20 text-white';


interface AdminDashboardProps {
  onSettingsUpdate?: () => void;
}

export default function AdminDashboard({ onSettingsUpdate }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  // أزلنا state التصنيفات الفرعية
  // const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingBackground, setRemovingBackground] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [editingService, setEditingService] = useState<number | null>(null);
  // أزلنا state اللوجو
  // const [uploadingLogo, setUploadingLogo] = useState(false);
  // const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  // أزلنا 'subcategory' من نوع المودال
  const [deleteModal, setDeleteModal] = useState<{ id: string | number; type: 'category' | 'service' | 'banner' } | null>(null);
  const [activeTab, setActiveTab] = useState<'services' | 'banners'>('services');

  // Remove BG switch state and original image backup (session only)
  const [removeBgSwitch, setRemoveBgSwitch] = useState(false);
  const [originalServiceImageUrl, setOriginalServiceImageUrl] = useState<string | null>(null);

  // أزلنا 'subcategories' من التاب
  const [servicesSubTab, setServicesSubTab] = useState<'services' | 'categories'>('services');
  // أزلنا تابات البانرات الفرعية
  // const [bannersSubTab, setBannersSubTab] = useState<'text' | 'image' | 'strip'>('image');

  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  // أزلنا state التصنيف الفرعي الجديد
  // const [newSubcategory, setNewSubcategory] = useState({ category_id: '', name_ar: '', name_en: '', description_ar: '' });
  
  // أزلنا الحقول غير المستخدمة
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    image_url: '',
    category_id: '',
    gallery: [] as string[],
    is_featured: false,
    // is_best_seller: false, // أزيل
    // price: 0, // أزيل
    // sale_price: null as number | null, // أزيل
    // dst_file_url: null as string | null, // أزيل
    // emb_file_url: null as string | null, // أزيل
  });
  // أزلنا state تعديل التصنيف الفرعي
  // const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  // const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  
  // أزلنا الحقول الخاصة بالبانر الشريطي والنصي
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    type: 'image',
    title: '', // يمكن استخدامه كـ alt text
    description: '', // اختياري
    image_url: '',
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // --- أضفنا الدوال المفقودة ---

  /**
   * دالة لضغط وتقليل أبعاد الصورة إذا تجاوزت حداً معيناً
   */
  const resizeImageIfNeeded = async (file: File, maxMegaBytes: number): Promise<File> => {
    const maxSize = maxMegaBytes * 1024 * 1024;
    if (file.size <= maxSize) {
      console.log('Image size is fine, skipping resize.');
      return file;
    }

    console.log(`Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB), resizing...`);

    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context not available'));

            let width = img.width;
            let height = img.height;
            const quality = 0.85; // جودة أعلى قليلاً
            
            // حساب الأبعاد الجديدة بناءً على نسبة الحجم
            // (file.size / maxSize) هو النسبة التي نريد تقليل المساحة بها
            const ratio = Math.sqrt(file.size / maxSize);
            width = Math.floor(width / ratio);
            height = Math.floor(height / ratio);

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Failed to create blob'));
                
                // نستخدم 'image/webp' لضغط أفضل وجودة جيدة
                const resizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                    type: 'image/webp',
                    lastModified: Date.now(),
                });
                
                console.log(`Image resized to: ${(resizedFile.size / 1024 / 1024).toFixed(2)}MB`);
                
                // حتى لو كانت لا تزال كبيرة، نقبلها لتجنب التكرار
                if (resizedFile.size > maxSize) {
                    console.warn('Image is still large after resize.');
                }
                
                resolve(resizedFile);
            }, 'image/webp', quality);
        };
        img.onerror = reject;
    });
  };

  /**
   * دالة عامة لرفع الصور (كانت مفقودة في الكود الأصلي)
   */
  const handleImageUpload = async (
      event: React.ChangeEvent<HTMLInputElement>,
      type: 'service' | 'banner'
  ) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const bucket = type === 'banner' ? 'banners' : 'services';
      if (type === 'service') setUploadingImage(true);
      if (type === 'banner') setUploadingBannerImage(true);

      try {
          if (!file.type.startsWith('image/')) throw new Error('الرجاء اختيار ملف صورة صالح');

          // استخدام دالة الضغط
          const processedFile = await resizeImageIfNeeded(file, 2); // ضغط حتى 2 ميجا

          const fileExt = processedFile.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(fileName, processedFile, { upsert: true });
              
          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
              .from(bucket)
              .getPublicUrl(fileName);

          if (type === 'service') {
              setNewService(prev => ({ ...prev, image_url: publicUrl }));
              setOriginalServiceImageUrl(publicUrl); // تخزين الأصلي قبل إزالة الخلفية
              setRemoveBgSwitch(false); // إعادة تعيين المفتاح
          } else if (type === 'banner') {
              setNewBanner(prev => ({ ...prev, image_url: publicUrl }));
          }
          setSuccessMsg('تم رفع الصورة بنجاح!');
      } catch (err: any) {
          setError(`خطأ في رفع الصورة: ${err.message}`);
      } finally {
          if (type === 'service') setUploadingImage(false);
          if (type === 'banner') setUploadingBannerImage(false);
          event.target.value = ''; // مسح قيمة المدخل
      }
  };

  // --- نهاية الدوال المضافة ---


  // Remove background from an existing image URL (uses same algorithm)
  async function removeBackgroundFromImageUrl(url: string): Promise<File> {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(null);
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('تعذر إنشاء سياق الرسم');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const dist = (r1:number,g1:number,b1:number,r2:number,g2:number,b2:number) => {
      const dr=r1-r2, dg=g1-g2, db=b1-b2;
      return Math.sqrt(dr*dr+dg*dg+db*db);
    };

    function avgCorner(x0:number, y0:number, w:number, h:number){
      let sr=0, sg=0, sb=0, c=0;
      for(let y=y0; y<y0+h; y++){
        for(let x=x0; x<x0+w; x++){
          const idx = (y*width + x) * 4;
          sr += data[idx]; sg += data[idx+1]; sb += data[idx+2]; c++;
        }
      }
      return [sr/c, sg/c, sb/c] as [number,number,number];
    }

    const sample = 10;
    const c1 = avgCorner(0, 0, sample, sample);
    const c2 = avgCorner(width-sample, 0, sample, sample);
    const c3 = avgCorner(0, height-sample, sample, sample);
    const c4 = avgCorner(width-sample, height-sample, sample, sample);
    const bg = [
      (c1[0]+c2[0]+c3[0]+c4[0])/4,
      (c1[1]+c2[1]+c3[1]+c4[1])/4,
      (c1[2]+c2[2]+c3[2]+c4[2])/4,
    ] as [number,number,number];

    const threshold = 60;
    const feather = 20;

    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r=d[i], g=d[i+1], b=d[i+2];
      const distance = dist(r,g,b,bg[0],bg[1],bg[2]);
      if (distance <= threshold) {
        d[i+3] = 0;
      } else if (distance <= threshold + feather) {
        const t = (distance - threshold) / feather;
        d[i+3] = Math.min(255, Math.max(0, Math.round(255 * t)));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('فشل إنشاء الصورة')), 'image/png');
    });
    return new File([blob], `${Date.now()}_bg_removed.png`, { type: 'image/png' });
  }

  const handleToggleRemoveBgSwitch = async (checked: boolean) => {
    if (!newService.image_url) return;
    if (checked) {
      setRemovingBackground(true);
      try {
        // نستخدم originalServiceImageUrl الذي تم تعيينه عند الرفع
        if (!originalServiceImageUrl) setOriginalServiceImageUrl(newService.image_url);
        const processed = await removeBackgroundFromImageUrl(originalServiceImageUrl || newService.image_url);
        const fileExt = processed.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('services')
          .upload(fileName, processed, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('services').getPublicUrl(fileName);
        setNewService(prev => ({ ...prev, image_url: publicUrl }));
        setRemoveBgSwitch(true);
        setSuccessMsg('تم تحويل الصورة إلى خلفية شفافة');
      } catch (err: any) {
        setRemoveBgSwitch(false);
        setError(`تعذر إزالة الخلفية: ${err.message}`);
      } finally {
        setRemovingBackground(false);
      }
    } else {
      // Revert to original in-session
      if (originalServiceImageUrl) {
        setNewService(prev => ({ ...prev, image_url: originalServiceImageUrl! }));
      }
      setRemoveBgSwitch(false);
    }
  };


  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        await checkAuth();
        await fetchData();
      } catch (err: any) {
        toast.error(`خطأ أثناء التهيئة: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);
  
  // UseEffect for showing toasts
  useEffect(() => {
    if (error) {
        toast.error(error);
        setError(null); // Reset error after showing
    }
  }, [error]);

  useEffect(() => {
    if (successMsg) {
        toast.success(successMsg);
        setSuccessMsg(null); // Reset success message after showing
    }
  }, [successMsg]);


  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });
      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`*, category:categories(*)`)
        .order('created_at', { ascending: false });
      if (servicesError) throw servicesError;
      setServices(servicesData || []);

      // أزلنا جلب التصنيفات الفرعية
      // const { data: subcatsData, error: subcatsError } = await supabase
      //   .from('subcategories')
      //   .select('*')
      //   .order('created_at', { ascending: false });
      // if (subcatsError) throw subcatsError;
      // setSubcategories(subcatsData || []);

      const { data: bannersData, error: bannersError } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false });
      if (bannersError) throw bannersError;
      setBanners(bannersData || []);
    } catch (err: any) {
      setError(`خطأ في جلب البيانات: ${err.message}`);
      setCategories([]);
      setServices([]);
      // setSubcategories([]); // أزيل
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError("اسم القسم مطلوب.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from('categories').insert([newCategory]);
      if (error) throw error;
      setNewCategory({ name: '', description: '' });
      await fetchData();
      setSuccessMsg("تمت إضافة القسم بنجاح!");
    } catch (err: any) {
      setError(`خطأ في إضافة القسم: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category.id);
    setNewCategory({ name: category.name, description: category.description || '' });
    const formElement = document.getElementById('category-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !newCategory.name.trim()) {
      setError("اسم القسم مطلوب.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newCategory.name, description: newCategory.description })
        .eq('id', editingCategory);
      if (error) throw error;

      setNewCategory({ name: '', description: '' });
      setEditingCategory(null);
      await fetchData();
      setSuccessMsg("تم تحديث القسم بنجاح!");
    } catch (err: any) {
      setError(`خطأ في تحديث القسم: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', description: '' });
  };

  const handleDeleteConfirmation = async () => {
    if (!deleteModal) return;

    setIsLoading(true);
    try {
      let message = "";
      if (deleteModal.type === 'category') {
        // First delete associated services
        await supabase.from('services').delete().eq('category_id', deleteModal.id);
        // Then delete the category
        await supabase.from('categories').delete().eq('id', deleteModal.id);
        message = "تم حذف القسم والمنتجات المرتبطة به.";
      } else if (deleteModal.type === 'service') {
        await supabase.from('services').delete().eq('id', deleteModal.id);
        message = "تم حذف المنتج بنجاح.";
      } else if (deleteModal.type === 'banner') {
        await supabase.from('banners').delete().eq('id', deleteModal.id);
        message = "تم حذف البانر بنجاح.";
      }
      // أزلنا حالة الحذف الخاصة بالتصنيف الفرعي
      // else if (deleteModal.type === 'subcategory') { ... }

      setDeleteModal(null);
      await fetchData();
      setSuccessMsg(message);
    } catch (err: any) {
      setError(`خطأ أثناء الحذف: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = (id: string) => setDeleteModal({ id, type: 'category' });
  const handleDeleteService = (id: number) => setDeleteModal({ id, type: 'service' });
  const handleDeleteBanner = (id: string) => setDeleteModal({ id, type: 'banner' });
  // أزلنا دالة حذف التصنيف الفرعي
  // const handleDeleteSubcategory = (id: string) => setDeleteModal({ id, type: 'subcategory' });
  
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newService.title.trim()) {
        setError("يجب اختيار قسم وتحديد عنوان للمنتج.");
        return;
    }
    setIsLoading(true);
    try {
      // تبسيط الكائن المرسل
        const serviceToAdd: Partial<Service> = {
            title: newService.title,
            description: newService.description,
            image_url: newService.image_url,
            category_id: selectedCategory,
            // subcategory_id: selectedSubcategory || null, // أزيل
            is_featured: newService.is_featured || false,
            // is_best_seller: newService.is_best_seller || false, // أزيل
            // price: newService.price, // أزيل
            // sale_price: newService.sale_price, // أزيل
            gallery: newService.gallery,
        };

        const { data: service, error } = await supabase.from('services').insert([serviceToAdd]).select();

        if (error) throw error;

        // Reset form
        setNewService({
            title: '',
            description: '',
            image_url: '',
            category_id: '',
            gallery: [],
            is_featured: false,
            // is_best_seller: false, // أزيل
            // price: 0, // أزيل
            // sale_price: null, // أزيل
        });
        setSelectedCategory('');
        // setSelectedSubcategory(''); // أزيل
        setOriginalServiceImageUrl(null);
        setRemoveBgSwitch(false);
        await fetchData();
        setSuccessMsg('تمت إضافة المنتج بنجاح');
    } catch (err: any) {
        setError(`خطأ في إضافة المنتج: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };


  const handleEditService = async (service: Service) => {
    setEditingService(service.id);

    // تبسيط الـ state
    setNewService({
      title: service.title,
      description: service.description || '',
      image_url: service.image_url || '',
      category_id: service.category_id || '',
      gallery: Array.isArray(service.gallery) ? service.gallery : [],
      is_featured: service.is_featured || false,
      // is_best_seller: service.is_best_seller || false, // أزيل
      // price: service.price || 0, // أزيل
      // sale_price: service.sale_price || null, // أزيل
      // dst_file_url: service.dst_file_url || '', // أزيل
      // emb_file_url: service.emb_file_url || '', // أزيل
    });

    setOriginalServiceImageUrl(service.image_url || null); // تخزين الصورة الأصلية للتعديل
    setRemoveBgSwitch(false); // إيقاف مفتاح إزالة الخلفية
    setSelectedCategory(service.category_id || '');
    // @ts-ignore - subcategory_id may exist in DB even if not in Service type
    // setSelectedSubcategory((service as any).subcategory_id || ''); // أزيل
    const formElement = document.getElementById('service-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !selectedCategory || !newService.title.trim()) {
      setError("يجب اختيار قسم وتحديد عنوان للمنتج.");
      return;
    }
    setIsLoading(true);
    try {
      // تبسيط كائن التحديث
      const serviceToUpdate: Partial<Service> = {
        title: newService.title,
        description: newService.description,
        image_url: newService.image_url,
        category_id: selectedCategory,
        // subcategory_id: selectedSubcategory || null, // أزيل
        is_featured: newService.is_featured || false,
        // is_best_seller: newService.is_best_seller || false, // أزيل
        // price: newService.price, // أزيل
        // sale_price: newService.sale_price, // أزيل
        gallery: newService.gallery,
        // dst_file_url: newService.dst_file_url, // أزيل
        // emb_file_url: newService.emb_file_url, // أزيل
      };

      const { error } = await supabase
        .from('services')
        .update(serviceToUpdate)
        .eq('id', editingService);
      if (error) throw error;

      setNewService({ 
        title: '', 
        description: '', 
        image_url: '', 
        category_id: '', 
        gallery: [],
        is_featured: false,
        // is_best_seller: false, // أزيل
        // price: 0, // أزيل
        // sale_price: null, // أزيل
      });
      setSelectedCategory('');
      // setSelectedSubcategory(''); // أزيل
      setEditingService(null);
        setOriginalServiceImageUrl(null);
        setRemoveBgSwitch(false);
      await fetchData();
      setSuccessMsg("تم تحديث المنتج بنجاح!");
    } catch (err: any) {
      setError(`خطأ في تحديث المنتج: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setNewService({ 
      title: '', 
      description: '', 
      image_url: '', 
      category_id: '', 
      gallery: [],
      is_featured: false,
      // is_best_seller: false, // أزيل
      // price: 0, // أزيل
      // sale_price: null, // أزيل
    });
    setSelectedCategory('');
    // setSelectedSubcategory(''); // أزيل
    setOriginalServiceImageUrl(null);
    setRemoveBgSwitch(false);
  };

  // أزلنا كل دوال CRUD الخاصة بالتصنيفات الفرعية
  // const handleAddSubcategory = ...
  // const handleEditSubcategory = ...
  // const handleUpdateSubcategory = ...
  // const handleCancelEditSubcategory = ...

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    // تبسيط التحقق للصور فقط
    if (!newBanner.image_url) {
      setError("صورة البانر مطلوبة.");
      return;
    }
    setIsLoading(true);
    try {
      // تبسيط كائن البانر
      const bannerData: any = {
        type: 'image', // دائماً صورة
        title: newBanner.title || null, // يستخدم كـ alt text
        description: newBanner.description || null,
        image_url: newBanner.image_url || null,
        is_active: true
      };

      // أزلنا منطق البانر الشريطي
      const { error } = await supabase.from('banners').insert([bannerData]);
      if (error) {
          throw error;
      }

      setNewBanner({
        type: 'image',
        title: '',
        description: '',
        image_url: '',
      });
      await fetchData();
      setSuccessMsg("تمت إضافة البانر بنجاح!");
    } catch (err: any) {
      setError(`خطأ في إضافة البانر: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner.id);
    // تبسيط الـ state
    setNewBanner({
      type: 'image',
      title: banner.title || '',
      description: banner.description || '',
      image_url: banner.image_url || '',
      is_active: banner.is_active,
    });
    const formElement = document.getElementById('banner-form');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    // تبسيط التحقق
    if (!newBanner.image_url) {
      setError("صورة البانر مطلوبة.");
      return;
    }

    setIsLoading(true);
    try {
      // تبسيط كائن التحديث
      const bannerData: any = {
        type: 'image',
        title: newBanner.title || null,
        description: newBanner.description || null,
        image_url: newBanner.image_url || null,
        is_active: newBanner.is_active
      };

      // أزلنا منطق البانر الشريطي
      const { error } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', editingBanner);
      if (error) {
        throw error;
      }

      setNewBanner({
        type: 'image',
        title: '',
        description: '',
        image_url: '',
      });
      setEditingBanner(null);
      await fetchData();
      setSuccessMsg("تم تحديث البانر بنجاح!");
    } catch (err: any) {
      setError(`خطأ في تحديث البانر: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditBanner = () => {
    setEditingBanner(null);
    setNewBanner({
      type: 'image',
      title: '',
      description: '',
      image_url: '',
    });
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    navigate('/admin/login');
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        // استخدام دالة الضغط
        const processedFile = await resizeImageIfNeeded(file, 2);
        const fileExt = processedFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('services') // معرض الصور يتبع الخدمات
          .upload(fileName, processedFile, { upsert: true });
        if (uploadError) {
            toast.warn(`فشل رفع الصورة: ${file.name}`);
            continue;
        }
        const { data: { publicUrl } } = supabase.storage
          .from('services')
          .getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
      setNewService(prev => {
        const gallery = [...(prev.gallery || []), ...uploadedUrls].filter(Boolean);
        const filteredGallery = Array.from(new Set(gallery)).filter(img => img !== prev.image_url);
        return { ...prev, gallery: filteredGallery };
      });
      if(uploadedUrls.length > 0) setSuccessMsg(`تم رفع ${uploadedUrls.length} صورة بنجاح!`);
    } catch (err: any) {
      setError(`خطأ في رفع الصور: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };


  if (isLoading && categories.length === 0 && services.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ee5239] mx-auto"></div>
            <p className="text-xl mt-4">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-[Cairo] relative"
      style={{
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        color: "#fff"
      }}
      dir="rtl"
    >
      <ToastContainer 
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{ 
          backgroundColor: '#1f2937',
          color: '#fff',
          borderRadius: '8px',
          border: '1px solid #4b5563',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      />
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">تأكيد الحذف</h2>
            <p className="text-gray-300 mb-6">
              {deleteModal.type === 'category'
                ? 'هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع المنتجات المرتبطة به بشكل نهائي.'
                : deleteModal.type === 'banner'
                ? 'هل أنت متأكد من حذف هذا البانر؟'
                : 'هل أنت متأكد من حذف هذا المنتج؟'}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirmation}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'جاري الحذف...' : 'تأكيد الحذف'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black/60 backdrop-blur-sm shadow-lg sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold text-[#ee5239]`}>لوحة التحكم</h1>
          {isLoading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ee5239]"></div>}
          <button
            onClick={handleLogout}
            className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            تسجيل خروج
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Side Tabs */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-300 transform
                ${activeTab === 'services'
                  ? 'bg-[#ee5239] text-white shadow-lg -translate-y-1'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}}`}
            >
              <Package className="h-5 w-5" />
              <span>إدارة الخدمات</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('banners');
                // إعادة تعيين فورم البانر عند الضغط على التاب
                setEditingBanner(null);
                setNewBanner({ type: 'image', title: '', description: '', image_url: '' });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all duration-300 transform
                ${activeTab === 'banners'
                  ? 'bg-[#ee5239] text-white shadow-lg -translate-y-1'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <Image className="h-5 w-5" />
              <span>البانرات</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Header for Products, Banners, Testimonials, Store */}
            <div className="mb-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {/* خطأ مطبعي في الكود الأصلي، تم تصحيحه إلى 'services' */}
                            {activeTab === 'services' && <><Package className="w-7 h-7 text-[#ee5239]" /> إدارة الخدمات</>}
                            {activeTab === 'banners' && <><Image className="w-7 h-7 text-[#ee5239]" /> إدارة البانرات</>}
                        </h2>
                        <p className="text-gray-400 mt-1 text-sm">
                        {/* خطأ مطبعي في الكود الأصلي، تم تصحيحه إلى 'services' */}
                            {activeTab === 'services' && 'إدارة الخدمات والأقسام المرتبطة بها.'}
                            {activeTab === 'banners' && 'إضافة أو حذف بانرات الصور.'}
                        </p>
                    </div>
                     <div className="flex items-center gap-2 text-xs font-bold">
                        {activeTab === 'services' && <>
                            <span className="bg-[#ee5239]/20 text-[#ee5239] px-3 py-1 rounded-full">{services.length} خدمة</span>
                            <span className="bg-[#ee5239]/20 text-[#ee5239] px-3 py-1 rounded-full">{categories.length} قسم</span>
                        </>}
                        {/* قمنا بتصفية البانرات من نوع 'image' فقط */}
                        {activeTab === 'banners' && <span className="bg-[#ee5239]/20 text-[#ee5239] px-3 py-1 rounded-full">{banners.filter(b => b.type === 'image').length} بانر</span>}
                    </div>
                </div>
            </div>

            {/* تم إزالة جزء من الكود هنا كان مكرراً وخاطئاً */}
            
            {activeTab === 'banners' && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="p-6">
              {/* أزلنا تابات البانرات الفرعية */}
                  {/* <div className="flex border-b border-gray-700 mb-6"> ... </div> */}
                  
                  <form id="banner-form" onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner} className="mb-10 space-y-4">
                {/* أزلنا فورم البانر النصي والشريطي، أبقينا على فورم الصور فقط */}
                    <div>
                      <input
                          type="text"
                          placeholder="عنوان البانر (اختياري - لـ SEO)"
                          value={newBanner.title || ''}
                          onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                          className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239]"
                          disabled={isLoading}
                        />
                        <div className="flex justify-start mb-2 gap-1 mt-4">
                          <a 
                            id="canva-banner-button"
                            href="https://www.canva.com/design/DAG2t7Uv1-4/wGKApWY4sgW9y5HGINGJsA/edit" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-l from-[#ee5239] to-[#d63d2a] text-white hover:from-[#d63d2a] hover:to-[#c02e1a] transition-all flex items-center gap-0.5"
                            title="إنشاء / تعديل بانر باستخدام كانفا"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>
انشاء / تعديل بانر على كانفا                          </a>

                        </div>
                        <label htmlFor="banner-image-upload" className={`w-full flex flex-col items-center justify-center p-4 rounded-md border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-700/50 hover:border-[#ee5239] transition-colors ${uploadingBannerImage || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload className={`w-8 h-8 mb-2 text-[#ee5239] ${uploadingBannerImage ? 'animate-pulse' : ''}`} />
                            <span className="text-white font-semibold">{uploadingBannerImage ? 'جاري رفع الصورة...' : (newBanner.image_url ? 'تغيير الصورة' : 'اختر صورة للبانر')}</span>
                            <span className="text-xs text-gray-500 mt-1">المقاس الموصى به: 1920x700 بكسل</span>
                        </label>
                         <input
                          type="file"
                          accept="image/*"
                         // استخدام الدالة المضافة
                          onChange={(e) => handleImageUpload(e, 'banner')}
                          className="hidden"
                          id="banner-image-upload"
                          disabled={uploadingBannerImage || isLoading}
                        />
                        {newBanner.image_url && !uploadingBannerImage && (
                          <div className="mt-3 flex items-center justify-center gap-4 bg-gray-900/50 p-2 rounded border border-gray-700">
                            <img src={newBanner.image_url} alt="معاينة" className="w-24 h-auto object-cover rounded border border-gray-600" />
                            <span className="text-gray-400 text-xs">صورة البانر الحالية/الجديدة</span>
                            <button type="button" onClick={() => setNewBanner({...newBanner, image_url: ''})} className="text-red-500 hover:text-red-400 p-1" title="إزالة الصورة"><X size={16}/></button>
                          </div>
                        )}
                      </div>

                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-grow bg-[#ee5239] text-white py-2.5 px-4 rounded-md font-bold hover:bg-[#d63d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50" disabled={isLoading}>
                        {editingBanner ? <><Save size={20} /> حفظ التعديلات</> : <><Plus size={20} /> إضافة بانر</>}
                      </button>
                      {editingBanner && (
                        <button type="button" onClick={handleCancelEditBanner} className="bg-gray-600 text-white px-4 py-2.5 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2 font-bold" disabled={isLoading}>
                          <X size={20} /> إلغاء
                        </button>
                      )}
                    </div>
                  </form>
                  
                  <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">البانرات الحالية (صور فقط)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* فلترة لعرض بانرات الصور فقط */}
                    {!isLoading && banners.filter(b => b.type === 'image').length === 0 && <div className="col-span-full text-gray-400 text-center py-8">لا توجد بانرات صور.</div>}
                    
                    {banners.filter(b => b.type === 'image').map((banner) => (
                      <div key={banner.id} className={`relative group border border-gray-700 rounded-lg bg-gray-900/50 shadow-lg overflow-hidden ${editingBanner === banner.id ? `ring-2 ring-[#ee5239]` : ''}`}>
                        {banner.image_url ? (
                          <img src={banner.image_url} alt={banner.title || 'صورة البانر'} className="w-full h-32 object-cover"/>
                        ) : (
                          <div className="p-4 h-32 flex items-center justify-center">
                            <h4 className="font-bold text-gray-400 text-lg truncate"> (لا توجد صورة) {banner.title}</h4>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => !isLoading && handleEditBanner(banner)} title="تعديل" className="bg-[#ee5239] text-white p-2 rounded-full disabled:opacity-50" disabled={editingBanner === banner.id || isLoading}><Edit size={16} /></button>
                          <button onClick={() => !isLoading && handleDeleteBanner(banner.id)} title="حذف" className="bg-red-600 text-white p-2 rounded-full disabled:opacity-50" disabled={isLoading}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'services' && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
                <div className="p-6">
                  <div className="flex border-b border-gray-700 mb-6">
                    <button onClick={() => setServicesSubTab('services')} className={`flex-1 py-2 font-bold transition-colors rounded-t-md ${servicesSubTab === 'services' ? 'bg-[#ee5239] text-white' : 'text-gray-400 hover:bg-gray-700'}`}>الخدمات</button>
                    <button onClick={() => setServicesSubTab('categories')} className={`flex-1 py-2 font-bold transition-colors rounded-t-md ${servicesSubTab === 'categories' ? 'bg-[#ee5239] text-white' : 'text-gray-400 hover:bg-gray-700'}`}>الأقسام</button>
                    {/* أزلنا زر التصنيفات الفرعية */}
                    {/* <button onClick={() => setServicesSubTab('subcategories')} ...>التصنيفات الفرعية</button> */}
                  </div>

                  {servicesSubTab === 'services' && (
                    <>
                      <form onSubmit={editingService ? handleUpdateService : handleAddService} className="mb-8 space-y-4" id="service-form">
                        <input type="text" placeholder="عنوان الخدمة" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239]" required disabled={isLoading}/>
                        <textarea placeholder="وصف الخدمة (اختياري)" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} rows={3} className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239]" disabled={isLoading}/>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label htmlFor="image-upload" className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-md border-2 border-dashed border-gray-600 cursor-pointer hover:bg-gray-700/50 hover:border-[#ee5239] transition-colors ${uploadingImage || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Upload className={`w-8 h-8 mb-2 text-[#ee5239] ${uploadingImage ? 'animate-pulse' : ''}`} />
                                    <span className="text-white text-center text-sm font-semibold">{uploadingImage ? 'جاري الرفع...' : 'رفع صورة (عادي)'}</span>
                                </label>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'service')} className="hidden" id="image-upload" disabled={uploadingImage || isLoading}/>
                          </div>
                        </div>

                        {/* مفتاح تحويل الصورة إلى خلفية شفافة أسفل المعاينة */}

                        {newService.image_url && !uploadingImage && (
                          <>
                            <div className="mt-3 flex items-center justify-center gap-4 bg-gray-900/50 p-2 rounded border border-gray-700">
                              <img src={newService.image_url} alt="معاينة" className="w-16 h-16 object-cover rounded border border-gray-600" />
                              <span className="text-gray-400 text-xs">الصورة الحالية/الجديدة</span>
                              <button type="button" onClick={() => { setNewService({...newService, image_url: ''}); setRemoveBgSwitch(false); setOriginalServiceImageUrl(null); }} className="text-red-500 hover:text-red-400 p-1" title="إزالة الصورة"><X size={16}/></button>
                            </div>
                          {/* فقط نعرض المفتاح إذا كان لدينا صورة أصلية */}
                            {originalServiceImageUrl && (
                              <div className="mt-2 flex items-center justify-center">
                                  <label className="flex items-center gap-2 text-xs text-gray-300 select-none">
                                    {/* صندوق تحديد بسيط على يمين النص مع RTL */}
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 accent-emerald-500 rounded border border-gray-500 bg-gray-700 focus:ring-0"
                                      checked={removeBgSwitch}
                                      onChange={(e) => handleToggleRemoveBgSwitch(e.target.checked)}
                                      disabled={removingBackground || isLoading}
                                    />
                                    <span className="leading-none">بدون خلفية</span>
                                    {removingBackground && <span className="text-[10px] text-gray-400">جاري المعالجة...</span>}
                                  </label>
                                </div>
                            )}
                          </>
                        )}
                        
                        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); }} className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239] appearance-none" required disabled={isLoading || categories.length === 0}>
                          <option value="" disabled className="text-gray-400">-- اختر القسم --</option>
                          {categories.map((category) => (<option key={category.id} value={category.id} className="bg-gray-800 text-white">{category.name}</option>))}
                          {categories.length === 0 && <option disabled>لا توجد أقسام، يرجى إضافة قسم أولاً.</option>}
                        </select>
                        {/* أزلنا select التصنيف الفرعي */}
                        
                        {/* أزلنا حقول السعر */}

                        {/* أزلنا حقول ملفات DST/EMB */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-md">
                                <input type="checkbox" id="is_featured" checked={newService.is_featured || false} onChange={(e) => setNewService({ ...newService, is_featured: e.target.checked })} className="h-4 w-4 accent-[#ee5239]"/>
                                <label htmlFor="is_featured" className="text-white">أحدث العروض</label>
                            </div>
                            {/* أزلنا "الأكثر مبيعاً" */}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">صور إضافية للمنتج <span className="text-gray-400">(اختياري)</span></label>
                          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" disabled={uploadingImage || isLoading}/>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newService.gallery && newService.gallery.map((img, idx) => (
                              <div key={img} className="relative group">
                                <img src={img} alt={`صورة إضافية ${idx + 1}`} className="w-16 h-16 object-cover rounded border-2 border-gray-600"/>
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button type="button" className="text-white" onClick={() => setNewService(prev => ({ ...prev, gallery: prev.gallery.filter((g) => g !== img) }))} title="حذف الصورة">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button type="submit" className="flex-grow bg-[#ee5239] text-white py-2.5 px-4 rounded-md font-bold hover:bg-[#d63d2a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50" disabled={isLoading || (editingService ? false : !selectedCategory)}>
                            {editingService ? <><Save size={20} /> حفظ التعديلات</> : <><Plus size={20} /> إضافة المنتج</>}
                          </button>
                          {editingService && (
                            <button type="button" onClick={handleCancelEdit} className="bg-gray-600 text-white px-4 py-2.5 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2 font-bold" disabled={isLoading}>
                              <X size={20} /> إلغاء
                        </button>
                      )}
                    </div>
                  </form>

                  <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">المنتجات الحالية</h3>
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div key={service.id} className={`p-4 rounded-md bg-gray-900/50 border border-gray-700 transition-all ${editingService === service.id ? 'ring-2 ring-[#ee5239]' : ''}`}>
                            <div className="flex items-center gap-4">
                              {service.image_url && <img src={service.image_url} alt={service.title} className="w-16 h-16 object-cover rounded-md border border-gray-600 flex-shrink-0"/>}
                              <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-white text-lg truncate">{service.title}</h4>
                                <div className="text-xs text-gray-400 mb-1">{service.category?.name || 'قسم غير محدد'}</div>
                                {/* أزلنا عرض السعر */}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => !isLoading && handleEditService(service)} title="تعديل" className="text-[#ee5239] hover:text-[#ee5239] p-2 disabled:opacity-50" disabled={editingService === service.id || isLoading}><Edit size={18} /></button>
                                <button onClick={() => !isLoading && handleDeleteService(service.id)} title="حذف" className="text-red-500 hover:text-red-400 p-2 disabled:opacity-50" disabled={isLoading}><Trash2 size={18} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* أزلنا بلوك التصنيفات الفرعية */}
                  {/* {servicesSubTab === 'subcategories' && ( ... )} */}

                  {servicesSubTab === 'categories' && (
                    <>
                      <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="mb-8 space-y-4" id="category-form">
                      <input type="text" placeholder="اسم القسم" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239]" required disabled={isLoading}/>
                      <textarea placeholder="وصف القسم (اختياري)" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} rows={3} className="w-full p-3 rounded text-white bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ee5239]" disabled={isLoading}/>
                      <div className="flex gap-3">
                        <button type="submit" className="flex-grow bg-[#ee5239] text-white py-2.5 px-4 rounded-md font-bold hover:bg-[#d63d2a] flex items-center justify-center gap-2 disabled:opacity-50" disabled={isLoading}>
                          {editingCategory ? <><Save size={20} /> حفظ التعديلات</> : <><Plus size={20} /> إضافة قسم</>}
                          </button>
                          {editingCategory && (
                            <button type="button" onClick={handleCancelEditCategory} className="bg-gray-600 text-white px-4 py-2.5 rounded-md hover:bg-gray-700 flex items-center justify-center gap-2 font-bold" disabled={isLoading}>
                              <X size={20} /> إلغاء
                            </button>
                          )}
                        </div>
                      </form>

                      <h3 className="text-lg font-semibold mb-4 text-white border-b border-gray-600 pb-2">الأقسام الحالية</h3>
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category.id} className={`p-4 rounded-md bg-gray-900/50 border border-gray-700 flex justify-between items-center transition-all ${editingCategory === category.id ? 'ring-2 ring-[#ee5239]' : ''}`}>
                            <div className="flex-1 overflow-hidden">
                              <h4 className="font-bold text-white text-lg truncate">{category.name}</h4>
                              {category.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{category.description}</p>}
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => !isLoading && handleEditCategory(category)} title="تعديل" className="text-[#ee5239] hover:text-[#ee5239] p-2 disabled:opacity-50" disabled={editingCategory === category.id || isLoading}><Edit size={18} /></button>
                              <button onClick={() => !isLoading && handleDeleteCategory(category.id)} title="حذف" className="text-red-500 hover:text-red-400 p-2 disabled:opacity-50" disabled={isLoading}><Trash2 size={18} /></button>
                              {/* أزلنا زر إضافة تصنيف فرعي */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="w-full flex justify-center py-8 mt-10">
        <button
          onClick={() => { window.location.href = '/'; }}
          className="bg-white/10 backdrop-blur-md text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-colors border border-white/20 hover:bg-white/20"
        >
          ← العودة للصفحة الرئيسية
        </button>
      </footer>
    </div> 
  );
}