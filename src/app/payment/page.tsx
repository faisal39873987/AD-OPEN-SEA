'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [clientSecret, setClientSecret] = useState('');
  
  // Plans
  const plans = {
    monthly: {
      price: 249,
      name: 'Monthly Premium',
      features: [
        'Unlimited service requests',
        'Priority support',
        'Access to premium providers',
        'Discounted service rates'
      ]
    },
    yearly: {
      price: 2499,
      name: 'Yearly Premium',
      features: [
        'All monthly features',
        'Save 16% compared to monthly',
        'Exclusive yearly member events',
        'Free upgrades on service packages'
      ]
    }
  };

  useEffect(() => {
    // Create PaymentIntent on the server
    const fetchPaymentIntent = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    process.env.NEXT_PUBLIC_VERCEL_URL || 
                    'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price,
            currency: 'aed',
          }),
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    fetchPaymentIntent();
  }, [selectedPlan]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      window.location.href = '/payment-success';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black mb-4">Upgrade to Premium</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Get access to exclusive services and features with our premium plans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Plan Selection */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-6">Choose your plan</h2>
            
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    selectedPlan === 'monthly'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    selectedPlan === 'yearly'
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-y border-r border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-black">
                    {selectedPlan === 'monthly' ? plans.monthly.name : plans.yearly.name}
                  </h3>
                  {selectedPlan === 'yearly' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      Save 16%
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-black">
                    {selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price} AED
                  </span>
                  <span className="block text-gray-500 text-sm">
                    {selectedPlan === 'monthly' ? 'per month' : 'per year'}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-4">
                {(selectedPlan === 'monthly' ? plans.monthly.features : plans.yearly.features).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Payment Form */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-6">Payment details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on card
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="card-number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2 pr-10"
                      placeholder="4242 4242 4242 4242"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Image src="/images/visa-logo.png" alt="Visa" width={30} height={20} />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry date
                    </label>
                    <input
                      type="text"
                      id="expiry"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                      placeholder="MM / YY"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cvc"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedPlan === 'monthly' ? plans.monthly.price : plans.yearly.price} AED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">VAT (5%)</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedPlan === 'monthly' 
                      ? (plans.monthly.price * 0.05).toFixed(2) 
                      : (plans.yearly.price * 0.05).toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">
                    {selectedPlan === 'monthly' 
                      ? (plans.monthly.price * 1.05).toFixed(2) 
                      : (plans.yearly.price * 1.05).toFixed(2)} AED
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md border border-transparent bg-black px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70"
                >
                  {isLoading ? 'Processing...' : 'Complete Purchase'}
                </button>
              </div>
              
              <p className="mt-4 text-center text-xs text-gray-500">
                By completing this purchase, you agree to our{' '}
                <Link href="/terms" className="underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Secure payment processing</h3>
              <p className="text-sm text-gray-500">Your payment information is encrypted and secure. We do not store your credit card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PaymentPage() {
  return (
    <div className="bg-white">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
