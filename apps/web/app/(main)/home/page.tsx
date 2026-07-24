"use client"
import { ChartBarInteractive } from "@/components/ChartComp"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUserData } from "@/lib/actions"
import { WebsiteResponse } from "@/lib/types"
import { ArrowRight, ArrowUpRight, Globe } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [websitesData, setWebsitesData] = useState<WebsiteResponse[] | null>(null)
  const [totalWebsites, settotalWebsites] = useState(0);
  const [DownW, setDownW] = useState(0)
  const [UpW, setUpW] = useState(0)

  const fetchData = async () => {
    setIsLoading(true)
    const websites = await getUserData();
    if (!websites.data) {
      setIsLoading(false)
      console.log("no websites");
      return
    }
    let website = websites.data.websites
    setWebsitesData(website)
    settotalWebsites(website.length);
    let down = website.filter((w: WebsiteResponse) => w.ticks[0]?.status == "Down").length
    let up = website.filter((w: WebsiteResponse) => w.ticks[0]?.status == "Up").length
    setDownW(down)
    setUpW(up)
    console.log("on client data: ", websites);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [])

  const chartData = useMemo(() => {
    if (!websitesData) return []

    const allTicks: { date: string; responseTime: number; status: "Up" | "Down" | "Unknown" }[] = []

    websitesData.forEach(website => {
      if (website.ticks) {
        website.ticks.slice(0, 20).forEach(tick => {
          allTicks.push({
            date: tick.response_ms,
            responseTime: parseInt(tick.response_ms) || 0,
            status: tick.status
          })
        })
      }
    })

    return allTicks.slice(0, 50).map((tick, index) => ({
      date: new Date(Date.now() - (50 - index) * 60000).toISOString(),
      responseTime: tick.responseTime,
      status: tick.status
    }))
  }, [websitesData])

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

  const getTickColor = (status: "Up" | "Down" | "Unknown") => {
    switch (status) {
      case "Up":
        return "bg-emerald-500"
      case "Down":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
          {
            !websitesData && isLoading ? <Skeleton className="w-full h-full" /> :
              <div className="w-full h-full px-6 py-5">
                <h4 className="text-lg">Websites Monitoring</h4>
                <div className="border h-2/3 rounded-lg mt-3 px-5 py-3 bg-muted/50">
                  <h1 className="text-6xl font-semibold">{totalWebsites}</h1>
                  <p className="mt-2 text-muted-foreground">we are keeping an eye here</p>
                </div>
              </div>
          }
        </div>
        <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
          {
            !websitesData && isLoading ? <Skeleton className="w-full h-full" /> :
              <div className="w-full h-full px-6 py-5">
                <h4 className="text-lg">Active Websites</h4>
                <div className="border h-2/3 rounded-lg mt-3 px-5 py-3 bg-muted/50">
                  <h1 className="text-6xl font-semibold">{UpW}</h1>
                  <p className="mt-2 text-muted-foreground">everything is good here</p>
                </div>
              </div>
          }
        </div>
        <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
          {
            !websitesData && isLoading ? <Skeleton className="w-full h-full" /> :
              <div className="w-full h-full px-6 py-5">
                <h4 className="text-lg">Down Websites</h4>
                <div className="border h-2/3 rounded-lg mt-3 px-5 py-3 bg-muted/50">
                  <h1 className={`text-6xl font-semibold`}>{DownW}</h1>
                  {
                    DownW === 0 ? <p className="mt-2 text-muted-foreground">all good! nothing to worry</p> : <p className="mt-2 text-muted-foreground">this should be fixed</p>
                  }
                </div>
              </div>
          }
        </div>
      </div>
      <div className="min-h-screen w-full rounded-xl" >
        <ChartBarInteractive data={chartData} />
        <Card className="bg-muted/50 border-0 shadow-none mt-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Website Overview</CardTitle>
            <Link href="/websites">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-[150px]" />
                      <Skeleton className="h-2.5 w-[80px]" />
                    </div>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            ) : !websitesData || websitesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm text-center">
                  No websites configured yet.{" "}
                  <Link href="/websites" className="text-primary hover:underline">
                    Add your first website
                  </Link>
                </p>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden bg-background/30">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border/30">
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Website
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Recent Activity
                      </TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">

                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {websitesData.slice(0, 5).map((website) => {
                      const currentStatus = website.ticks?.[0]?.status || "Unknown"
                      return (
                        <TableRow
                          key={website.id}
                          className="hover:bg-muted/50 transition-colors border-b border-border/20 last:border-0"
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border border-border/50 flex items-center justify-center">
                                <Globe className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <Link
                                  href={`/${website.id}`}
                                  className="font-medium text-sm hover:underline flex items-center gap-1 group"
                                >
                                  {website.url.replace("https://", "").replace("http://", "")}
                                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${getStatusColor(currentStatus)} border text-xs font-medium`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${getTickColor(currentStatus)} mr-1`} />
                              {currentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-0.5">
                              {website.ticks.slice(0, 15).reverse().map((tick, i) => (
                                <div
                                  key={i}
                                  className={`h-5 w-1 rounded-sm ${getTickColor(tick.status)} opacity-70 hover:opacity-100 transition-opacity`}
                                  title={tick.status}
                                />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/${website.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 text-xs">
                                Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div >
  )
}
