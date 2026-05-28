import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Verify password using pgcrypto's crypt function
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username')
      .eq('username', username)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password hash using raw SQL with pgcrypto
    const { data: verifyData, error: verifyError } = await supabase
      .rpc('verify_admin_password', {
        p_username: username,
        p_password: password
      })

    if (verifyError || !verifyData) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a simple session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: data.id,
        username: data.username,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      })
    ).toString('base64')

    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
