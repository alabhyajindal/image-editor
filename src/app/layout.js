import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Image Editor',
  description: 'Online image editor',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <header>
          <h1 className='mt-24 text-4xl font-semibold text-center'>
            Image Editor
          </h1>
        </header>
        <section>{children}</section>
        <Toaster />
      </body>
    </html>
  )
}
