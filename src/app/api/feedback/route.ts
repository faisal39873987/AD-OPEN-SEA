import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface FeedbackData {
  type: string;
  rating: number;
  comment: string;
  url: string;
  userAgent: string;
  timestamp: string;
  performanceData?: {
    loadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data: FeedbackData = await request.json();
    
    // Validate required fields
    if (!data.type || !data.rating || data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }
    
    // Get client IP address for geographical analysis (optional)
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Insert feedback into database
    const { data: insertedData, error } = await supabase
      .from('user_feedback')
      .insert([
        {
          feedback_type: data.type,
          rating: data.rating,
          comment: data.comment || null,
          page_url: data.url,
          user_agent: data.userAgent,
          ip_address: ipAddress,
          performance_data: data.performanceData || null,
          created_at: new Date().toISOString(),
        }
      ])
      .select('id');
    
    if (error) {
      console.error('Error saving feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }
    
    // Log to application insights or other monitoring tools
    console.log(`Feedback received - Type: ${data.type}, Rating: ${data.rating}, ID: ${insertedData?.[0]?.id}`);
    
    return NextResponse.json({ success: true, id: insertedData?.[0]?.id });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
