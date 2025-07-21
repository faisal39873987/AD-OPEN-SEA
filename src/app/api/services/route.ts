import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Search services in database
    let servicesQuery = supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .limit(10)

    if (query) {
      servicesQuery = servicesQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data: services, error } = await servicesQuery

    if (error) {
      console.error('Services fetch error:', error)
      // Return fallback services if database fails
      return NextResponse.json({
        services: [
          {
            id: 'google-ads',
            name: 'إعلانات جوجل',
            description: 'إنشاء وإدارة حملات إعلانية على جوجل',
            price: 500,
            category: 'google-ads'
          },
          {
            id: 'facebook-ads', 
            name: 'إعلانات فيسبوك',
            description: 'إنشاء وإدارة حملات إعلانية على فيسبوك وإنستجرام',
            price: 400,
            category: 'social-media'
          },
          {
            id: 'content-creation',
            name: 'إنشاء المحتوى',
            description: 'تصميم وكتابة محتوى إعلاني جذاب',
            price: 300,
            category: 'content'
          }
        ]
      })
    }

    return NextResponse.json({ services })

  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
