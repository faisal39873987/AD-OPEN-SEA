import { test, expect } from '@playwright/test';

test.describe('Core Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Home page loads correctly', async ({ page }) => {
    // Check that main elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Service listing loads properly', async ({ page }) => {
    // Navigate to services page
    await page.click('text=Services');
    
    // Wait for service items to be visible
    const serviceItems = page.locator('.service-item');
    await expect(serviceItems).toHaveCount({ min: 1 });
    
    // Check if lazy loading works by scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Wait for additional items to load
    await page.waitForTimeout(1000);
    
    // Check that more items have loaded
    const newCount = await serviceItems.count();
    expect(newCount).toBeGreaterThan(0);
  });

  test('Search functionality works', async ({ page }) => {
    // Enter search term
    await page.fill('input[type="search"]', 'apartment');
    await page.press('input[type="search"]', 'Enter');
    
    // Check search results
    await expect(page.locator('.search-results')).toBeVisible();
    const results = page.locator('.search-result-item');
    await expect(results).toHaveCount({ min: 1 });
  });

  test('Filter options work correctly', async ({ page }) => {
    // Navigate to apartments page
    await page.click('text=Apartments');
    
    // Apply price filter
    await page.click('text=Filters');
    await page.fill('input[name="minPrice"]', '1000');
    await page.fill('input[name="maxPrice"]', '5000');
    await page.click('text=Apply Filters');
    
    // Check filtered results
    await page.waitForSelector('.apartment-item');
    const apartmentPrices = page.locator('.apartment-price');
    
    // Verify all displayed prices are within range
    const count = await apartmentPrices.count();
    for (let i = 0; i < count; i++) {
      const priceText = await apartmentPrices.nth(i).textContent();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      expect(price).toBeGreaterThanOrEqual(1000);
      expect(price).toBeLessThanOrEqual(5000);
    }
  });
  
  test('Service details page displays correctly', async ({ page }) => {
    // Navigate to services page
    await page.click('text=Services');
    
    // Click on first service
    await page.click('.service-item:first-child');
    
    // Check service details page elements
    await expect(page.locator('.service-details')).toBeVisible();
    await expect(page.locator('.service-title')).toBeVisible();
    await expect(page.locator('.service-description')).toBeVisible();
    await expect(page.locator('.service-price')).toBeVisible();
    await expect(page.locator('.service-image')).toBeVisible();
  });
});

test.describe('Performance Tests', () => {
  test('Page load performance', async ({ page }) => {
    // Create performance observer
    await page.evaluate(() => {
      window.performanceEntries = [];
      const observer = new PerformanceObserver((list) => {
        window.performanceEntries.push(...list.getEntries());
      });
      observer.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
    });
    
    // Navigate to home page
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigationEntry = window.performanceEntries.find(
        entry => entry.entryType === 'navigation'
      );
      const firstPaint = window.performanceEntries.find(
        entry => entry.name === 'first-paint'
      );
      const firstContentfulPaint = window.performanceEntries.find(
        entry => entry.name === 'first-contentful-paint'
      );
      
      return {
        loadTime: navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.startTime : null,
        firstPaint: firstPaint ? firstPaint.startTime : null,
        firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : null,
      };
    });
    
    // Verify performance metrics meet thresholds
    expect(performanceMetrics.loadTime).toBeLessThan(3000);
    expect(performanceMetrics.firstPaint).toBeLessThan(1000);
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500);
  });
  
  test('Image optimization works', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const imageUrls = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.map(img => ({
        src: img.src,
        width: img.width,
        height: img.height,
        isLazy: img.loading === 'lazy',
        hasSrcSet: !!img.srcset
      }));
    });
    
    // Verify image optimization
    for (const img of imageUrls) {
      // Check if images below the fold are lazy loaded
      if (!img.isVisible) {
        expect(img.isLazy).toBe(true);
      }
      
      // Check if responsive images have srcset
      if (img.width > 200) {
        expect(img.hasSrcSet).toBe(true);
      }
    }
  });
});
