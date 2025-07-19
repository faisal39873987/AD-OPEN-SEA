import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/services/paymentService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, bookingId, userId, serviceProviderId, currency } = body

    if (!amount || !bookingId || !userId || !serviceProviderId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createPaymentIntent({
      amount,
      currency: currency || 'usd',
      bookingId,
      userId,
      serviceProviderId,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
