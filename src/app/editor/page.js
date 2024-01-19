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
import { Form } from '@/components/ui/form'
import toast from 'react-hot-toast'
import TextDialog from './TextDialog'

const FONTS = ['Noto Sans', 'Martian Mono', 'Climate Crisis']

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const canvasRef = useRef(null)

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

  const grayscale = () => {
    const img = new Image()
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = avg
      data[i + 1] = avg
      data[i + 2] = avg
    }
    ctx.putImageData(imageData, 0, 0)
  }

  const invert = () => {
    const img = new Image()
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i] // red
      data[i + 1] = 255 - data[i + 1] // green
      data[i + 2] = 255 - data[i + 2] // blue
    }
    ctx.putImageData(imageData, 0, 0)
  }

  const reset = () => {
    drawImageOnCanvas(selectedImage)
  }

  return (
    <main className='flex flex-col items-center justify-center'>
      {selectedImage ? (
        <TextDialog
          FONTS={FONTS}
          selectedImage={selectedImage}
          canvasRef={canvasRef}
          textOpen={textOpen}
          setTextOpen={setTextOpen}
        />
      ) : (
        <Input
          type='file'
          name='imageInput'
          id='imageInput'
          onChange={handleImageUpload}
          accept='image/*'
          className='cursor-pointer max-w-xs'
        />
      )}
      <div className='flex gap-6'>
        <canvas ref={canvasRef} className='w-full' id='canvas'></canvas>
        {selectedImage ? (
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col gap-4'>
              <Button onClick={() => setTextOpen(true)}>Text</Button>
              <Button onClick={grayscale}>Grayscale</Button>
              <Button onClick={invert}>Invert</Button>
              <Button
                className='bg-green-600 hover:bg-green-500'
                onClick={downloadImage}
              >
                Download
              </Button>
            </div>
            <div className='flex flex-col gap-4'>
              <Button className='bg-red-600 hover:bg-red-500' onClick={reset}>
                Reset
              </Button>
              <Button onClick={removeImage}>New</Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Loading fonts */}
      <section className='invisible'>
        {FONTS.map((font, index) => (
          <div key={index} style={{ fontFamily: font }}>
            .
          </div>
        ))}
      </section>
    </main>
  )
}
