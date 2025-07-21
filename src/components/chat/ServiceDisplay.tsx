import React, { useState } from 'react';
import Image from 'next/image';
import { Service } from '@/lib/types/database';
import { ChatService } from '@/lib/services/chatService';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MapPin, Phone, ExternalLink, MessageCircle } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (newRating: number) => {
    setRating(newRating);
  };

  const handleFeedbackSubmit = async () => {
    if (rating === null) return;
    
    setIsSubmitting(true);
    const success = await ChatService.saveServiceFeedback(
      service.id,
      rating,
      feedback
    );
    
    setIsSubmitting(false);
    if (success) {
      setIsFeedbackSubmitted(true);
    }
  };

  return (
    <motion.div 
      className="border border-gray-200 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      <div className="flex items-start">
        {service.image_url && (
          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-4">
            <Image 
              src={service.image_url} 
              alt={service.name} 
              width={80} 
              height={80} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{service.name}</h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-4">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm">{service.rating.toFixed(1)}</span>
            </div>
            
            {service.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{service.location}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {service.description}
          </p>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm mb-4">{service.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {service.contact && (
              <a 
                href={`tel:${service.contact}`} 
                className="flex items-center text-sm text-blue-600 dark:text-blue-400"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>{service.contact}</span>
              </a>
            )}
            
            {service.website && (
              <a 
                href={service.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-sm text-blue-600 dark:text-blue-400"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                <span>زيارة الموقع</span>
              </a>
            )}
          </div>
          
          {!isFeedbackSubmitted ? (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold mb-2">هل كان هذا مفيداً؟</h4>
              
              <div className="flex space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className={`p-1 rounded-full transition-colors ${
                      rating !== null && rating >= star
                        ? 'text-yellow-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
              
              <textarea
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 mb-3"
                placeholder="اترك تعليقاً (اختياري)"
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
              
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  rating === null
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={rating === null || isSubmitting}
                onClick={handleFeedbackSubmit}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ThumbsUp className="w-5 h-5 mr-2" />
                <span>شكراً على تقييمك!</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {!isExpanded && (
        <button 
          className="text-sm text-blue-600 dark:text-blue-400 mt-2 flex items-center"
          onClick={() => setIsExpanded(true)}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          <span>عرض المزيد</span>
        </button>
      )}
    </motion.div>
  );
};

interface ServiceResultsProps {
  services: Service[];
}

export const ServiceResults: React.FC<ServiceResultsProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 mb-2">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
