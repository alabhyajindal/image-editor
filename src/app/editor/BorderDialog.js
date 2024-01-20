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
  const [borderSize, setBorderSize] = useState(12)

  const addBorder = () => {
    if (!borderSize) return
    if (borderSize < 4 || borderSize > 50) {
      toast.error('Please enter a border size between 4 and 50')
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.lineWidth = borderSize
    ctx.strokeStyle = borderColor
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    setBorder({ size: borderSize, color: borderColor })
    setBorderOpen(false)

    // Add to border array, an object with these two info
  }

  const removeBorder = () => {
    setBorder({})
    setBorderOpen(false)
  }

  return (
    <div className='mb-2 flex justify-center gap-8'>
      <Dialog open={borderOpen} onOpenChange={setBorderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add border</DialogTitle>
          </DialogHeader>

          <div className='flex flex-col gap-2 items-start'>
            <Label htmlFor='borderSize' className='text-slate-600'>
              Size
            </Label>
            <Input
              name='borderSize'
              value={borderSize}
              onChange={(e) => setBorderSize(e.target.value)}
              type='number'
              min='4'
            />
          </div>

          <div className='flex flex-col gap-6'>
            <Label className='text-slate-600'>Color</Label>
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
          {Object.keys(border).length > 0 ? (
            <Button onClick={removeBorder} variant='outline'>
              Remove
            </Button>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
