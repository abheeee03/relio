import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggleButton } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

function MainLayout({children}: {children: ReactNode}) {
  return (
    <>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
             <ThemeToggleButton variant="rectangle" start="top-down" />
          </div>
        </header>
        
      {children}
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}

export default MainLayout