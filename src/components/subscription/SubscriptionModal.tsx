'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan, setCurrentPlan] = useState<'free' | 'plus' | 'team'>('free');
  
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'For basic usage',
      price: {
        monthly: 'Free',
        yearly: 'Free'
      },
      features: [
        'Limited service search',
        'Basic information',
        'Limited assistant usage',
        'Email support',
      ],
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'plus',
      name: 'Plus',
      description: 'For advanced individual use',
      price: {
        monthly: '$50/month',
        yearly: '$480/year'
      },
      features: [
        'Unlimited service search',
        'Detailed information with reviews',
        'Unlimited assistant usage',
        'Exclusive discounts on services',
        'Priority support',
      ],
      isCurrent: currentPlan === 'plus',
      isRecommended: true,
    },
    {
      id: 'team',
      name: 'Team',
      description: 'For businesses and teams',
      price: {
        monthly: '$200/month',
        yearly: '$1920/year'
      },
      features: [
        'All Plus features',
        'Up to 5 users',
        'Admin dashboard',
        '24/7 support',
        'Special offers for businesses',
      ],
      isCurrent: currentPlan === 'team',
    },
  ];

  // Function to handle plan upgrade
  const handleUpgrade = (planId: 'free' | 'plus' | 'team') => {
    // In a real application, this would open Stripe checkout
    setCurrentPlan(planId);
    // Mock implementation - just update the UI
    alert(`Subscribed to plan: ${planId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Billing toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-full inline-flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-full ${
                    billingPeriod === 'monthly' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 rounded-full ${
                    billingPeriod === 'yearly' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-black text-white px-2 py-1 rounded-full">
                    20% Off
                  </span>
                </button>
              </div>
            </div>
            
            {/* Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg p-6 ${
                    plan.isRecommended 
                      ? 'border-black ring-2 ring-black' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.isRecommended && (
                    <div className="bg-black text-white text-xs uppercase tracking-wide py-1 px-3 rounded-full inline-block mb-4">
                      Recommended
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-gray-600 mb-3">{plan.description}</p>
                  
                  <div className="text-3xl font-bold mb-6">
                    {plan.price[billingPeriod]}
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-green-500">
                          <Check size={16} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.isCurrent ? (
                    <div className="bg-gray-100 text-center py-2 px-4 rounded-md font-medium">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.id as 'free' | 'plus' | 'team')}
                      className={`w-full py-2 px-4 rounded-md font-medium ${
                        plan.id === 'free'
                          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-800'
                      } transition-colors`}
                    >
                      {plan.id === 'free' ? 'Current Plan' : 'Upgrade'}
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium mb-2">Can I cancel my subscription at any time?</h4>
                  <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium mb-2">How is the subscription paid?</h4>
                  <p className="text-gray-600">We accept major credit cards (Visa, Mastercard, American Express) through the secure Stripe payment system.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium mb-2">Is there a long-term contract?</h4>
                  <p className="text-gray-600">No, all our subscriptions are free from long-term contracts. You can subscribe monthly or annually according to your preferences.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Need help? Contact us at <a href="mailto:support@adopensea.com" className="text-black underline">support@adopensea.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
