"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Logo from "./logo"
import { Badge } from "./ui/badge"
import { FaXTwitter } from "react-icons/fa6"

const data = {
  user: {
    name: "Abhee",
    email: "contact@abhee.dev",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Bot,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bot,
    },
    {
      title: "All Websites",
      url: "/websites",
      icon: BookOpen,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Follow on X",
      url: "https://x.com/_AbhayHere",
      icon: FaXTwitter,
    }, 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xl font-medium">Relio</span>
                  <Badge variant={"outline"} className="truncate text-xs">All System Up</Badge>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
