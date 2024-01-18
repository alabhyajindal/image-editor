'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isGrayscale, setIsGrayscale] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setSelectedImage(image)
    }
  }

  const toggleGrayscale = () => {
    setIsGrayscale((g) => !g)
  }

  return (
    <main className='min-h-screen flex flex-col items-center p-24'>
      <div className='mt-4'>
        {selectedImage ? (
          <div className='mb-2'>
            <Toggle pressed={isGrayscale} onClick={toggleGrayscale}>
              Grayscale
            </Toggle>
          </div>
        ) : (
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl mb-12'>Choose an image to get started</h2>
            <Input
              type='file'
              name='imageInput'
              id='imageInput'
              onChange={handleImageUpload}
              accept='image/*'
              className='cursor-pointer max-w-xs'
            />
          </div>
        )}
        <div>
          {selectedImage && (
            <Image
              src={selectedImage}
              alt='Uploaded Image'
              height={500}
              width={500}
            />
          )}
        </div>
      </div>
    </main>
  )
}
