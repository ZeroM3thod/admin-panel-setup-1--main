import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Plan pricing configuration
const PLAN_PRICES = {
  pro: 29,
  professional: 99,
} as const

// Blockchain TX ID validation patterns
const TX_PATTERNS = {
  BTC: /^[a-f0-9]{64}$/i,
  ETH: /^0x[a-f0-9]{64}$/i,
  USDT_ERC20: /^0x[a-f0-9]{64}$/i,
  USDT_TRC20: /^[a-f0-9]{64}$/i,
  USDT_BEP20: /^0x[a-f0-9]{64}$/i,
}

// Request validation schema
const paymentSchema = z.object({
  requestedPlan: z.enum(['pro', 'professional']),
  coin: z.enum(['BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'USDT_BEP20']),
  network: z.string().min(1),
  txId: z.string().min(10).max(100),
  depositAddress: z.string().min(10),
})

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = paymentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { requestedPlan, coin, network, txId, depositAddress } = validation.data

    // Validate TX ID format based on coin type
    const txPattern = TX_PATTERNS[coin]
    if (txPattern && !txPattern.test(txId)) {
      return NextResponse.json(
        { error: `Invalid transaction ID format for ${coin}` },
        { status: 400 }
      )
    }

    // Check for duplicate transaction ID
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('tx_id', txId)
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: 'This transaction ID has already been submitted' },
        { status: 409 }
      )
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email, status')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user is suspended
    if (profile.status === 'suspended') {
      return NextResponse.json(
        { error: 'Your account is suspended. Please contact support.' },
        { status: 403 }
      )
    }

    // Server determines the amount (not client!)
    const amount = PLAN_PRICES[requestedPlan]

    // Insert payment record
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert({
        user_id: session.user.id,
        user_name: profile.name,
        user_email: profile.email,
        requested_plan: requestedPlan,
        amount,
        coin,
        network,
        deposit_address: depositAddress,
        tx_id: txId,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Payment insertion error:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit payment. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment submitted successfully',
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Payment API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
