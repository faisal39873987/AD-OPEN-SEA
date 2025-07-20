'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, HeartIcon, ClockIcon, MapPinIcon, PhoneIcon, ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { fetchServiceById, Service } from '@/models/Service';
import { motion } from 'framer-motion';

export default function ServiceDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        if (typeof id !== 'string') {
          throw new Error('Invalid service ID');
        }
        const data = await fetchServiceById(id);
        setService(data);
      } catch (err) {
        console.error('Error loading service:', err);
        setError('فشل في تحميل بيانات الخدمة. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // يمكن إضافة منطق لحفظ المفضلة في المستقبل
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.name || 'خدمة من أبوظبي أوبن سي',
          text: service?.description || 'شاهد هذه الخدمة على منصة أبوظبي أوبن سي',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // نسخ الرابط للحافظة كبديل
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط!');
    }
  };

  const contactWhatsApp = () => {
    if (service?.whatsapp) {
      // تنظيف رقم الهاتف من أي رموز إضافية
      const phoneNumber = service.whatsapp.replace(/\+/g, '').replace(/\s/g, '');
      // الرسالة الافتراضية
      const message = `مرحباً، أنا مهتم بخدمة "${service.name}" على منصة أبوظبي أوبن سي.`;
      // إنشاء رابط واتساب
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      // فتح الرابط في نافذة جديدة
      window.open(whatsappUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'الخدمة غير موجودة'}
          </h1>
          <Link
            href="/services"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 ml-2" />
            العودة إلى الخدمات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="-ml-0.5 ml-2 h-4 w-4" />
              العودة
            </button>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={toggleFavorite}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ShareIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {/* Service Header */}
          <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 ml-2">
                    {service.service_category}
                  </span>
                  <span className={`inline-flex h-3 w-3 rounded-full ${service.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    {service.available ? 'متاح' : 'غير متاح حالياً'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h1>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <ClockIcon className="h-4 w-4 ml-1" />
                  تم الإضافة في {new Date(service.created_at).toLocaleDateString('ar-EG')}
                </div>
              </div>
              
              {service.price && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">السعر</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{service.price} د.إ</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  وصف الخدمة
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {service.description || 'لا يوجد وصف متاح لهذه الخدمة.'}
                </p>
              </div>

              {/* يمكن إضافة المزيد من التفاصيل هنا في المستقبل */}
            </div>

            <div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  معلومات الاتصال
                </h3>
                
                {service.location && (
                  <div className="flex items-start mb-4">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">الموقع</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.location}</p>
                    </div>
                  </div>
                )}

                {service.phone && (
                  <div className="flex items-start mb-4">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">رقم الهاتف</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{service.phone}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {service.phone && (
                    <a
                      href={`tel:${service.phone}`}
                      className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <PhoneIcon className="h-5 w-5 ml-2" />
                      اتصال
                    </a>
                  )}
                  
                  {service.whatsapp && (
                    <button
                      onClick={contactWhatsApp}
                      className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 ml-2" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      تواصل عبر واتساب
                    </button>
                  )}
                  
                  {service.instagram && (
                    <a
                      href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 ml-2" fill="currentColor">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                      </svg>
                      متابعة على انستغرام
                    </a>
                  )}
                  
                  <Link
                    href={`/chat?service=${service.id}`}
                    className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 ml-2" />
                    استفسار عبر المنصة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Related Services - يمكن إضافتها لاحقاً */}
      </div>
    </div>
  );
}
