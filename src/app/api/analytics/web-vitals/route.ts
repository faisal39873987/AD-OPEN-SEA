import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface WebVitalMetric {
  name: string;        // Metric name (CLS, FID, LCP, etc.)
  value: number;       // Metric value
  delta: number;       // Change in metric value
  id: string;          // Unique ID for the metric
  page: string;        // Page path
  url: string;         // Full URL
  userAgent: string;   // User agent
  timestamp: string;   // ISO timestamp
  category: 'good' | 'needs-improvement' | 'poor'; // Performance category
  entries?: any[];     // Raw performance entries
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const metric: WebVitalMetric = await request.json();
    
    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Get client IP address for geographical analysis (optional)
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Insert metric into database
    const { error } = await supabase
      .from('performance_metrics')
      .insert([
        {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_id: metric.id,
          page_path: metric.page,
          page_url: metric.url,
          user_agent: metric.userAgent,
          ip_address: ipAddress,
          category: metric.category,
          created_at: new Date().toISOString(),
        }
      ]);
    
    if (error) {
      console.error('Error saving web vital metric:', error);
      return NextResponse.json(
        { error: 'Failed to save metric' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web Vitals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
