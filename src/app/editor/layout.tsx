import { Barlow } from 'next/font/google'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import '@/styles/liquid-tokens.css'
import '@/styles/liquid-site.css'
import { LiquidTheme } from '@/shared/ui/liquid/LiquidTheme'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`liquid-site ${geistSans.variable} ${geistMono.variable} ${barlow.variable}`}
      lang="en"
    >
      <head></head>
      <body className="font-sans">
        <LiquidTheme>{children}</LiquidTheme>
      </body>
    </html>
  )
}

