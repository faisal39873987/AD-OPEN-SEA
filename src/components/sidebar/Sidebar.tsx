'use client';

import React, { useState, useEffect } from 'react';
import { X, User, LogOut, Settings, CreditCard, Key, RefreshCw } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscription: () => void;
}

const Sidebar = ({ isOpen, onClose, onOpenSubscription }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<'none' | 'login' | 'register' | 'reset-password'>('none');
  
  // Reset form visibility when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setActiveSection('none');
    }
  }, [isOpen]);

  // Mock login/logout functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setActiveSection('none');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (activeSection === 'login') {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">تسجيل الدخول</h3>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSection('reset-password')}
                className="text-sm text-gray-600 hover:text-black"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              تسجيل الدخول
            </button>
          </form>
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveSection('register')}
              className="text-sm text-gray-600 hover:text-black"
            >
              ليس لديك حساب؟ سجل الآن
            </button>
          </div>
        </div>
      );
    } else if (activeSection === 'register') {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">إنشاء حساب جديد</h3>
          <form className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="reg-email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <input
                type="password"
                id="reg-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              إنشاء حساب
            </button>
          </form>
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveSection('login')}
              className="text-sm text-gray-600 hover:text-black"
            >
              لديك حساب بالفعل؟ تسجيل الدخول
            </button>
          </div>
        </div>
      );
    } else if (activeSection === 'reset-password') {
      return (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">إعادة تعيين كلمة المرور</h3>
          <form className="space-y-3">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="reset-email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
            >
              إرسال رابط إعادة التعيين
            </button>
          </form>
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveSection('login')}
              className="text-sm text-gray-600 hover:text-black"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      );
    } else {
      if (isLoggedIn) {
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <User size={24} className="text-gray-700" />
                <div>
                  <h3 className="font-medium">اسم المستخدم</h3>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={onOpenSubscription}
                className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <CreditCard size={20} className="mr-3 text-gray-700" />
                <span>الاشتراك والدفع</span>
              </button>
              
              <button
                className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Settings size={20} className="mr-3 text-gray-700" />
                <span>الإعدادات</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} className="mr-3 text-gray-700" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-4">
            <div className="text-center py-6">
              <User size={48} className="mx-auto mb-2 text-gray-400" />
              <h3 className="font-medium mb-2">قم بتسجيل الدخول للوصول إلى جميع الميزات</h3>
              <p className="text-sm text-gray-500 mb-4">أنشئ حساباً مجانياً أو قم بتسجيل الدخول للاستفادة من جميع خدمات AD PLUS Assistant</p>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('login')}
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                >
                  تسجيل الدخول
                </button>
                
                <button
                  onClick={() => setActiveSection('register')}
                  className="w-full bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  إنشاء حساب جديد
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={onOpenSubscription}
                className="flex items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <CreditCard size={20} className="mr-3 text-gray-700" />
                <span>استعراض خطط الاشتراك</span>
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      {/* Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
        aria-label="Sidebar"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-xl">القائمة</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          AD PLUS Assistant © {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
