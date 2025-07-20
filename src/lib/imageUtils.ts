import { useState, useEffect } from 'react'

interface ImageLoadingState {
  isLoading: boolean
  hasError: boolean
  imageSrc: string
}

/**
 * Custom hook for optimized image loading with error handling and fallback
 * 
 * @param src The source URL of the image
 * @param fallbackSrc A fallback image URL to use if the primary image fails to load
 * @returns An object containing loading state, error state, and the current image source
 */
export function useOptimizedImage(
  src: string | undefined,
  fallbackSrc: string = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect width="18" height="18" x="3" y="3" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="9" cy="9" r="2"%3E%3C/circle%3E%3Cpath d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"%3E%3C/path%3E%3C/svg%3E'
): ImageLoadingState {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: true,
    hasError: false,
    imageSrc: src || fallbackSrc
  })

  useEffect(() => {
    if (!src) {
      setState({
        isLoading: false,
        hasError: true,
        imageSrc: fallbackSrc
      })
      return
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      imageSrc: src
    }))

    const img = new Image()
    img.src = src

    img.onload = () => {
      setState({
        isLoading: false,
        hasError: false,
        imageSrc: src
      })
    }

    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`)
      setState({
        isLoading: false,
        hasError: true,
        imageSrc: fallbackSrc
      })
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, fallbackSrc])

  return state
}

/**
 * Gets the appropriate image size based on device width
 * 
 * @param defaultSize Default size of the image
 * @returns The appropriate image size based on device width
 */
export function getResponsiveImageSize(defaultSize: number = 640): number {
  if (typeof window === 'undefined') return defaultSize
  
  const width = window.innerWidth
  
  if (width < 640) return 480
  if (width < 768) return 640
  if (width < 1024) return 768
  if (width < 1280) return 1024
  return 1280
}

/**
 * Creates a responsive image URL with the appropriate size
 * 
 * @param url Original image URL
 * @param width Desired width
 * @returns URL with appropriate size parameters
 */
export function getResponsiveImageUrl(url: string, width: number): string {
  // If URL is already a data URL or relative path, return as is
  if (url.startsWith('data:') || url.startsWith('/')) {
    return url
  }

  // For Unsplash images
  if (url.includes('unsplash.com')) {
    return url.includes('?') 
      ? `${url}&w=${width}&q=80&auto=format` 
      : `${url}?w=${width}&q=80&auto=format`
  }

  // For Cloudinary images
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
  }

  // Default: return original URL
  return url
}

/**
 * Preloads common images for better user experience
 * 
 * @param urls Array of image URLs to preload
 */
export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return
  
  urls.forEach(url => {
    const img = new Image()
    img.src = url
  })
}
