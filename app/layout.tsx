import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistPixelGrid } from 'geist/font/pixel'
import { ThemeProvider } from '@/components/theme-provider'
import { AdminProvider } from '@/lib/admin-store'
import { AuthProvider } from '@/lib/auth-store'
import { StructuredData } from './components/structured-data'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'HASAN LIB | Hasan.lib - Brutalist Component Library & Copy-Paste UI Kit',
  description:
    'HASAN LIB (Hasan.lib) - A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live mobile / tablet / desktop previews. Features Geist Pixel typography, dot-grid backgrounds, live terminal animations, scramble-text micro-interactions, bento feature grids, and a fully responsive dark industrial design system. Built with Next.js 16, Tailwind CSS, and Framer Motion.',
  keywords: [
    'HASAN LIB',
    'HASAN.LIB',
    'Hasan lib',
    'Hasan.lib',
    'hasanlib',
    'hasan library',
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
  authors: [{ name: 'HASAN LIB' }],
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
    url: 'https://hasanlib.vercel.app',
    title: 'HASAN LIB | Hasan.lib - Brutalist Component Library & Copy-Paste UI Kit',
    description:
      'HASAN LIB (Hasan.lib) - A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live mobile / tablet / desktop previews. Next.js 16 + Tailwind CSS + Framer Motion.',
    siteName: 'HASAN LIB',
    images: [
      {
        url: 'https://hasanlib.vercel.app/images/about-isometric.jpg',
        width: 1200,
        height: 630,
        alt: 'HASAN LIB - Brutalist Component Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HASAN LIB | Brutalist Component Library',
    description:
      'HASAN LIB - A brutalist open-source component library for the web. Copy-paste components, animated effects, blocks, and full landing templates with live previews. Built with Next.js 16.',
    creator: '@sysint',
    images: ['https://hasanlib.vercel.app/images/about-isometric.jpg'],
  },
  alternates: {
    canonical: 'https://hasanlib.vercel.app',
  },
  category: 'technology',
  verification: {
    google: 'google6dff2d69354829b0',
  },
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://hasanlib.vercel.app" />
        <meta name="google-site-verification" content="google6dff2d69354829b0" />
        <StructuredData />
      </head>
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
