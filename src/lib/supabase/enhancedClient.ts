import { createClient } from '@supabase/supabase-js'
import { createMonitoredSupabaseClient } from '../performance'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create the base Supabase client
const baseClient = createClient(supabaseUrl, supabaseAnonKey)

// Simple cache for query responses
const queryCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60000 // 1 minute cache TTL

// Create a wrapped client with caching and performance monitoring
const wrappedClient = new Proxy(baseClient, {
  get(target, prop) {
    // Original method/property
    const value = target[prop]
    
    // Handle the from() method specially to add caching
    if (prop === 'from') {
      return function(table: string) {
        const originalFrom = value.call(target, table)
        
        return new Proxy(originalFrom, {
          get(fromTarget, fromProp) {
            const fromValue = fromTarget[fromProp]
            
            // Add caching to select queries
            if (fromProp === 'select') {
              return function(...args: any[]) {
                const selectResult = fromValue.apply(fromTarget, args)
                
                // Add caching to the execution
                const originalThen = selectResult.then
                selectResult.then = function(onFulfilled: any, onRejected: any) {
                  // Generate a cache key based on the table, select args, and any filters
                  const cacheKeyObj = {
                    table,
                    select: args,
                    filters: (selectResult as any)?.url?.searchParams?.toString(),
                  }
                  const cacheKey = JSON.stringify(cacheKeyObj)
                  
                  // Check cache first
                  const cached = queryCache.get(cacheKey)
                  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                    console.log(`Cache hit for ${table} query`)
                    return Promise.resolve(cached.data).then(onFulfilled, onRejected)
                  }
                  
                  // Cache miss, execute original and cache result
                  return originalThen.call(selectResult, (result: any) => {
                    // Only cache successful responses
                    if (!result.error) {
                      queryCache.set(cacheKey, {
                        data: result,
                        timestamp: Date.now(),
                      })
                    }
                    return onFulfilled ? onFulfilled(result) : result
                  }, onRejected)
                }
                
                return selectResult
              }
            }
            
            return typeof fromValue === 'function'
              ? function(...args: any[]) {
                  return fromValue.apply(fromTarget, args)
                }
              : fromValue
          }
        })
      }
    }
    
    return typeof value === 'function'
      ? function(...args: any[]) {
          return value.apply(target, args)
        }
      : value
  }
})

// Apply performance monitoring
export const supabase = createMonitoredSupabaseClient(wrappedClient)

// Method to clear the cache when needed
export function clearSupabaseCache() {
  queryCache.clear()
  console.log('Supabase query cache cleared')
}

// Method to invalidate specific table cache
export function invalidateTableCache(table: string) {
  const keysToDelete: string[] = []
  
  queryCache.forEach((_, key) => {
    try {
      const keyObj = JSON.parse(key)
      if (keyObj.table === table) {
        keysToDelete.push(key)
      }
    } catch (e) {
      // Skip malformed keys
    }
  })
  
  keysToDelete.forEach(key => queryCache.delete(key))
  console.log(`Cache invalidated for table: ${table}`)
}
