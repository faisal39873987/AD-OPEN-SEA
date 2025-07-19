import React, { useState } from 'react';

// Types for performance data
interface PerformanceData {
  loadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
}

/**
 * FeedbackWidget component
 * A non-intrusive floating feedback button that expands into a form
 */
const FeedbackWidget = () => {
  // Create a simple translation function
  const t = (key: string): string => {
    const translations: Record<string, string> = {
      'feedback.title': 'Send Feedback',
      'feedback.close': 'Close',
      'feedback.feedback_about': 'What is your feedback about?',
      'feedback.performance': 'Performance',
      'feedback.usability': 'Usability',
      'feedback.design': 'Design',
      'feedback.feature': 'Feature Request',
      'feedback.bug': 'Bug Report',
      'feedback.rating': 'Rating',
      'feedback.comments': 'Comments',
      'feedback.comments_placeholder': 'Tell us more about your experience...',
      'feedback.submit': 'Submit Feedback',
      'feedback.submitting': 'Submitting...',
      'feedback.thank_you': 'Thank You!',
      'feedback.submitted_message': 'Your feedback has been submitted.',
      'feedback.error': 'Failed to submit feedback. Please try again.',
      'feedback.give_feedback': 'Give Feedback'
    };
    return translations[key] || key;
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('performance');
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Collect current page and technical information
      const performanceData: PerformanceData = {};
      
      if (window.performance) {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
          const navEntry = navEntries[0] as PerformanceNavigationTiming;
          performanceData.loadTime = navEntry.loadEventEnd - navEntry.startTime;
          performanceData.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.startTime;
        }
        
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        if (firstPaint) performanceData.firstPaint = firstPaint.startTime;
        if (firstContentfulPaint) performanceData.firstContentfulPaint = firstContentfulPaint.startTime;
      }
      
      // Submit feedback to API
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: feedbackType,
          rating,
          comment,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          performanceData,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset after closing
        setTimeout(() => {
          setSubmitted(false);
          setRating(3);
          setComment('');
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(t('feedback.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-widget-container fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="feedback-button bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary-dark transition-all duration-300"
          aria-label={t('feedback.give_feedback')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className="feedback-form bg-white rounded-lg shadow-xl p-4 w-80 border border-gray-200">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{t('feedback.title')}</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={t('feedback.close')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('feedback.feedback_about')}
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="performance">{t('feedback.performance')}</option>
                  <option value="usability">{t('feedback.usability')}</option>
                  <option value="design">{t('feedback.design')}</option>
                  <option value="feature">{t('feedback.feature')}</option>
                  <option value="bug">{t('feedback.bug')}</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('feedback.rating')}
                </label>
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`rating-button w-10 h-10 rounded-full flex items-center justify-center ${
                        rating >= value ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('feedback.comments')}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  rows={3}
                  placeholder={t('feedback.comments_placeholder')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-2 px-4 rounded-md text-white ${
                  submitting ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
                } transition-colors duration-300`}
              >
                {submitting ? t('feedback.submitting') : t('feedback.submit')}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t('feedback.thank_you')}</h3>
              <p className="text-gray-600">{t('feedback.submitted_message')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;
