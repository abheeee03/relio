"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getUserData } from "@/lib/actions"
import { WebsiteResponse } from "@/lib/types"
import { AlertTriangle, ArrowDown, ArrowUp, Bell, BellOff, CheckCircle2, Clock, Globe, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Notification = {
  id: string
  type: "down" | "up" | "warning"
  websiteId: string
  websiteUrl: string
  message: string
  timestamp: Date
  read: boolean
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [websites, setWebsites] = useState<WebsiteResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await getUserData()
      if (data?.data?.websites) {
        const websitesData: WebsiteResponse[] = data.data.websites
        setWebsites(websitesData)

        // Generate notifications based on website status changes
        const generatedNotifications: Notification[] = []

        websitesData.forEach((website) => {
          // Check for down websites
          if (website.ticks?.[0]?.status === "Down") {
            generatedNotifications.push({
              id: `${website.id}-down`,
              type: "down",
              websiteId: website.id,
              websiteUrl: website.url,
              message: `${website.url.replace("https://", "")} is currently down`,
              timestamp: new Date(),
              read: false
            })
          }

          // Check for status changes in recent ticks
          for (let i = 0; i < website.ticks.length - 1; i++) {
            const current = website.ticks[i]
            const previous = website.ticks[i + 1]

            if (current && previous && current.status !== previous.status) {
              const minutesAgo = (i + 1) * 5
              const timestamp = new Date()
              timestamp.setMinutes(timestamp.getMinutes() - minutesAgo)

              if (current.status === "Up" && previous.status === "Down") {
                generatedNotifications.push({
                  id: `${website.id}-recovery-${i}`,
                  type: "up",
                  websiteId: website.id,
                  websiteUrl: website.url,
                  message: `${website.url.replace("https://", "")} is back online`,
                  timestamp,
                  read: true
                })
              } else if (current.status === "Down" && previous.status === "Up") {
                generatedNotifications.push({
                  id: `${website.id}-incident-${i}`,
                  type: "down",
                  websiteId: website.id,
                  websiteUrl: website.url,
                  message: `${website.url.replace("https://", "")} went down`,
                  timestamp,
                  read: true
                })
              }
            }
          }
        })

        // Sort by timestamp, newest first
        generatedNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        setNotifications(generatedNotifications)
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getNotificationIcon = (type: "down" | "up" | "warning") => {
    switch (type) {
      case "down":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "up":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
    }
  }

  const getNotificationBg = (type: "down" | "up" | "warning", read: boolean) => {
    const opacity = read ? "10" : "20"
    switch (type) {
      case "down":
        return `bg-red-500/${opacity} border-red-500/30`
      case "up":
        return `bg-emerald-500/${opacity} border-emerald-500/30`
      case "warning":
        return `bg-yellow-500/${opacity} border-yellow-500/30`
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-1 flex-col gap-4 px-10 pt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground text-lg">
              Stay updated on your website status changes
            </p>
          </div>
        </div>
      </div>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-3 w-[150px]" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/50 rounded-xl">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
                <BellOff className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">All quiet here</h3>
              <p className="text-muted-foreground text-center max-w-md mb-1">
                {websites.length === 0
                  ? "Add websites to start receiving notifications when their status changes."
                  : "All your websites are running smoothly. You'll be notified when something changes."}
              </p>
              {websites.length > 0 && (
                <div className="flex items-center gap-2 mt-4 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">All systems operational</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/${notification.websiteId}`}
                  className="block"
                >
                  <div
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border-t-2 shadow transition-all
                      hover:bg-muted/80 cursor-pointer
                      ${notification.read ? "bg-muted/30 border-border/50" : "bg-muted/50 border-border"}
                    `}
                  >
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center shrink-0
                      ${notification.type === "down" ? "bg-red-500/20" : ""}
                      ${notification.type === "up" ? "bg-emerald-500/20" : ""}
                      ${notification.type === "warning" ? "bg-yellow-500/20" : ""}
                    `}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className={`font-medium ${!notification.read ? "text-foreground" : "text-foreground/80"}`}>
                            {notification.type === "down" && (
                              <span className="inline-flex items-center gap-1">
                                <ArrowDown className="h-4 w-4 text-red-400" />
                                Website Down
                              </span>
                            )}
                            {notification.type === "up" && (
                              <span className="inline-flex items-center gap-1">
                                <ArrowUp className="h-4 w-4 text-emerald-400" />
                                Website Recovered
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                    </div>

                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default NotificationsPage