import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DesignRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    designType: '',
    description: '',
    files: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.designType || !formData.description) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call or email sending
    setTimeout(() => {
      const emailContent = `
        اسم العميل: ${formData.name}
        رقم الجوال: ${formData.phone}
        نوع الخدمة: ${formData.designType}
        وصف الطلب: ${formData.description}
        عدد الملفات: ${formData.files.length}
      `;

      const subject = `طلب خدمة جديد - ${formData.designType}`;
      const mailtoLink = `mailto:RehlatHadaf@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;

      window.location.href = mailtoLink;
      setIsSubmitting(false);
      setFormData({ name: '', phone: '', designType: '', description: '', files: [] });
    }, 1500);
  };

  const designTypes = ['هوية بصرية', 'موشن جرافيك', 'إدارة سوشيال ميديا', 'تصميم ويب', 'إنتاج فيديو', 'أخرى'];

  return (
    <>
      <Helmet>
        <title>اطلب خدمتك - POVA Agency</title>
        <meta name="description" content="اطلب خدمات التسويق الرقمي، التصميم، والموشن جرافيك من POVA Agency." />
      </Helmet>

      <div className="min-h-screen bg-primary pt-24 pb-20">
        <div className="container mx-auto px-4">

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold text-white mb-4"
              >
                ابدأ مشروعك <span className="text-accent">الآن</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-lg"
              >
                أخبرنا عن احتياجاتك وسيقوم فريقنا بتحويلها إلى واقع إبداعي
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-secondary rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Personal Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium">الاسم بالكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                      placeholder="الاسم الكريم"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium">رقم الجوال</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                      placeholder="05xxxxxxxx"
                    />
                  </div>
                </div>

                {/* Service Type */}
                <div className="space-y-4">
                  <label className="text-gray-300 font-medium block">نوع الخدمة المطلوبة</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {designTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, designType: type }))}
                        className={`py-3 px-4 rounded-xl border transition-all duration-200 font-medium ${formData.designType === type
                          ? 'bg-accent text-white border-accent'
                          : 'bg-primary text-gray-400 border-gray-700 hover:border-gray-500'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium">تفاصيل المشروع</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
                    placeholder="اشرح لنا فكرتك، أهدافك، وأي تفاصيل مهمة..."
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <label className="text-gray-300 font-medium block">ملفات مرفقة (اختياري)</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">اسحب الملفات هنا أو اضغط للرفع</p>
                    <p className="text-sm text-gray-600 mt-2">الحد الأقصى 10 ميجابايت</p>
                  </div>

                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-primary p-3 rounded-lg border border-gray-700">
                          <span className="text-sm text-gray-300 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال الطلب
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>

              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignRequest;
