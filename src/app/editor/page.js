'use client'

// import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { produce } from 'immer'
import BorderDialog from './BorderDialog'

const FONTS = [
  // 'Noto Sans',
  // 'Martian Mono',
  'Climate Crisis',
]

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const [texts, setTexts] = useState([])
  const [selectedText, setSelectedText] = useState(-1)
  const canvasRef = useRef(null)

  const [borderOpen, setBorderOpen] = useState(false)
  const [border, setBorder] = useState({})

  useEffect(() => {
    const handleStart = (e) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const canvasRect = canvas.getBoundingClientRect()

      // Calculate the cursor position within the canvas
      const cursorX = e.clientX - canvasRect.left
      const cursorY = e.clientY - canvasRect.top

      texts.forEach((text, index) => {
        if (
          cursorX >= text.x &&
          cursorX <= text.x + text.width &&
          cursorY <= text.y &&
          cursorY >= text.y - text.height
        ) {
          setSelectedText(index)
        }
      })
    }

    const handleMove = (e) => {
      if (selectedText < 0) return

      const canvas = canvasRef.current
      const canvasRect = canvas.getBoundingClientRect()
      const cursorX = e.clientX - canvasRect.left
      const cursorY = e.clientY - canvasRect.top

      const text = texts[selectedText]

      setTexts(
        produce((draft) => {
          draft[selectedText].x = cursorX - draft[selectedText].width / 2
          draft[selectedText].y = cursorY
        })
      )
    }

    const handleEnd = (e) => {
      setSelectedText(-1)
    }

    const canvas = canvasRef.current
    canvas.addEventListener('mousedown', handleStart)
    canvas.addEventListener('mouseup', handleEnd)
    canvas.addEventListener('mousemove', handleMove)

    return () => {
      canvas.removeEventListener('mousedown', handleStart)
      canvas.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mousemove', handleMove)
    }
  }, [selectedText, texts])

  useEffect(() => {
    if (!selectedImage) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw image
    ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height)

    // Draw texts
    for (let i = 0; i < texts.length; i++) {
      let text = texts[i]
      const { textValue, x, y, textSize, textFont, textStroke, textFill } = text
      ctx.font = `${textSize}px ${textFont}`
      ctx.lineWidth = textSize * 0.1
      ctx.strokeStyle = textStroke
      ctx.strokeText(textValue, x, y)
      ctx.fillStyle = textFill
      ctx.fillText(textValue, x, y)
    }

    // Draw border
    if (border) {
      ctx.lineWidth = border.size
      ctx.strokeStyle = border.color
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }
  }, [border, selectedImage, texts])

  const loadAndDrawImage = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const image = URL.createObjectURL(file)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      const img = new Image()
      img.src = image

      img.onload = function () {
        setSelectedImage(img)

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
  }

  const removeImage = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSelectedImage(null)
    setTexts([])
    setSelectedText(-1)
    setBorder({})
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = 'image.jpg'
    link.href = canvas.toDataURL('image/jpg')
    link.click()
  }

  const reset = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    setTexts([])
    setSelectedText(-1)
    setBorder({})

    ctx.lineWidth = 0
    ctx.strokeStyle = 'transparent'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(selectedImage, 0, 0, canvas.width, canvas.height)
  }

  return (
    <main className='flex flex-col items-center'>
      {selectedImage ? (
        <div>
          <TextDialog
            FONTS={FONTS}
            canvasRef={canvasRef}
            textOpen={textOpen}
            setTextOpen={setTextOpen}
            texts={texts}
            setTexts={setTexts}
          />
          <BorderDialog
            borderOpen={borderOpen}
            setBorderOpen={setBorderOpen}
            border={border}
            setBorder={setBorder}
            canvasRef={canvasRef}
          />
        </div>
      ) : (
        <div>
          <Card className='w-[300px] mx-auto mt-24'>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type='file'
                name='imageInput'
                id='imageInput'
                onChange={loadAndDrawImage}
                accept='image/*'
                className='max-w-xs'
              />
            </CardContent>
          </Card>
        </div>
      )}
      <div>
        <canvas ref={canvasRef} className='w-full' id='canvas'></canvas>
      </div>
      <div>
        {selectedImage ? (
          <div className='my-12 grid grid-cols-3 md:flex gap-4'>
            <Button onClick={() => setTextOpen(true)}>Text</Button>
            <Button onClick={() => setBorderOpen(true)}>Border</Button>
            <Button
              className='bg-green-600 hover:bg-green-500'
              onClick={downloadImage}
            >
              Download
            </Button>
            <Button variant='outline' onClick={reset}>
              Reset
            </Button>
            <Button onClick={removeImage}>New</Button>
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
