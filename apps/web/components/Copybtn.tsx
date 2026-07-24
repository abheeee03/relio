'use client'

import { useState } from 'react'

import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const CopyButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button variant='ghost' className='relative disabled:opacity-100' onClick={handleCopy} disabled={copied}>
      <span className={cn('transition-all', copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0')}>
        <CheckIcon size={5} className='stroke-green-600 dark:stroke-green-400' />
      </span>
      <span className={cn('absolute left-4 transition-all', copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100')}>
        <CopyIcon size={5} />
      </span>
    </Button>
  )
}

export default CopyButton
