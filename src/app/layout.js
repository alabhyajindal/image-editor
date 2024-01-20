import { Inter } from 'next/font/google'
import './globals.css'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Toaster } from 'react-hot-toast'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Image Editor',
  description: 'Online image editor',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <section className='flex flex-col min-h-screen'>
          <header className='flex items-center justify-between w-full p-4'>
            <h1 className='text-2xl font-semibold'>
              <Link href='/'>Image Editor</Link>
            </h1>
            <div>
              <a href='https://github.com/alabhyajindal/image-editor'>
                <GitHubLogoIcon height={24} width={24} />
              </a>
            </div>
          </header>

          <section className='mx-12 flex-1'>{children}</section>
        </section>

        <Toaster />
      </body>
    </html>
  )
}
