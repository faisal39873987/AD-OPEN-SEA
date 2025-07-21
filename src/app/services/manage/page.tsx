'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { fetchServices, deleteService, Service } from '@/models/Service';

export default function ManageServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const results = services.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredServices(results);
    }
  }, [searchQuery, services]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('فشل في تحميل الخدمات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setLoading(true);
      await deleteService(deleteId);
      setServices(prevServices => prevServices.filter(service => service.id !== deleteId));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('فشل في حذف الخدمة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleEditService = (id: string) => {
    router.push(`/services/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-black mb-4 md:mb-0">
            إدارة الخدمات
          </h1>
          <Link
            href="/services/add"
            className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <PlusIcon className="h-5 w-5 ml-2" />
            إضافة خدمة جديدة
          </Link>
        </div>

        {/* البحث */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في الخدمات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-transparent bg-white text-black"
              dir="rtl"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="bg-white border-r-4 border-black p-4 mb-6 rounded-md">
            <p className="text-sm text-black">{error}</p>
          </div>
        )}

        {loading && !error ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {filteredServices.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
                <p className="text-xl text-black mb-6">
                  {searchQuery 
                    ? 'لا توجد خدمات تطابق بحثك'
                    : 'لا توجد خدمات مضافة بعد'}
                </p>
                {!searchQuery && (
                  <Link
                    href="/services/add"
                    className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 ml-2" />
                    إضافة خدمة جديدة
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                        الخدمة
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                        الفئة
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                        السعر
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                        الحالة
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                        تاريخ الإضافة
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-black uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service) => (
                      <motion.tr 
                        key={service.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-black">
                                {service.name}
                              </div>
                              {service.location && (
                                <div className="text-sm text-gray-500">
                                  {service.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-black">
                            {service.service_category}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-black">
                            {service.price ? `${service.price} د.إ` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.available 
                              ? 'bg-white text-black border border-black'
                              : 'bg-white text-black border border-black'
                          }`}>
                            {service.available ? 'متاح' : 'غير متاح'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-black">
                          {new Date(service.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEditService(service.id)}
                              className="text-black hover:text-gray-800 transition-colors"
                              aria-label="تعديل"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(service.id)}
                              className="text-black hover:text-gray-800 transition-colors"
                              aria-label="حذف"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* نافذة تأكيد الحذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200"
            dir="rtl"
          >
            <h3 className="text-lg font-medium text-black mb-4">
              تأكيد الحذف
            </h3>
            <p className="text-black mb-6">
              هل أنت متأكد من رغبتك في حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={cancelDelete}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <XMarkIcon className="h-4 w-4 ml-2" />
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <TrashIcon className="h-4 w-4 ml-2" />
                حذف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
