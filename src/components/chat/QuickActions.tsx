'use client';

import React from 'react';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  const quickActions = [
    { label: 'مدربين شخصيين', query: 'أريد معلومات عن المدربين الشخصيين المتاحين' },
    { label: 'تأجير يخوت', query: 'ما هي خيارات تأجير اليخوت المتاحة؟' },
    { label: 'شقق للإيجار', query: 'أبحث عن شقق للإيجار في أبوظبي' },
    { label: 'عيادات تجميل', query: 'أين أجد أفضل عيادات التجميل؟' },
    { label: 'خدمات أطفال', query: 'ما هي خدمات الأطفال المتاحة؟' },
    { label: 'تدبير منزلي', query: 'أحتاج خدمات تنظيف منزلي' },
  ];

  return (
    <div className="p-2 border-t border-gray-200">
      <div className="flex overflow-x-auto pb-2 space-x-2 space-x-reverse" dir="rtl">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionSelect(action.query)}
            className="whitespace-nowrap px-4 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
