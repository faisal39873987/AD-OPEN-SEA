'use client';

import React from 'react';
import { Service, SERVICE_CATEGORIES } from '@/types/service';
import { motion } from 'framer-motion';

interface ServiceCategoriesProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  services,
  onServiceSelect
}) => {
  const getCategoryServices = (category: string) => {
    return services.filter(service => 
      service.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Personal trainers': '🏋️‍♂️',
      'Yacht rentals': '⛵',
      'Apartment rentals': '🏠',
      'Beauty clinics': '✨',
      'Kids services': '👶',
      'Housekeeping': '🧹'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Service Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICE_CATEGORIES.map((category) => {
          const categoryServices = getCategoryServices(category);
          return (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <h3 className="font-semibold text-white">{category}</h3>
              </div>
              <div className="text-sm text-gray-400">
                {categoryServices.length} service{categoryServices.length !== 1 ? 's' : ''} available
              </div>
              {categoryServices.length > 0 && (
                <div className="mt-3 space-y-2">
                  {categoryServices.slice(0, 2).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => onServiceSelect(service)}
                      className="w-full text-left p-2 bg-gray-700 rounded text-sm hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white">{service.name}</span>
                        <span className="text-green-400 font-bold">{service.price} AED</span>
                      </div>
                      <div className="text-gray-300 text-xs mt-1">
                        ⭐ {service.rating}/5 • {service.location}
                      </div>
                    </button>
                  ))}
                  {categoryServices.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{categoryServices.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategories;
