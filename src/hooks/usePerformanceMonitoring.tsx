/**
 * Performance Monitoring Hook
 * 
 * This React hook initializes performance monitoring 
 * for the application.
 */

'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/monitoring/performance';

export function usePerformanceMonitoring() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
  }, []);
  
  return null;
}
