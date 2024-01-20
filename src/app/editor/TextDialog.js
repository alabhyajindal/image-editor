'use client'

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
import { Slider } from '@/components/ui/slider'

export default function TextDialog({
  FONTS,
  canvasRef,
  textOpen,
  setTextOpen,
  texts,
  setTexts,
}) {
  const [textValue, setTextValue] = useState('yoooo')
  const [textFill, setTextFill] = useState('#fff')
  const [textFont, setTextFont] = useState('Climate Crisis')
  const [textSize, setTextSize] = useState(48)

  const addText = () => {
    if (!textValue) return
    if (!textSize) return
    if (textSize < 24 || textSize > 120) {
      toast.error('Please enter a text size between 24 and 120')
      return
    }

    const x = 100
    const y = 100
    const textStroke = '#000'

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.font = `${textSize}px ${textFont}`
    ctx.lineWidth = textSize * 0.1
    ctx.strokeStyle = textStroke

    ctx.strokeText(textValue, x, y)
    ctx.fillStyle = textFill
    ctx.fillText(textValue, x, y)

    const width = ctx.measureText(textValue).width
    const height = textSize

    const tempText = {
      x,
      y,
      textValue,
      textSize,
      textFont,
      textStroke,
      textFill,
      width,
      height,
    }

    setTexts(
      produce((draft) => {
        draft.push(tempText)
      })
    )

    setTextValue('')
    setTextOpen(false)
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
              <div className='text-slate-600'>
                <p className='font-medium text-sm'>Text</p>
              </div>

              <Input
                id='text'
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div className='text-slate-600 flex items-center justify-between'>
                <p className='font-medium text-sm'>Size</p>
                <p className='ml-1 text-slate-400 text-sm'>{textSize}</p>
              </div>

              <Slider
                value={[textSize]}
                onValueChange={(v) => setTextSize(v)}
                max={100}
                min={1}
                step={1}
              />
            </div>

            <div className='flex flex-col gap-2 items-start'>
              <div className='text-slate-600'>
                <p className='font-medium text-sm'>Font</p>
              </div>
              <Select value={textFont} onValueChange={setTextFont}>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a font' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FONTS.map((font, index) => (
                      <SelectItem key={index} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className='flex flex-col gap-6'>
              <div className='text-slate-600 flex items-center justify-between'>
                <p className='font-medium text-sm'>Fill</p>
                <p className='ml-1 text-slate-400 text-sm'>{textFill}</p>
              </div>
              <div className='flex'>
                <HexColorPicker
                  className='flex-grow'
                  color={textFill}
                  onChange={setTextFill}
                />
              </div>
            </div>
          </div>
          <Button type='button' onClick={addText} className='mt-4'>
            Add
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
