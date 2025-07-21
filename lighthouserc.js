module.exports = {
  ci: {
    collect: {
      // Collect Lighthouse performance metrics for the following URLs
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      // Use Chromium with specific settings optimized for CI
      settings: {
        chromeFlags: '--no-sandbox --disable-gpu',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2'],
      },
    },
    upload: {
      // Don't upload the results to the LHCI server
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance budgets
      preset: 'lighthouse:recommended',
      assertions: {
        // Set specific thresholds for important metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 2 }],
        'resource-summary:script:size': ['warn', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 100000 }],
        'resource-summary:image:size': ['warn', { maxNumericValue: 400000 }],
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 10 }],
      },
    },
  },
};
