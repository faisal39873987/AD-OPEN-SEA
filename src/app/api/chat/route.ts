import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Log user request
    if (userId) {
      await supabase
        .from('user_requests')
        .insert({
          user_id: userId,
          service_type: 'chat',
          request_data: { message }
        })
    }

    // For now, redirect to GPT Assistant
    const assistantUrl = process.env.NEXT_PUBLIC_GPT_ASSISTANT_URL || 'https://chatgpt.com/g/g-6878b2d4d774819186609d62df9274c2-ad-plus?model=gpt-4-5'
    
    return NextResponse.json({
      message: 'تم توجيهك إلى مساعد الذكي الاصطناعي المخصص للإعلانات',
      redirectUrl: assistantUrl,
      response: `مرحباً! لمساعدتك في ${message}، يرجى النقر على الرابط للوصول لمساعد الذكي الاصطناعي المخصص.`
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
