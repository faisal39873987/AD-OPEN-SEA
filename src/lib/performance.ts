/**
 * Performance optimization utilities for Abu Dhabi Open Sea
 * This module provides utilities to measure and optimize performance
 */

/**
 * Measures rendering performance and reports to console
 * @param name The name of the component or operation being measured
 * @param callback The function to measure
 * @returns The result of the callback function
 */
export function measurePerformance<T>(name: string, callback: () => T): T {
  console.time(`perf-${name}`);
  const result = callback();
  console.timeEnd(`perf-${name}`);
  return result;
}

/**
 * Debounces a function call to improve performance when a function is called frequently
 * @param func The function to debounce
 * @param wait Wait time in milliseconds before executing the function
 * @returns A debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function to limit the rate at which it can execute
 * @param func The function to throttle
 * @param limit Time limit in milliseconds
 * @returns A throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Memoizes a function to cache its results based on arguments
 * @param func The function to memoize
 * @returns A memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(...args: Parameters<T>) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a component that only rerenders when needed
 * @param func The render function to optimize
 * @param deps An array of dependencies to watch for changes
 * @returns A render function that only runs when dependencies change
 */
export function optimizedRender<T>(
  func: () => T,
  deps: any[]
): () => T {
  let lastDeps = deps;
  let lastResult = func();
  
  return () => {
    const depsChanged = deps.some((dep, i) => dep !== lastDeps[i]);
    
    if (depsChanged) {
      lastDeps = deps;
      lastResult = func();
    }
    
    return lastResult;
  };
}

/**
 * Monitors fetch requests for performance issues
 * @param url The URL to fetch
 * @param options Fetch options
 * @returns A Promise with the fetch response
 */
export async function monitoredFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log slow requests (over 500ms)
    if (duration > 500) {
      console.warn(`Slow network request to ${url}: ${duration.toFixed(2)}ms`);
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    throw error;
  }
}

// Export a configured Supabase client with monitoring
export function createMonitoredSupabaseClient(supabaseClient: any) {
  // Proxy the supabase client to monitor performance
  return new Proxy(supabaseClient, {
    get(target, prop) {
      const value = target[prop];
      
      if (typeof value === 'function') {
        return function(...args: any[]) {
          console.time(`supabase-${String(prop)}`);
          const result = value.apply(target, args);
          
          // Handle promises
          if (result && typeof result.then === 'function') {
            return result.then((res: any) => {
              console.timeEnd(`supabase-${String(prop)}`);
              return res;
            }).catch((err: any) => {
              console.timeEnd(`supabase-${String(prop)}`);
              throw err;
            });
          }
          
          console.timeEnd(`supabase-${String(prop)}`);
          return result;
        };
      }
      
      return value;
    }
  });
}
