import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const sessionData = JSON.parse(
        Buffer.from(sessionCookie.value, 'base64').toString()
      )

      // Check if session is expired
      if (sessionData.exp < Date.now()) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: sessionData.userId,
          username: sessionData.username
        }
      })
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
