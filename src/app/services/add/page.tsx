'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { createService, ServiceFormData, SERVICE_CATEGORIES } from '@/models/Service';

export default function AddServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ServiceFormData>({
    service_category: SERVICE_CATEGORIES[0],
    name: '',
    description: '',
    price: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    location: '',
    available: true,
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('يرجى إدخال اسم الخدمة');
      return false;
    }
    
    if (!formData.service_category) {
      setError('يرجى اختيار فئة الخدمة');
      return false;
    }

    // التحقق من صحة رقم الهاتف إذا تم إدخاله
    if (formData.phone && !/^(\+?\d{8,15})$/.test(formData.phone.trim())) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return false;
    }

    // التحقق من صحة رقم الواتساب إذا تم إدخاله
    if (formData.whatsapp && !/^(\+?\d{8,15})$/.test(formData.whatsapp.trim())) {
      setError('يرجى إدخال رقم واتساب صحيح');
      return false;
    }

    // التحقق من صحة حساب الانستغرام إذا تم إدخاله
    if (formData.instagram && !/^@?([a-zA-Z0-9._]){1,30}$/.test(formData.instagram.trim())) {
      setError('يرجى إدخال اسم مستخدم انستغرام صحيح');
      return false;
    }

    // التحقق من صحة السعر إذا تم إدخاله
    if (formData.price && isNaN(Number(formData.price))) {
      setError('يرجى إدخال سعر صحيح');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // تنظيف البيانات قبل الإرسال
      const cleanedData: ServiceFormData = {
        ...formData,
        phone: formData.phone.trim() || '',
        whatsapp: formData.whatsapp.trim() || '',
        instagram: formData.instagram.trim().replace(/^@/, '') || '',
        price: formData.price ? Number(formData.price) : '',
        description: formData.description.trim() || '',
        location: formData.location.trim() || '',
      };
      
      await createService(cleanedData);
      
      setSuccess(true);
      
      // إعادة توجيه المستخدم بعد فترة قصيرة
      setTimeout(() => {
        router.push('/services');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating service:', err);
      setError('حدث خطأ أثناء إضافة الخدمة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">
            إضافة خدمة جديدة
          </h1>
          <Link
            href="/services"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="ml-2 h-4 w-4" />
            العودة
          </Link>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-l-4 border-black p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-black mb-2">
              تمت إضافة الخدمة بنجاح!
            </h2>
            <p className="text-black">
              سيتم توجيهك إلى صفحة الخدمات...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="bg-white border-r-4 border-black p-4 rounded-md">
                  <p className="text-sm text-black">{error}</p>
                </div>
              )}

              {/* معلومات الخدمة الأساسية */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">
                  معلومات الخدمة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                      اسم الخدمة <span className="text-black">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: تدريب شخصي للياقة البدنية"
                    />
                  </div>

                  <div>
                    <label htmlFor="service_category" className="block text-sm font-medium text-black mb-1">
                      فئة الخدمة <span className="text-black">*</span>
                    </label>
                    <select
                      id="service_category"
                      name="service_category"
                      value={formData.service_category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                    >
                      {SERVICE_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-black mb-1">
                      السعر (درهم)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: 100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                      وصف الخدمة
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="اكتب وصفاً مفصلاً للخدمة التي تقدمها..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-black mb-1">
                      الموقع
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: أبوظبي، المارينا"
                    />
                  </div>

                  <div>
                    <div className="flex items-center h-full">
                      <input
                        type="checkbox"
                        id="available"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="h-5 w-5 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <label htmlFor="available" className="mr-2 block text-sm font-medium text-black">
                        الخدمة متاحة حالياً
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات الاتصال */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-4">
                  معلومات الاتصال
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: +9715xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-black mb-1">
                      رقم الواتساب
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: +9715xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-black mb-1">
                      حساب انستغرام
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
                      placeholder="مثال: @username"
                    />
                  </div>
                </div>
              </div>

              {/* زر الإرسال */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </span>
                  ) : (
                    'إضافة الخدمة'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
