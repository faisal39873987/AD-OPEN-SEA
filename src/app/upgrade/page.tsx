'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UpgradeIcon } from '@/components/ui/icons';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: '10',
    features: [
      'Unlimited conversations',
      'Basic AI access',
      'Email support',
      '30-day chat history',
    ],
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: '25',
    features: [
      'All Basic Plan features',
      'Advanced AI capabilities',
      'Priority support',
      '90-day chat history',
      'Specialized personal assistant',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: '50',
    features: [
      'All Professional Plan features',
      '24/7 specialized support',
      'Unlimited chat history',
      'Custom API access',
      'Advanced security settings',
      'Custom staff training',
    ],
  },
];

export default function UpgradePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AD Pulse
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Back to Chat
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Choose the Right Plan for Your Needs
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Upgrade your account to access advanced features and a smarter chat experience
          </p>
        </div>

        {/* Pricing plans */}
        <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col overflow-hidden rounded-lg ${
                plan.popular
                  ? 'ring-2 ring-blue-600 dark:ring-blue-500'
                  : 'ring-1 ring-gray-200 dark:ring-gray-800'
              } bg-white shadow-lg transition-all hover:scale-105 dark:bg-gray-900`}
            >
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">${plan.price}</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400">/ month</span>
                </div>
                {plan.popular && (
                  <p className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    Most Popular
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between bg-gray-50 px-6 py-8 dark:bg-gray-800">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-900 dark:text-white">Features</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-8 flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                      : 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <UpgradeIcon className="mr-2 h-4 w-4" />
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <dl className="mt-8 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">Can I change my plan later?</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                Yes, you can upgrade or downgrade at any time. Changes will take effect at the beginning of your next billing cycle.
              </dd>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">Is there a trial period?</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                Yes, we offer a 7-day free trial for the Professional Plan. You can cancel anytime during the trial period.
              </dd>
            </div>
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
              <dt className="text-lg font-medium text-gray-900 dark:text-white">How can I cancel my subscription?</dt>
              <dd className="mt-2 text-gray-700 dark:text-gray-300">
                You can cancel your subscription at any time through the settings panel in your account. Your subscription will remain active until the end of your current billing period.
              </dd>
            </div>
          </dl>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AD Pulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
