"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllTicks } from "@/lib/actions"
import { Ticks } from "@/lib/types"
import { Activity, CheckCircle2, Clock, Globe, Loader2, RefreshCw, XCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type LogEntry = Ticks & {
  websiteUrl: string
}

function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)
  const LIMIT = 15

  const fetchLogs = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
      setOffset(0)
    }

    try {
      const currentOffset = loadMore ? offset : 0
      const result = await getAllTicks(LIMIT, currentOffset)

      if (result?.data) {
        if (loadMore) {
          setLogs(prev => [...prev, ...result.data])
        } else {
          setLogs(result.data)
        }
        setHasMore(result.hasMore || false)
        setTotal(result.total || 0)
        setOffset(currentOffset + LIMIT)
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const getStatusColor = (status: "Up" | "Down" | "Unknown") => {
    switch (status) {
      case "Up":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "Down":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getResponseTimeColor = (ms: number) => {
    if (ms < 200) return "text-emerald-400"
    if (ms < 500) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusIcon = (status: "Up" | "Down" | "Unknown") => {
    switch (status) {
      case "Up":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />
      case "Down":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Activity className="h-5 w-5 text-yellow-400" />
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
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

  return (
    <div className="flex flex-1 flex-col gap-4 px-10 pt-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Logs</h1>
          <p className="text-muted-foreground text-lg">
            View detailed ping history across all monitored websites
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchLogs()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
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
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-muted/50 rounded-xl">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-muted to-muted/50 flex items-center justify-center mb-6">
                <Activity className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No logs yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-1">
                Add some websites to start seeing ping logs here. We&apos;ll track every check and show you the results.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <Link
                  key={log.id}
                  href={`/${log.website_id}`}
                  className="block"
                >
                  <div
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border-t-2 shadow transition-all
                      hover:bg-muted/80 cursor-pointer bg-muted/50 border-border
                    `}
                  >
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center shrink-0
                      ${log.status === "Up" ? "bg-emerald-500/20" : ""}
                      ${log.status === "Down" ? "bg-red-500/20" : ""}
                      ${log.status === "Unknown" ? "bg-yellow-500/20" : ""}
                    `}>
                      {getStatusIcon(log.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {log.websiteUrl?.replace("https://", "").replace("http://", "") || "Unknown Website"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3.5 w-3.5" />
                              Region: {log.region?.name || "Unknown Region"}
                            </span>
                            <span className={`font-mono`}>
                              Response Time: {log.response_ms} ms
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(log.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchLogs(true)}
                    disabled={isLoadingMore}
                    className="gap-2"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>
            Showing {logs.length} of {total} logs
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {logs.filter(l => l.status === "Up").length} Up
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {logs.filter(l => l.status === "Down").length} Down
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default LogsPage