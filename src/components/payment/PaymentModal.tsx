'use client';

import React, { useState } from 'react';
import { X, CreditCard, User as UserIcon } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Service } from '@/types/service';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  user: User | null;
}

interface PaymentFormProps {
  service: Service;
  user: User;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ service, user, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                     process.env.NEXT_PUBLIC_VERCEL_URL || 
                     'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: service.price,
          currency: 'aed',
          description: service.name,
          metadata: {
            service_id: service.id,
            user_id: user.id,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment intent creation failed');
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: user.email,
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Create booking record
        await supabase.from('bookings').insert({
          user_id: user.id,
          service_id: service.id,
          payment_status: 'paid',
          status: 'confirmed',
        });

        onSuccess();
      }
    } catch (error: any) {
      onError(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-white mb-2">{service.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total:</span>
          <span className="text-green-400 font-bold text-lg">{service.price} AED</span>
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Details
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#fff',
                '::placeholder': {
                  color: '#9ca3af',
                },
              },
            },
          }}
          className="p-3 bg-gray-900 border border-gray-700 rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          loading
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay ${service.price} AED`}
      </button>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  user
}) => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setMessage('Payment successful! Your booking has been confirmed.');
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setMessage('');
    }, 3000);
  };

  const handleError = (error: string) => {
    setMessage(error);
  };

  if (!isOpen || !service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {success ? 'Payment Successful!' : 'Complete Payment'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={32} className="text-white" />
                </div>
                <p className="text-green-400 font-medium">{message}</p>
              </div>
            ) : (
              <>
                {!user && (
                  <div className="text-center py-8">
                    <UserIcon size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Please sign in to complete your booking.</p>
                  </div>
                )}

                {user && (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      service={service}
                      user={user}
                      onSuccess={handleSuccess}
                      onError={handleError}
                    />
                  </Elements>
                )}

                {message && !success && (
                  <div className="mt-4 p-3 bg-red-900 text-red-200 rounded-md text-sm">
                    {message}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
