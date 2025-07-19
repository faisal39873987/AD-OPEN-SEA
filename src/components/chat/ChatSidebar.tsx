'use client';

import React, { useState } from 'react';
import { X, User, LogOut, Settings, CreditCard, Key } from 'lucide-react';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscription: () => void;
}

const ChatSidebar = ({ isOpen, onClose, onOpenSubscription }: ChatSidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

  // Mock login state and functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Reset form visibility when sidebar closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowLoginForm(false);
      setShowRegisterForm(false);
      setShowResetPasswordForm(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-white shadow-lg transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
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
          {!isLoggedIn ? (
            /* User not logged in */
            <>
              {showLoginForm ? (
                /* Login Form */
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
                        onClick={() => {
                          setShowLoginForm(false);
                          setShowResetPasswordForm(true);
                        }}
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
                      onClick={() => {
                        setShowLoginForm(false);
                        setShowRegisterForm(true);
                      }}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      ليس لديك حساب؟ سجل الآن
                    </button>
                  </div>
                </div>
              ) : showRegisterForm ? (
                /* Register Form */
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
                      onClick={() => {
                        setShowRegisterForm(false);
                        setShowLoginForm(true);
                      }}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      لديك حساب بالفعل؟ تسجيل الدخول
                    </button>
                  </div>
                </div>
              ) : showResetPasswordForm ? (
                /* Reset Password Form */
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
                      onClick={() => {
                        setShowResetPasswordForm(false);
                        setShowLoginForm(true);
                      }}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      العودة إلى تسجيل الدخول
                    </button>
                  </div>
                </div>
              ) : (
                /* Menu when not logged in and no forms shown */
                <div className="space-y-4">
                  <button
                    onClick={() => setShowLoginForm(true)}
                    className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                    dir="rtl"
                  >
                    <User size={20} />
                    <span>تسجيل الدخول</span>
                  </button>
                  <button
                    onClick={() => setShowRegisterForm(true)}
                    className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                    dir="rtl"
                  >
                    <User size={20} />
                    <span>إنشاء حساب جديد</span>
                  </button>
                  <button
                    onClick={onOpenSubscription}
                    className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                    dir="rtl"
                  >
                    <CreditCard size={20} />
                    <span>خطط الاشتراك</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* User logged in */
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">مرحبًا، المستخدم</div>
                <div className="text-sm text-gray-600">user@example.com</div>
              </div>
              
              <button
                onClick={onOpenSubscription}
                className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                dir="rtl"
              >
                <CreditCard size={20} />
                <span>الاشتراكات والمدفوعات</span>
              </button>
              
              <button
                className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                dir="rtl"
              >
                <Settings size={20} />
                <span>الإعدادات</span>
              </button>
              
              <button
                onClick={() => setShowResetPasswordForm(true)}
                className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors"
                dir="rtl"
              >
                <Key size={20} />
                <span>تغيير كلمة المرور</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 space-x-reverse w-full p-3 rounded-md hover:bg-gray-100 transition-colors text-red-600"
                dir="rtl"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 text-center">
            AD PLUS Assistant © 2025
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
