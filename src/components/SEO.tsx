import React from 'react';
import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export default function SEO({
  title = 'AD Pulse - Advanced AI Assistant',
  description = 'Experience the next generation of AI assistants with AD Pulse. Chat, get insights, and boost your productivity.',
  canonical = 'https://adplus.app',
  ogImage = 'https://adplus.app/images/og-image.jpg',
  noindex = false,
}: SEOProps) {
  const siteTitle = title.includes('AD Pulse') ? title : `${title} | AD Pulse`;
  
  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* PWA */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#3b82f6" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </Head>
  );
}
