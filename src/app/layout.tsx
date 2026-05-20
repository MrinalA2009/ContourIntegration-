import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Cormorant_Garamond } from 'next/font/google'
import 'katex/dist/katex.min.css'
import './globals.css'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { Navigation } from '@/components/layout/Navigation'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Contour Integration — A Visual Journey Through Complex Analysis',
  description:
    'A cinematic, scroll-driven exploration of complex analysis, contour integration, and the residue theorem. Built for mathematical elegance.',
  keywords: ['complex analysis', 'contour integration', 'mathematics', 'visualization'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030508',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable}`}
    >
      <body>
        <LenisProvider>
          <Navigation />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  )
}
