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
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  const { toast } = useToast()

  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const [imageText, setImageText] = useState('')
  const [textColor, setTextColor] = useState('#020617')
  const [textFont, setTextFont] = useState('sans-serif')
  const [textSize, setTextSize] = useState(48)

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

  const updateTextSize = (value) => {
    if (value != '' && value >= 24 && value <= 140) {
      setTextSize(value)
    }
  }

  const addText = (x, y) => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `${textSize}px ${textFont}`
    ctx.fillStyle = textColor
    ctx.fillText(imageText, x, y)

    setImageText('')
  }

  const promptForTextPosition = () => {
    toast({ description: 'Click on the image to add text' })
    setTextOpen(false)
    const canvas = canvasRef.current

    const clickHandler = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      addText(x, y)
      canvas.removeEventListener('click', clickHandler)
    }

    canvas.addEventListener('click', clickHandler)
  }

  return (
    <main className='min-h-screen flex flex-col items-center justify-center'>
      {selectedImage ? (
        <div className='mb-2 flex justify-center gap-8'>
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
                    onChange={(e) => updateTextSize(e.target.value)}
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
                        <SelectItem value='Luckiest Guy'>
                          Luckiest Guy
                        </SelectItem>
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
              <Button type='button' onClick={promptForTextPosition}>
                Add
              </Button>
            </DialogContent>
          </Dialog>
          <Button onClick={downloadImage}>Download</Button>
        </div>
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
      <div>
        <canvas ref={canvasRef} className='w-full' id='canvas'></canvas>
      </div>

      {/* Loading fonts */}
      <section className='invisible'>
        <div style={{ fontFamily: 'Luckiest Guy' }}>.</div>
      </section>
    </main>
  )
}
