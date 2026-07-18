import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistPixelGrid } from 'geist/font/pixel'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/lib/admin-store'
import { AuthProvider } from '@/lib/auth-store'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Hasan.lib | Brutalist Component Library & Copy-Paste UI Kit',
  description:
    'A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live mobile / tablet / desktop previews. Features Geist Pixel typography, dot-grid backgrounds, live terminal animations, scramble-text micro-interactions, bento feature grids, and a fully responsive dark industrial design system. Built with Next.js 16, Tailwind CSS, and Framer Motion.',
  keywords: [
    'brutalist component library',
    'copy paste ui components',
    'react component library',
    'engineering UI kit',
    'Next.js components',
    'Tailwind CSS components',
    'dark UI kit',
    'Geist Pixel font',
    'bento grid layout',
    'SaaS pricing page',
    'Framer Motion animations',
    'monospace design system',
    'developer component library',
    'landing page templates',
    'industrial web design',
    'dot matrix typography',
    'terminal UI components',
    'shadcn ui alternative',
    'open source ui library',
  ],
  authors: [{ name: 'Hasan.lib' }],
  creator: 'System Intelligence Corp.',
  publisher: 'System Intelligence Corp.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Hasan.lib | Brutalist Component Library & Copy-Paste UI Kit',
    description:
      'A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live mobile / tablet / desktop previews. Next.js 16 + Tailwind CSS + Framer Motion.',
    siteName: 'Hasan.lib',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hasan.lib | Brutalist Component Library',
    description:
      'A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live previews. Built with Next.js 16.',
    creator: '@sysint',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#0F0F0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${GeistPixelGrid.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <AdminProvider>
              {children}
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
