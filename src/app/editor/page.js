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

const FONTS = ['Noto Sans', 'Martian Mono', 'Climate Crisis']

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [textOpen, setTextOpen] = useState(false)
  const [texts, setTexts] = useState([])
  const [selectedText, setSelectedText] = useState(-1)
  const canvasRef = useRef(null)

  const [borderOpen, setBorderOpen] = useState(false)
  const [border, setBorder] = useState({})
  const [history, setHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [manualAction, setManualAction] = useState(false)

  useEffect(() => {
    const handleStart = (e) => {
      setManualAction(true)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const canvasRect = canvas.getBoundingClientRect()
      const clientX = e.clientX
      const clientY = e.clientY

      // Calculate the cursor position within the canvas
      const cursorX = clientX - canvasRect.left
      const cursorY = clientY - canvasRect.top

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
      const clientX = e.clientX
      const clientY = e.clientY

      const cursorX = clientX - canvasRect.left
      const cursorY = clientY - canvasRect.top

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

  // History is only updated when a manual action is taken. Hence, the current index of the history will always be the last item in the array.
  useEffect(() => {
    setCurrentIndex(history.length - 1)
  }, [history])

  useEffect(() => {
    // Add to history if action is taken by the user
    if (manualAction) {
      const currentBorder = structuredClone(border)
      const currentSelectedImage = selectedImage
      const currentTexts = structuredClone(texts)
      setHistory((h) => [
        ...h,
        { currentBorder, currentSelectedImage, currentTexts },
      ])
    }

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
    if (Object.keys(border).length > 0) {
      ctx.lineWidth = border.size
      ctx.strokeStyle = border.color
      ctx.strokeRect(0, 0, canvas.width, canvas.height)
    }
  }, [border, manualAction, selectedImage, texts])

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

  function handleUndo() {
    setManualAction(false)
    if (currentIndex > 0) {
      const previousCanvas = history[currentIndex - 1]
      const { currentBorder, currentSelectedImage, currentTexts } =
        previousCanvas
      setBorder(currentBorder)
      setSelectedImage(currentSelectedImage)
      setTexts(currentTexts)
      setCurrentIndex(currentIndex - 1)
    }
  }

  function handleRedo() {
    setManualAction(false)
    if (currentIndex < history.length - 1) {
      const nextCanvas = history[currentIndex + 1]
      const { currentBorder, currentSelectedImage, currentTexts } = nextCanvas
      setBorder(currentBorder)
      setSelectedImage(currentSelectedImage)
      setTexts(currentTexts)
      setCurrentIndex(currentIndex + 1)
    }
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
        <canvas ref={canvasRef} className='w-full mt-2' id='canvas'></canvas>
        {selectedImage ? (
          <div className='mt-12 '>
            <div className='mb-6 flex gap-4'>
              <Button className='flex-grow' onClick={handleUndo}>
                Undo
              </Button>
              <Button className='flex-grow' onClick={handleRedo}>
                Redo
              </Button>
            </div>
            <div className='grid grid-cols-4 grid-rows-2 gap-4'>
              <Button
                className='col-span-2'
                onClick={() => {
                  setManualAction(true)
                  setTextOpen(true)
                }}
              >
                Text
              </Button>
              <Button
                className='col-span-2'
                onClick={() => {
                  setManualAction(true)
                  setBorderOpen(true)
                }}
              >
                Border
              </Button>

              <Button onClick={removeImage}>New</Button>
              <Button variant='outline' onClick={reset}>
                Reset
              </Button>
              <Button
                className='bg-green-600 hover:bg-green-500 col-span-2'
                onClick={downloadImage}
              >
                Download
              </Button>
            </div>
          </div>
        ) : null}
      </div>

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
