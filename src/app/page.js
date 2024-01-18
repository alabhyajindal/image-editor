'use client'

// import Image from 'next/image'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)

  function addTextToImage(imagePath, text) {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')

    // Draw Image function
    const img = new Image()
    img.src = imagePath
    img.onload = function () {
      const hRatio = canvas.width / img.width
      const vRatio = canvas.height / img.height
      const ratio = Math.min(hRatio, vRatio)
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        img.width * ratio,
        img.height * ratio
      )

      context.lineWidth = 1
      context.fillStyle = '#00ff'
      context.font = '24px sans-serif'
      context.fillText(text, 50, 50)
      setDownloadURL()
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setSelectedImage(image)
      addTextToImage(image, 'this is a dummy text')
    }
  }

  const setDownloadURL = () => {
    const canvas = document.getElementById('canvas')
    const imageDataURL = canvas.toDataURL('image/png')
    const downloadLinkElem = document.getElementById('download-link')
    downloadLinkElem.href = imageDataURL
  }

  const removeImage = () => {
    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    setSelectedImage(null)
  }

  return (
    <main className='min-h-screen flex flex-col items-center p-24'>
      <div className='mt-4'>
        {selectedImage ? (
          <div className='mb-2 flex justify-between px-1'>
            <Button>Add Text</Button>
            <a href='#' id='download-link' download='image'>
              <Button>Download</Button>
            </a>
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
          <canvas id='canvas' width={800} height={800}></canvas>
        </div>
        {selectedImage ? (
          <div>
            <Button onClick={() => removeImage()}>New</Button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
