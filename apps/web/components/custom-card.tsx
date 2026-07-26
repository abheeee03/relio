import Link from "next/link"
import React from "react"

type CustomCardProps = {
  id: string
  url: string
  status?: "Up" | "Down" | "Unknown"
  responseMs?: string | number | null
  lastCheckedAt?: string | null
}

function formatHost(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  }
}

function formatCheckedAt(dateStr?: string | null) {
  if (!dateStr) return "No checks yet"
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return "No checks yet"
  return date.toLocaleDateString()
}

function CustomCard({
  id,
  url,
  status = "Unknown",
  responseMs,
  lastCheckedAt,
}: CustomCardProps) {
  const statusColor =
    status === "Up"
      ? "bg-green-500"
      : status === "Down"
        ? "bg-red-500"
        : "bg-yellow-500"

  const ping =
    responseMs === undefined || responseMs === null || responseMs === ""
      ? "—"
      : `${responseMs}ms`

  return (
    <Link
      href={`/${id}`}
      className="h-40 w-80 bg-primary/10 rounded-xl px-2 pt-2 pb-10 block transition-opacity hover:opacity-90"
    >
      <div className="h-full w-full bg-background rounded-xl px-3 py-3 flex items-start justify-start flex-col">
        <span className="text-xl truncate w-full" title={url}>
          {formatHost(url)}
        </span>
        <div className="mt-5 flex items-center justify-start gap-3">
          <div className="text-sm flex items-center justify-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusColor}`} />
            Status: {status}
          </div>
          <div className="text-sm flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Monitoring
          </div>
        </div>
      </div>
      <div className="py-2 text-primary/70 px-2 w-full flex items-center justify-end">
        {formatCheckedAt(lastCheckedAt)} Ping: {ping}
      </div>
    </Link>
  )
}

export default CustomCard
