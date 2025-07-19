'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UpgradeIcon } from '@/components/ui/icons';

const pricingPlans = [
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    price: '10',
    features: [
      'محادثات غير محدودة',
      'وصول أساسي للذكاء الاصطناعي',
      'دعم عبر البريد الإلكتروني',
      'تخزين المحادثات لمدة 30 يوم',
    ],
  },
  {
    id: 'pro',
    name: 'الباقة الاحترافية',
    price: '25',
    features: [
      'كل ميزات الباقة الأساسية',
      'ذكاء اصطناعي متقدم',
      'أولوية في الدعم الفني',
      'تخزين المحادثات لمدة 90 يوم',
      'مساعد شخصي متخصص',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'باقة الشركات',
    price: '50',
    features: [
      'كل ميزات الباقة الاحترافية',
      'دعم فني متخصص على مدار الساعة',
      'تخزين المحادثات غير محدود',
      'واجهة برمجة التطبيقات المخصصة',
      'إعدادات أمان متقدمة',
      'تدريب مخصص للموظفين',
    ],
  },
];

export default function UpgradePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AD Pulse
          </Link>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link 
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              العودة للمحادثة
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            اختر الباقة المناسبة لاحتياجاتك
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            قم بترقية حسابك للوصول إلى ميزات متقدمة وتجربة محادثة أكثر ذكاءً
          </p>
        </div>

        {/* Pricing plans */}
        <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col overflow-hidden rounded-lg ${
                plan.popular
                  ? 'ring-2 ring-blue-600 dark:ring-blue-500'
                  : 'ring-1 ring-gray-200 dark:ring-gray-800'
              } bg-white shadow-lg transition-all hover:scale-105 dark:bg-gray-900`}
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="mr-2 text-gray-500 dark:text-gray-400">/ شهرياً</span>
                </div>
                {plan.popular && (
                  <p className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    الأكثر شعبية
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between bg-gray-50 px-6 py-8 dark:bg-gray-800">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-900 dark:text-white">المميزات</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="mr-3 text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-8 flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                      : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <UpgradeIcon className="mr-2 h-4 w-4" />
                  اشترك الآن
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">الأسئلة الشائعة</h2>
          <dl className="mt-8 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">هل يمكنني تغيير خطتي لاحقًا؟</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                نعم، يمكنك الترقية أو الخفض في أي وقت. سيتم تطبيق التغييرات في بداية دورة الفوترة التالية.
              </dd>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">هل هناك فترة تجريبية؟</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                نعم، نقدم فترة تجريبية مجانية لمدة 7 أيام للباقة الاحترافية. يمكنك الإلغاء في أي وقت خلال الفترة التجريبية.
              </dd>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">كيف يمكنني إلغاء اشتراكي؟</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة الإعدادات في حسابك. سيظل اشتراكك نشطًا حتى نهاية فترة الفوترة الحالية.
              </dd>
            </div>
          </dl>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AD Pulse. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
