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
import { HexColorPicker } from 'react-colorful'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const [imageText, setImageText] = useState('')
  const [textColor, setTextColor] = useState('#020617')
  const [textFont, setTextFont] = useState('sans-serif')
  const [textSize, setTextSize] = useState(48)

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
    ctx.font = `${textSize}px ${textFont}`
    ctx.fillStyle = textColor
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
                <div className='flex flex-col gap-6 mt-4'>
                  <div className='flex flex-col gap-2 items-start'>
                    <Label htmlFor='text' className='text-right text-slate-600'>
                      Text
                    </Label>
                    <Input
                      id='text'
                      value={imageText}
                      onChange={(e) => setImageText(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col gap-2 items-start'>
                    <Label htmlFor='size' className='text-right text-slate-600'>
                      Size
                    </Label>
                    <Input
                      value={textSize}
                      onChange={(e) => setTextSize(e.target.value)}
                      type='number'
                      min='24'
                      id='size'
                    />
                  </div>

                  <div className='flex flex-col gap-2 items-start'>
                    <Label htmlFor='font' className='text-right text-slate-600'>
                      Font
                    </Label>
                    <Select value={textFont} onValueChange={setTextFont}>
                      <SelectTrigger>
                        <SelectValue placeholder='Choose a font' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='serif'>Serif</SelectItem>
                          <SelectItem value='sans-serif'>Sans-Serif</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex'>
                    <HexColorPicker
                      className='flex-grow'
                      color={textColor}
                      onChange={setTextColor}
                    />
                  </div>
                </div>
                <Button type='button' onClick={addText}>
                  Add
                </Button>
              </DialogContent>
            </Dialog>
            <Button onClick={downloadImage}>Download</Button>
          </div>
        ) : (
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl mb-12 font-semibold'>
              Upload an image to get started
            </h2>
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
