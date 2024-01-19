import { Inter } from 'next/font/google'
import './globals.css'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Image Editor',
  description: 'Online image editor',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <header className='absolute top-0 flex items-center justify-between w-full p-4'>
          <h1 className='text-2xl font-semibold'>Image Editor</h1>
          <div>
            <a href='https://github.com/alabhyajindal/image-editor'>
              <GitHubLogoIcon height={24} width={24} />
            </a>
          </div>
        </header>
        {children}

        <Toaster />
      </body>
    </html>
  )
}
