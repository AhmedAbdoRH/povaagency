import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Sparkles, Phone, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveCoreServicesWithPages } from '../data/coreServices';
import { useLanguage } from '../hooks/useLanguage';
import { toast } from 'react-toastify';

export default function CollaborationForm() {
  const { t, language } = useLanguage();
  const [pages, setPages] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .order('display_order', { ascending: true });
      setPages(data || []);
    };
    fetchPages();
  }, []);

  const services = resolveCoreServicesWithPages(pages);

  const toggleService = (slug: string) => {
    setSelectedServices(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('collaboration_requests').insert([
        {
          name: formData.name,
          phone: formData.phone,
          selected_services: selectedServices.map(slug => {
            const service = services.find(s => s.slug === slug);
            return language === 'ar' ? service?.title : (service?.page?.name_en || service?.title);
          }),
        },
      ]);

      if (error) throw error;

      // 2. Format WhatsApp Message
      const selectedServiceTitles = selectedServices.map(slug => {
        const service = services.find(s => s.slug === slug);
        return language === 'ar' ? service?.title : (service?.page?.name_en || service?.title);
      }).join(', ');

      const message = language === 'ar' 
        ? `مرحباً، أنا ${formData.name}. مهتم بالتعاون في الخدمات التالية: ${selectedServiceTitles}. رقم هاتفي: ${formData.phone}`
        : `Hello, I'm ${formData.name}. I'm interested in collaborating on: ${selectedServiceTitles}. My phone: ${formData.phone}`;

      const whatsappUrl = `https://wa.me/201503600455?text=${encodeURIComponent(message)}`;

      // 3. Success Feedback
      toast.success(language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Your request has been sent successfully!');
      
      // 4. Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');

      // Reset form
      setFormData({ name: '', phone: '' });
      setSelectedServices([]);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'Error sending request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="collaboration-form" className="relative py-24 bg-[#080c14] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent text-sm font-bold rounded-full px-5 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {language === 'ar' ? 'لنبدأ التعاون' : "Let's Collaborate"}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
            >
              {language === 'ar' ? 'حول فكرتك إلى واقع' : 'Turn Your Idea Into Reality'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              {language === 'ar' 
                ? 'املأ البيانات البسيطة أدناه وسيتواصل معك فريقنا المختص لبدء رحلة النجاح'
                : 'Fill in the simple details below and our expert team will contact you to start your success journey'}
            </motion.p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/80 text-sm font-bold px-1">
                    <User className="w-4 h-4 text-accent" />
                    {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'ar' ? 'أدخل اسمك هنا...' : 'Enter your name...'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-white/20"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-white/80 text-sm font-bold px-1">
                    <Phone className="w-4 h-4 text-accent" />
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={language === 'ar' ? '01xxxxxxxxx' : '01xxxxxxxxx'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-white/20 text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-6">
                <label className="block text-white/80 text-sm font-bold px-1">
                  {language === 'ar' ? 'اختر الخدمات المهتم بها:' : 'Choose interested services:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.slug}
                      type="button"
                      onClick={() => toggleService(service.slug)}
                      className={`group relative flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 ${
                        selectedServices.includes(service.slug)
                          ? 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(238,82,57,0.2)]'
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                        selectedServices.includes(service.slug)
                          ? 'bg-accent text-white border-white/20'
                          : `bg-white/5 ${service.iconColor} border-white/5 group-hover:scale-110`
                      }`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold text-center leading-tight transition-colors ${
                        selectedServices.includes(service.slug) ? 'text-white' : 'text-white/60 group-hover:text-white'
                      }`}>
                        {language === 'en' ? (service.page?.name_en || service.title) : service.title}
                      </span>
                      {selectedServices.includes(service.slug) && (
                        <div className="absolute -top-2 -right-2">
                          <CheckCircle2 className="w-5 h-5 text-accent fill-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group relative flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-white font-black text-xl py-6 rounded-[2rem] shadow-2xl shadow-accent/25 transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {language === 'ar' ? 'إرسال الطلب عبر WhatsApp' : 'Send Request via WhatsApp'}
                      <Send className="w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </button>
                <p className="text-center text-white/30 text-xs mt-6 font-medium">
                  {language === 'ar' 
                    ? 'سيتم تحويلك إلى تطبيق WhatsApp لإكمال إرسال البيانات'
                    : 'You will be redirected to WhatsApp to complete sending data'}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
