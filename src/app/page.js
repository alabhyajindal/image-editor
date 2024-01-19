'use client'

// import Image from 'next/image'
import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const [imageText, setImageText] = useState('')

  function drawImageOnCanvas(imagePath) {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = imagePath
    img.onload = function () {
      if (img.height > img.width) {
        canvas.width = 500
        const ratio = img.height / img.width
        canvas.height = canvas.width * ratio
      } else {
        canvas.height = 500
        const ratio = img.width / img.height
        canvas.width = canvas.height * ratio
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      setSelectedImage(image)
      drawImageOnCanvas(image)
    }
  }

  const removeImage = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSelectedImage(null)
  }

  const downloadImage = () => {
    const canvas = document.getElementById('canvas')
    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = canvas.toDataURL('image/jpg')
    link.click()
  }

  const addText = () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = '50px sans-serif'
    ctx.fillText(imageText, 50, 50)

    setTextOpen(false)
    setImageText('')
  }

  return (
    <main className='min-h-screen p-24 flex justify-center'>
      <div className='mt-4'>
        {selectedImage ? (
          <div className='mb-2 flex justify-between px-1'>
            <Button variant='outline' onClick={removeImage}>
              New
            </Button>
            <Dialog open={textOpen} onOpenChange={setTextOpen}>
              <DialogTrigger asChild>
                <Button>Add Text</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add text</DialogTitle>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='text' className='text-right'>
                      Text
                    </Label>
                    <Input
                      id='text'
                      value={imageText}
                      onChange={(e) => setImageText(e.target.value)}
                      className='col-span-3'
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='button' onClick={addText}>
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={downloadImage}>Download</Button>
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
        <div className='max-w-xl'>
          <canvas className='w-full' id='canvas'></canvas>
        </div>
        {selectedImage ? <div className='mt-2'></div> : null}
      </div>
    </main>
  )
}
