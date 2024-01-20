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
import { produce } from 'immer'

export default function TextDialog({
  FONTS,
  selectedImage,
  canvasRef,
  textOpen,
  setTextOpen,
  texts,
  setTexts,
}) {
  const [imageText, setImageText] = useState('yoooo')
  const [textFill, setTextFill] = useState('#fff')
  const [textStroke, setTextStroke] = useState('#000')
  const [textFont, setTextFont] = useState('sans-serif')
  const [textSize, setTextSize] = useState(48)

  const updateTextSize = (value) => {
    if (value != '' && value >= 24 && value <= 140) {
      setTextSize(value)
    }
  }

  const addText = () => {
    setTextOpen(false)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const tempText = {
      x: 100,
      y: 100,
      imageText,
      textSize,
      textFont,
      textStroke,
      textFill,
    }

    setTexts(
      produce((draft) => {
        draft.push(tempText)
      })
    )

    setImageText('')
  }

  return (
    <div className='mb-2 flex justify-center gap-8'>
      <Dialog open={textOpen} onOpenChange={setTextOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add text</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-6 mt-4'>
            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='text' className='text-slate-600'>
                Text
              </Label>
              <Input
                id='text'
                value={imageText}
                onChange={(e) => setImageText(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2 items-start'>
              <Label htmlFor='size' className='text-slate-600'>
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
              <Label htmlFor='font' className='text-slate-600'>
                Font
              </Label>
              <Select value={textFont} onValueChange={setTextFont}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a font' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='sans-serif'>Sans Serif</SelectItem>
                    {FONTS.map((font, index) => (
                      <SelectItem key={index} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='flex justify-around'>
              <div className='flex flex-col gap-6'>
                <Label className='text-slate-600'>Fill</Label>
                <div className='flex'>
                  <HexColorPicker
                    className='flex-grow'
                    color={textFill}
                    onChange={setTextFill}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-6'>
                <Label className='text-slate-600'>Stroke</Label>
                <div className='flex'>
                  <HexColorPicker
                    className='flex-grow'
                    color={textStroke}
                    onChange={setTextStroke}
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            type='button'
            onClick={() => (imageText ? addText() : null)}
            className='mt-4'
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
