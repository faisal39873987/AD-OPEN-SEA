'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  SparklesIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { ProviderCard } from './ProviderCard'

interface ServiceProvider {
  id: string
  name: string
  service_category: string
  description?: string
  price?: number
  phone?: string
  whatsapp?: string
  instagram?: string
  location?: string
  available?: boolean
  created_at?: string
}

// GPT Assistant URL for external help (no direct API integration)
const gptAssistantUrl = 'https://chat.openai.com/g/g-tivLXVzze-abu-dhabi-open-sea-guide'

export default function EnhancedServicesPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [pageSize] = useState(10)  // Number of providers to load at once
  
  // For performance measurement
  const renderStartTime = useRef(Date.now())
  const providerListRef = useRef<HTMLDivElement>(null)

  const categories = [
    { value: 'all', label: 'All Services', count: 0 },
    { value: 'Home Cleaning', label: 'Home Cleaning', count: 0 },
    { value: 'Maintenance', label: 'Maintenance & Repair', count: 0 },
    { value: 'Catering', label: 'Catering & Events', count: 0 },
    { value: 'Transportation', label: 'Transportation', count: 0 },
    { value: 'Business', label: 'Business Services', count: 0 },
    { value: 'Creative', label: 'Creative & Design', count: 0 },
    { value: 'Health', label: 'Health & Wellness', count: 0 },
    { value: 'Beauty', label: 'Beauty & Personal Care', count: 0 }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: 'AED 0-50/hour' },
    { value: '51-100', label: 'AED 51-100/hour' },
    { value: '101-200', label: 'AED 101-200/hour' },
    { value: '200+', label: 'AED 200+/hour' }
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'newest', label: 'Newest First' }
  ]

  // Use requestIdleCallback for less important operations
  useEffect(() => {
    const fetchProviders = () => {
      fetchServiceProviders();
    };

    // Use setTimeout with a short delay to not block initial rendering
    const timerId = setTimeout(fetchProviders, 20);
    
    return () => clearTimeout(timerId);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!loading && serviceProviders.length > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      // Performance tracking complete
      
      // Report to analytics if needed
      if (renderTime > 1000) {
        console.warn('Render time exceeded 1000ms threshold');
      }
    }
  }, [loading, serviceProviders]);

  // Implement intersection observer for lazy loading
  useEffect(() => {
    if (!providerListRef.current || loading || error) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore) {
        // Provider list scrolled into view, lazy loading more items
        loadMoreProviders();
      }
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(providerListRef.current);

    return () => {
      if (providerListRef.current) {
        observer.unobserve(providerListRef.current);
      }
    };
  }, [loading, error, isLoadingMore]);

  useEffect(() => {
    filterAndSortProviders();
  }, [serviceProviders, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get categories from URL parameters or use default
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }

      try {
        // Use fetch to call our API endpoint instead of direct Supabase call
        const apiUrl = `/api/service_providers?limit=${pageSize}${categoryParam ? `&category=${categoryParam}` : ''}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
          // No service providers found
          setServiceProviders([]);
        } else {
          // Found service providers
          setServiceProviders(data);
        }
      } catch (error) {
        console.error('Error fetching service providers:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        
        // Mock data for demonstration only
        const mockData: ServiceProvider[] = [
          {
            id: '1',
            name: 'Ahmed Al Mansouri',
            service_category: 'خدم منازل',
            description: 'Professional cleaning specialist with 8+ years experience. Eco-friendly products and flexible scheduling.',
            price: 65,
            location: 'Abu Dhabi Marina',
            phone: '+971501234567',
            whatsapp: '+971501234567',
            instagram: 'ahmed_cleaning',
            available: true,
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            name: 'Maria Santos',
            service_category: 'خدم منازل',
            description: 'Reliable and thorough cleaning service with attention to detail. Available weekends.',
            price: 55,
            location: 'Al Khalidiyah',
            phone: '+971502345678',
            whatsapp: '+971502345678',
            instagram: 'maria_cleaning',
            available: true,
            created_at: new Date().toISOString()
          }
        ];
        setServiceProviders(mockData);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const loadMoreProviders = async () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    // Loading more providers
    
    try {
      const response = await fetch(`/api/service_providers?start=${serviceProviders.length}&limit=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch additional service providers');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Use a function-based state update to avoid race conditions
        setServiceProviders(prev => [...prev, ...data]);
        // Successfully loaded additional providers
      } else {
        // No more providers to load
      }
    } catch (error) {
      console.error('Error loading more providers:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Memoize the filtering/sorting function for better performance
  const filterAndSortProviders = useCallback(() => {
    // Performance optimization - don't run if no providers
    if (!serviceProviders || serviceProviders.length === 0) {
      setFilteredProviders([]);
      return;
    }
    
    console.time('filter-and-sort');
    let filtered = Array.isArray(serviceProviders) ? [...serviceProviders] : [];

    // Search filter with performance optimization
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchLower) ||
        provider.service_category.toLowerCase().includes(searchLower) ||
        (provider.description && provider.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(provider => provider.service_category === selectedCategory);
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(provider => {
        const rate = provider.price || 0;
        switch (priceRange) {
          case '0-50': return rate <= 50;
          case '51-100': return rate > 50 && rate <= 100;
          case '101-200': return rate > 100 && rate <= 200;
          case '200+': return rate > 200;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.price || 0) - (b.price || 0);
        case 'price-high': return (b.price || 0) - (a.price || 0);
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    setFilteredProviders(filtered);
    console.timeEnd('filter-and-sort');
  }, [serviceProviders, searchTerm, selectedCategory, priceRange, sortBy]);

  const toggleFavorite = useCallback((providerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(providerId)) {
        newFavorites.delete(providerId);
      } else {
        newFavorites.add(providerId);
      }
      return newFavorites;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] py-10 border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-semibold mb-3">
              Find Your Perfect Service Provider
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Browse through {serviceProviders.length}+ verified professionals in Abu Dhabi
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-[#0a0a0a] border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3">
            {/* Search Bar - ChatGPT Style */}
            <div className="flex-1 relative">
              <label htmlFor="search-input" className="sr-only">Search service providers</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Ask anything"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-white"
                  aria-label="Search service providers"
                />
              </div>
            </div>

            {/* Quick Action Buttons - ChatGPT Style */}
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-2 rounded-lg border border-gray-700 ${selectedCategory === 'all' ? 'bg-gray-700' : 'bg-[#2a2a2a]'} text-sm text-gray-200 flex items-center gap-2 hover:bg-gray-700`}
              >
                <span>All Services</span>
              </button>
              
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                aria-label="Sort service providers"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 hover:bg-gray-700"
                aria-expanded={showFilters}
                aria-controls="extended-filters"
              >
                <FunnelIcon className="h-4 w-4" aria-hidden="true" />
                Filters
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Extended Filters - ChatGPT Style */}
          {showFilters && (
            <motion.div
              id="extended-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="price-range" className="block text-sm font-medium text-gray-300 mb-2">
                    Price Range
                  </label>
                  <select
                    id="price-range"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                  >
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-300 mb-2">
                    Availability
                  </label>
                  <select 
                    id="availability"
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="all">All Providers</option>
                    <option value="available">Available Now</option>
                    <option value="today">Available Today</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <select 
                    id="rating-filter"
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.0+">4.0+ Stars</option>
                    <option value="3.5+">3.5+ Stars</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section - ChatGPT Style */}
      <section className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-200">
              {filteredProviders.length} Service Provider{filteredProviders.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="text-sm text-gray-400">
              Showing results for {selectedCategory === 'all' ? 'all services' : selectedCategory}
            </div>
          </div>

          {/* Loading State - ChatGPT Style */}
          {loading ? (
            <div className="space-y-4" aria-live="polite" aria-busy="true">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 animate-pulse" role="status" aria-label="Loading service providers">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <div className="ml-3 flex-1">
                      <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between">
                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <span className="sr-only">Loading service providers...</span>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State - ChatGPT Style */
            <div className="text-center py-10 bg-[#1a1a1a] rounded-xl border border-gray-800">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-900/30 mb-4">
                <ExclamationCircleIcon className="w-7 h-7 text-red-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">
                Unable to load service providers
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {error || "We're experiencing technical difficulties. Please try again later."}
              </p>
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => fetchServiceProviders()}
                  className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  aria-label="Try again"
                >
                  Try Again
                </button>
                
                {/* Ask GPT Button */}
                <a
                  href={gptAssistantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-600 text-gray-300 text-sm rounded-lg hover:bg-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-gray-500"
                  aria-label="Ask GPT Assistant for help"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  Ask GPT Assistant
                </a>
              </div>
            </div>
          ) : (
            /* Provider Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider, index) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    index={index}
                    isFavorite={favorites.has(provider.id)}
                    toggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-[#1a1a1a] rounded-xl border border-gray-800" aria-live="polite">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-800 mb-4">
                    <MagnifyingGlassIcon className="w-7 h-7 text-gray-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-200 mb-2">
                    No providers found
                  </h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search criteria or browse different categories
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setPriceRange('all')
                      }}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      aria-label="Clear all search filters"
                    >
                      Clear All Filters
                    </button>
                    
                    {/* Ask GPT Button */}
                    <a
                      href={gptAssistantUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-600 text-gray-300 text-sm rounded-lg hover:bg-[#2a2a2a] focus:outline-none focus:ring-1 focus:ring-gray-500"
                      aria-label="Ask GPT Assistant for help"
                    >
                      <SparklesIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                      Ask GPT Assistant
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Load More Indicator - Intersection Observer Target */}
          {!loading && !error && filteredProviders.length > 0 && (
            <div 
              ref={providerListRef} 
              className="py-8 text-center"
            >
              {isLoadingMore ? (
                <div className="flex items-center justify-center text-gray-300">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Loading more providers...</span>
                </div>
              ) : (
                <button
                  onClick={loadMoreProviders}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-[#2a2a2a] text-sm transition-colors"
                >
                  Load More Providers
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
