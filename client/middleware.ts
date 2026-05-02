import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth-optional middleware — works with or without Clerk keys
// Pages are accessible in demo mode without authentication
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
