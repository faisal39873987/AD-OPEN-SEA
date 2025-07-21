'use client';

import React, { useState, useEffect } from 'react';
import { X, User, LogOut, Settings, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscription: () => void;
}

const Sidebar = ({ isOpen, onClose, onOpenSubscription }: SidebarProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'none' | 'login' | 'register' | 'reset-password'>('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Reset form visibility when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setActiveSection('none');
      setAuthError(null);
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen]);

  // Real authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setActiveSection('none');
      setEmail('');
      setPassword('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setActiveSection('none');
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setAuthError(error.message);
    } else {
      setActiveSection('none');
      setEmail('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (activeSection === 'login') {
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">تسجيل الدخول</h3>
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              تسجيل الدخول
            </button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => setActiveSection('reset-password')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">ليس لديك حساب؟ </span>
              <button
                onClick={() => setActiveSection('register')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                إنشاء حساب جديد
              </button>
            </div>
          </div>
        </div>
      );
    } else if (activeSection === 'register') {
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إنشاء حساب جديد</h3>
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم الكامل"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              إنشاء حساب
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">لديك حساب بالفعل؟ </span>
            <button
              onClick={() => setActiveSection('login')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      );
    } else if (activeSection === 'reset-password') {
      return (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">إعادة تعيين كلمة المرور</h3>
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}
          <form onSubmit={handleResetPassword} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700"
            >
              إرسال رابط إعادة التعيين
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveSection('login')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              العودة لتسجيل الدخول
            </button>
          </div>
        </div>
      );
    }

    // Main sidebar content
    if (user) {
      return (
        <div className="p-6">
          <div className="flex items-center mb-6">
            <User className="w-10 h-10 text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full p-2" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">مرحباً بك</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={onOpenSubscription}
              className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <CreditCard className="w-5 h-5 mr-3" />
              الاشتراكات والخطط
            </button>
            
            <button className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              <Settings className="w-5 h-5 mr-3" />
              الإعدادات
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <LogOut className="w-5 h-5 mr-3" />
              تسجيل الخروج
            </button>
          </nav>
        </div>
      );
    } else {
      return (
        <div className="p-6">
          <div className="text-center mb-6">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">مرحباً بك في AD PLUS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">قم بتسجيل الدخول للوصول إلى جميع الميزات</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setActiveSection('login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setActiveSection('register')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              إنشاء حساب جديد
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={onOpenSubscription}
              className="w-full flex items-center justify-center px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              عرض الخطط والأسعار
            </button>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">القائمة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
