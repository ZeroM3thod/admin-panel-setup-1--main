import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get authenticated user (secure method)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/admin', '/profile', '/payment']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Check if route requires authentication
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/signin', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes require admin role
  if (pathname.startsWith('/admin') && user) {
    try {
      // Check if user has admin role in database
      const { data: adminRole, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      // If not admin, redirect to home
      if (!adminRole || error) {
        console.log('Admin access denied for:', user.email, 'Error:', error?.message)
        return NextResponse.redirect(new URL('/', req.url))
      }
      
      console.log('Admin access granted for:', user.email, 'Role:', adminRole.role)
    } catch (err) {
      console.error('Admin check error:', err)
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/payment/:path*',
  ],
}
