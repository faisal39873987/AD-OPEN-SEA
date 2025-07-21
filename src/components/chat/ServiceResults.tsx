import React, { useState } from 'react';
import Image from 'next/image';
import { Service } from '@/lib/types/database';
import { ChatService } from '@/lib/services/chatService';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, MapPin, Phone, ExternalLink, MessageCircle } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
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
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{service.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>
            </div>
            
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {service.price ? `${service.price} AED` : 'Price on request'}
              </div>
              {service.rating && (
                <div className="flex items-center justify-end mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{service.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {service.location && (
              <div className="flex items-center mr-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{service.location}</span>
              </div>
            )}
          </div>
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {service.contact && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    <a href={`tel:${service.contact}`} className="text-green-600 hover:underline">
                      {service.contact}
                    </a>
                  </div>
                )}
                
                {service.whatsapp && (
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    <a 
                      href={`https://wa.me/${service.whatsapp.replace(/[+\s]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                )}
                
                {service.website && (
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                    <a 
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
                
                {service.instagram && (
                  <div className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-pink-600">📸</span>
                    <a 
                      href={`https://instagram.com/${service.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:underline"
                    >
                      @{service.instagram.replace('@', '')}
                    </a>
                  </div>
                )}
              </div>
              
              {!isFeedbackSubmitted && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rate this service</h4>
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className={`w-6 h-6 ${
                          rating && star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                  
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience (optional)"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                  />
                  
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={rating === null || isSubmitting}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              )}
              
              {isFeedbackSubmitted && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ThumbsUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-700 dark:text-green-400">Thank you for your feedback!</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {!isExpanded && (
            <button className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline">
              Click to view details →
            </button>
          )}
        </div>
      </div>
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

export default ServiceResults;
