'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QuickActionsBarProps {
  onSelectAction: (action: string) => void;
}

const QuickActionsBar = ({ onSelectAction }: QuickActionsBarProps) => {
  // Define quick action categories and their queries
  const quickActions = [
    { label: 'المدربين الشخصيين', query: 'ابحث عن أفضل المدربين الشخصيين في أبوظبي' },
    { label: 'تأجير اليخوت', query: 'خيارات تأجير اليخوت في أبوظبي' },
    { label: 'الشقق', query: 'شقق للإيجار في أبوظبي' },
    { label: 'عيادات التجميل', query: 'أفضل عيادات التجميل في أبوظبي' },
    { label: 'خدمات الأطفال', query: 'خدمات رعاية الأطفال في أبوظبي' },
    { label: 'التدبير المنزلي', query: 'خدمات التدبير المنزلي في أبوظبي' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 overflow-x-auto">
      <div className="py-3 px-4">
        <div className="flex space-x-2 rtl:space-x-reverse">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="flex-shrink-0 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
              onClick={() => onSelectAction(action.query)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsBar;
