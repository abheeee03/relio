"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart for ping history"

interface PingDataPoint {
  date: string
  responseTime: number
  status: "Up" | "Down" | "Unknown"
}

interface ChartBarInteractiveProps {
  data?: PingDataPoint[]
}

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "#0046FF",
  },
} satisfies ChartConfig

export function ChartBarInteractive({ data = [] }: ChartBarInteractiveProps) {
  const [activeBar, setActiveBar] = React.useState<number | null>(null)

  // Calculate average response time
  const avgResponseTime = React.useMemo(() => {
    if (data.length === 0) return 0
    const sum = data.reduce((acc, item) => acc + item.responseTime, 0)
    return Math.round(sum / data.length)
  }, [data])

  // Calculate max response time
  const maxResponseTime = React.useMemo(() => {
    if (data.length === 0) return 0
    return Math.max(...data.map(item => item.responseTime))
  }, [data])

  // Calculate min response time
  const minResponseTime = React.useMemo(() => {
    if (data.length === 0) return 0
    return Math.min(...data.map(item => item.responseTime))
  }, [data])

  if (data.length === 0) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
            <CardTitle className="py-5 text-xl">Ping History Chart</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No ping data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle className="py-5 text-xl">Ping History Chart</CardTitle>
        </div>
        <div className="flex items-center gap-6 px-6 py-4 sm:py-0">
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Avg</span>
            <span className="text-lg font-semibold text-primary">{avgResponseTime}ms</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Min</span>
            <span className="text-lg font-semibold text-green-500">{minResponseTime}ms</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">Max</span>
            <span className="text-lg font-semibold text-red-500">{maxResponseTime}ms</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setActiveBar(state.activeTooltipIndex)
              }
            }}
            onMouseLeave={() => setActiveBar(null)}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}ms`}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 70, 255, 0.1)' }}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="responseTime"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                  formatter={(value, name, item) => (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Response:</span>
                        <span className="font-semibold">{value}ms</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-semibold ${item.payload.status === 'Up' ? 'text-green-500' : 'text-red-500'}`}>
                          {item.payload.status}
                        </span>
                      </div>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="responseTime"
              radius={[4, 4, 0, 0]}
              fill="var(--color-responseTime)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
