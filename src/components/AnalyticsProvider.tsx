'use client';

import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

/**
 * Analytics Provider component
 * 
 * This component initializes all analytics and monitoring tools.
 * It's a client component so it can access browser APIs.
 */
export default function AnalyticsProvider() {
  // Initialize performance monitoring
  usePerformanceMonitoring();
  
  // This component doesn't render anything
  return null;
}
