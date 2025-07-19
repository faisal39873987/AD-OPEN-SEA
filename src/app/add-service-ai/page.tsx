'use client';

import PromptInput from '@/components/PromptInput';

export default function AddServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
            Add a New Service
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Describe the service you want to add, and our AI will structure and save it to our database. Be as detailed as possible for better results.
          </p>
        </div>
        
        <PromptInput />
      </div>
    </div>
  );
}
