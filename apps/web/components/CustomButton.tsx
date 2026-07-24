import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

function CustomButton({children, className, variant="NORMAL"}: {children: ReactNode, className?: string, variant?: "NORMAL" | "NOSTYLE"}) {
  return (
    <button className={cn(
      className,
      "cursor-pointer",
      variant === "NORMAL" && "rounded-lg py-2 cursor-pointer border-t-2 shadow bg-background/50",
    )
    }>
      {children}
    </button>
  )
}

export default CustomButton