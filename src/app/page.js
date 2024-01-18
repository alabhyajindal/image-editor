'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setSelectedImage(image)
    }
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <div>
        <Input
          type='file'
          name='imageInput'
          id='imageInput'
          onChange={handleImageUpload}
          accept='image/*'
        />
      </div>
      <div className='mt-4'>
        {selectedImage && (
          <Image
            src={selectedImage}
            alt='Uploaded Image'
            height={800}
            width={800}
          />
        )}
      </div>
    </main>
  )
}
