'use client';

import { useState } from 'react';
import { processAndSavePrompt } from '@/services/processPrompt';

export default function PromptInput() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await processAndSavePrompt(userInput);
      setResult(response);
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
          Service Data Generator
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Describe a service you want to add, and our AI will convert it into structured data and save it to the database.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="prompt" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Describe the service in detail
            </label>
            <textarea
              id="prompt"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors"
              placeholder="Example: I need a professional plumber service that specializes in leak repairs and bathroom installations. The service should be available 24/7 for emergencies with prices starting at 200 AED per hour."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black'
            } text-white transition-colors`}
          >
            {loading ? 'Processing...' : 'Process'}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold text-black dark:text-white mb-4">
            Processed Result
          </h3>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Original Input
            </h4>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200">
              {result.original}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Structured Data
            </h4>
            <pre className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 overflow-auto max-h-80">
              {JSON.stringify(result.processed, null, 2)}
            </pre>
          </div>
          
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Saved to Database
            </h4>
            <pre className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 overflow-auto max-h-80">
              {JSON.stringify(result.saved, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-500 dark:text-gray-400">
            <p>Model: {result.model}</p>
            <p>Tokens Used: {result.usage.total_tokens}</p>
          </div>
        </div>
      )}
    </div>
  );
}
