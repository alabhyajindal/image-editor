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
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@radix-ui/react-label'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import toast from 'react-hot-toast'

export default function BorderDialog({
  borderOpen,
  setBorderOpen,
  border,
  setBorder,
  canvasRef,
}) {
  const [borderColor, setBorderColor] = useState('#38f')
  const [borderSize, setBorderSize] = useState(24)

  const addBorder = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.lineWidth = borderSize
    ctx.strokeStyle = borderColor
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setBorder({ size: borderSize, color: borderColor })
    setBorderOpen(false)
  }

  return (
    <div className='mb-2 flex justify-center gap-8'>
      <Dialog open={borderOpen} onOpenChange={setBorderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add border</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-6 '>
            <div className='text-slate-600 flex items-center justify-between'>
              <p className='font-medium text-sm'>Size</p>
              <p className='ml-1 text-slate-400 text-sm'>{borderSize}</p>
            </div>

            <Slider
              value={[borderSize]}
              onValueChange={(v) => setBorderSize(v)}
              max={100}
              min={1}
              step={1}
            />
          </div>

          <div className='flex flex-col gap-4'>
            <div className='text-slate-600 flex items-center justify-between'>
              <p className='font-medium text-sm'>Color</p>
              <p className='ml-1 text-slate-400 text-sm'>{borderColor}</p>
            </div>
            <div className='flex'>
              <HexColorPicker
                className='flex-grow'
                color={borderColor}
                onChange={setBorderColor}
              />
            </div>
          </div>

          <Button onClick={addBorder} className='mt-4'>
            {Object.keys(border).length > 0 ? 'Update' : 'Add'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
