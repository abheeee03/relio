import React from 'react'
import { ThemeToggleButton } from './ThemeToggle'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { logout } from '@/lib/actions'
import Link from 'next/link'
import Logo from './logo'

function Nav() {
  return (
     <div className="w-full fixed px-10 py-3 flex justify-between items-center">
                <Link href={'/'}>
                  <Logo/>
                </Link>
                <div className="flex gap-2 items-center justify-center">
                    <ThemeToggleButton variant="rectangle" start="top-down" />
                    <Popover>
                      <PopoverTrigger>
                    <div className="px-3 py-1 bg-accent rounded-full">A</div>
                      </PopoverTrigger>
                      <PopoverContent className='w-30 flex flex-col items-end justify-end'>
                          <Button onClick={()=>logout()} variant={"destructive"}>
                            Logout
                          </Button>
                      </PopoverContent>
                    </Popover>
                </div>
    </div>
  )
}

export default Nav