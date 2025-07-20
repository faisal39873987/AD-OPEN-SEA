'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fetchServiceById, updateService, ServiceFormData, SERVICE_CATEGORIES } from '@/models/Service';

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams();
  
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
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        if (typeof id !== 'string') {
          throw new Error('Invalid service ID');
        }
        const service = await fetchServiceById(id);
        
        if (!service) {
          throw new Error('Service not found');
        }
        
        setFormData({
          service_category: service.service_category,
          name: service.name,
          description: service.description || '',
          price: service.price?.toString() || '',
          phone: service.phone || '',
          whatsapp: service.whatsapp || '',
          instagram: service.instagram || '',
          location: service.location || '',
          available: service.available,
        });
      } catch (err) {
        console.error('Error loading service:', err);
        setError('فشل في تحميل بيانات الخدمة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

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
      setSaving(true);
      
      if (typeof id !== 'string') {
        throw new Error('Invalid service ID');
      }
      
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
      
      await updateService(id, cleanedData);
      
      setSuccess(true);
      
      // إعادة توجيه المستخدم بعد فترة قصيرة
      setTimeout(() => {
        router.push('/services/manage');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating service:', err);
      setError('حدث خطأ أثناء تحديث الخدمة. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تعديل خدمة
          </h1>
          <Link
            href="/services/manage"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="ml-2 h-4 w-4" />
            العودة
          </Link>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
              تم تحديث الخدمة بنجاح!
            </h2>
            <p className="text-green-700 dark:text-green-400">
              سيتم توجيهك إلى صفحة إدارة الخدمات...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-r-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* معلومات الخدمة الأساسية */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  معلومات الخدمة
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      اسم الخدمة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: تدريب شخصي للياقة البدنية"
                    />
                  </div>

                  <div>
                    <label htmlFor="service_category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      فئة الخدمة <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service_category"
                      name="service_category"
                      value={formData.service_category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      {SERVICE_CATEGORIES.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      السعر (درهم)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: 100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      وصف الخدمة
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="اكتب وصفاً مفصلاً للخدمة التي تقدمها..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      الموقع
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="h-5 w-5 text-black dark:text-white focus:ring-black dark:focus:ring-white border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="available" className="mr-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        الخدمة متاحة حالياً
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات الاتصال */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  معلومات الاتصال
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: +9715xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      رقم الواتساب
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: +9715xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      حساب انستغرام
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="مثال: @username"
                    />
                  </div>
                </div>
              </div>

              {/* زر الإرسال */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full py-3 px-4 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                    saving
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </span>
                  ) : (
                    'حفظ التغييرات'
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
