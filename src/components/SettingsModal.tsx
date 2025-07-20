import React, { useState } from 'react';
import { CloseIcon, SettingsIcon } from './ui/icons';
import { ThemeToggle } from './ui/theme-toggle';

interface SettingsOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  
  if (!isOpen) return null;
  
  const options: SettingsOption[] = [
    { id: 'general', label: 'عام', icon: <SettingsIcon className="h-5 w-5" /> },
    { id: 'appearance', label: 'المظهر', icon: <ThemeToggle /> },
    { id: 'notifications', label: 'الإشعارات', icon: <SettingsIcon className="h-5 w-5" /> },
    { id: 'privacy', label: 'الخصوصية', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-lg dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">الإعدادات</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-800">
            <nav className="space-y-1 p-4">
              {options.map((option) => (
                <button
                  key={option.id}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                    activeTab === option.id
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                  }`}
                  onClick={() => setActiveTab(option.id)}
                >
                  <span className="mr-3">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">الإعدادات العامة</h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      الاسم
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">المظهر</h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      وضع السمة
                    </label>
                    <div className="mt-2 flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="flex items-center">
                        <ThemeToggle />
                        <span className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                          تبديل بين الوضع الفاتح والمظلم
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">الإشعارات</h3>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">إشعارات البريد الإلكتروني</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        تلقي إشعارات عبر البريد الإلكتروني عند وجود رسائل جديدة
                      </p>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">الخصوصية والأمان</h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      إعادة تعيين كلمة المرور
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">حفظ محفوظات المحادثة</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        حفظ محفوظات المحادثات السابقة
                      </p>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                        id="save-history"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            إلغاء
          </button>
          <button
            type="button"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
}
