import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Pricing plans
  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: billingPeriod === 'monthly' ? 9.99 : 99.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      description: 'Essential services for individuals',
      features: [
        'Access to basic services',
        'Limited service requests per month',
        'Email support',
        'Basic service provider access'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingPeriod === 'monthly' ? 19.99 : 199.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      description: 'Advanced services for power users',
      features: [
        'All Basic features',
        'Unlimited service requests',
        'Priority booking',
        'Phone & email support',
        'Premium service provider access',
        'Discounted service fees'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingPeriod === 'monthly' ? 49.99 : 499.99,
      period: billingPeriod === 'monthly' ? '/month' : '/year',
      description: 'Complete solution for businesses',
      features: [
        'All Professional features',
        'Dedicated account manager',
        'Custom service integration',
        '24/7 priority support',
        'Team accounts',
        'Service level agreement',
        'Customized reporting'
      ]
    }
  ];

  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly');
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) return;
    
    // In a real app, this would redirect to a payment page or process the subscription
    console.log(`Subscribing to ${selectedPlan} plan (${billingPeriod})`);
    onClose();
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <motion.div
          className="w-full max-w-4xl rounded-2xl bg-white p-6 text-left shadow-xl"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Experience</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Choose the perfect plan to enhance your service experience in Abu Dhabi.
            </p>
            
            {/* Billing toggle */}
            <div className="mt-6 flex items-center justify-center">
              <span className={`mr-3 text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={toggleBillingPeriod}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${billingPeriod === 'annual' ? 'bg-indigo-600' : 'bg-gray-300'}`}
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === 'annual' ? 'translate-x-7' : 'translate-x-1'}`} 
                />
              </button>
              <span className={`ml-3 text-sm font-medium ${billingPeriod === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual <span className="text-green-500 font-semibold">(Save 20%)</span>
              </span>
            </div>
          </div>
          
          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`relative rounded-xl p-6 border ${
                  selectedPlan === plan.id 
                    ? 'border-indigo-600 ring-2 ring-indigo-600' 
                    : 'border-gray-200 hover:border-indigo-300'
                } ${
                  plan.isPopular ? 'shadow-lg' : 'shadow-sm'
                } transition-all duration-300 flex flex-col h-full`}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                onClick={() => handlePlanSelection(plan.id)}
              >
                {plan.isPopular && (
                  <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Most popular
                  </span>
                )}
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    selectedPlan === plan.id
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
                  } transition-colors duration-200`}
                  onClick={() => handlePlanSelection(plan.id)}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select plan'}
                </button>
              </motion.div>
            ))}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubscribe}
              disabled={!selectedPlan}
              className={`py-2 px-6 rounded-md font-medium ${
                selectedPlan
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to checkout
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
