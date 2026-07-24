"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import CustomButton from "./CustomButton"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const path = usePathname()
  return (
    <SidebarGroup className="mt-5">
      <SidebarMenu>
        {items.map((item) => (
            <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="w-full">
                <CustomButton
                variant={path === item.url ? "NORMAL" : "NOSTYLE"}
                className={cn("w-full", path != item.url && "py-2")}>
                  <div className="flex items-center justify-start">
                  <div className="px-2">
                  <item.icon size={18} />
                  </div>
                  <span className={cn(
                    "text-lg",
                    path === item.url && "font-medium"
                  )}
                  >{item.title}</span>
                  </div>
                </CustomButton>
                </Link>
            
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
