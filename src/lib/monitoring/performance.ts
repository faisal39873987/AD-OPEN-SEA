/**
 * Performance monitoring configuration
 * 
 * This module sets up Real User Monitoring (RUM) and integrates with the
 * Web Vitals API to track key performance metrics.
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

// Types for performance data
interface MetricPayload {
  name: string;
  value: number;
  delta: number;
  id: string;
  isFinal?: boolean;
  entries?: any[];
}

// Configure default thresholds based on Web Vitals recommendations
export const PERFORMANCE_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FID: { good: 100, poor: 300 },   // First Input Delay (ms)
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte (ms)
};

/**
 * Categorizes a metric as "good", "needs improvement", or "poor" based on thresholds
 */
function categorizeMetric(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
  
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Sends metrics to the analytics endpoint
 */
function sendToAnalytics(metric: MetricPayload) {
  // Add page information
  const payload = {
    ...metric,
    page: window.location.pathname,
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    category: categorizeMetric(metric.name, metric.value)
  };
  
  // Send to your analytics API endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // Use keepalive to ensure the request completes even if the page is unloading
      keepalive: true,
    }).catch(error => {
      console.error('Error sending web vitals:', error);
    });
  }
  
  // Also log to console in development
  // No logs in production
}

/**
 * Initializes performance monitoring for the current page
 */
export function initPerformanceMonitoring() {
  // Only run in the browser
  if (typeof window === 'undefined') return;
  
  // Monitor Web Vitals metrics
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  
  // Track custom performance marks if needed
  if (performance && performance.mark) {
    performance.mark('app-initialized');
  }
}

/**
 * Creates a performance mark and returns a function to measure the duration
 */
export function markPerformance(markName: string) {
  if (typeof window === 'undefined' || !performance || !performance.mark) return () => {};
  
  const startMark = `${markName}-start`;
  const endMark = `${markName}-end`;
  
  performance.mark(startMark);
  
  return () => {
    performance.mark(endMark);
    performance.measure(markName, startMark, endMark);
    
    const entries = performance.getEntriesByName(markName, 'measure');
    if (entries.length > 0) {
      const duration = entries[0].duration;
      
      // Log and send the custom measurement
      // Only log in development
      
      sendToAnalytics({
        name: `custom:${markName}`,
        value: duration,
        delta: duration,
        id: markName,
      });
    }
  };
}
