"use client"

import CustomCard from "@/components/custom-card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { addWebsite, getUserData } from "@/lib/actions"
import { WebsiteResponse } from "@/lib/types"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

function AddWebsiteDialog({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  onAdded: () => Promise<void> | void
}) {
  const [url, setUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const resetAndClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setUrl("")
      setIsAdding(false)
    }
    onOpenChange(nextOpen)
  }

  const handleAdd = async () => {
    if (!url.trim() || isAdding) return

    setIsAdding(true)
    try {
      const res = await addWebsite(url)
      if (!res?.success) {
        toast.error(res?.error || "Failed to add website")
        return
      }

      toast.success("Website added")
      setUrl("")
      onOpenChange(false)
      await onAdded()
    } catch (error) {
      console.error("Failed to add website:", error)
      toast.error("Failed to add website")
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Website</DialogTitle>
          <DialogDescription>
            Enter the URL of the website you want to monitor.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              void handleAdd()
            }
          }}
          disabled={isAdding}
          autoFocus
        />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => resetAndClose(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isAdding || !url.trim()}>
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Home() {
  const [username, setUsername] = useState<string | null>(null)
  const [websites, setWebsites] = useState<WebsiteResponse[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [addWebsiteDialog, setAddWebsiteDialog] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getUserData()
      if (res?.data) {
        setUsername(res.data.username ?? null)
        setWebsites(res.data.websites ?? [])
      }
    } catch (error) {
      console.error("Failed to fetch home data:", error)
      setWebsites([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return (
    <div className="px-6 flex flex-col items-start justify-start">
      <AddWebsiteDialog
        open={addWebsiteDialog}
        onOpenChange={setAddWebsiteDialog}
        onAdded={fetchData}
      />
      {!websites || websites.length === 0 ? null : (
        <h1 className="text-xl">
          Welcome, {isLoading ? "..." : username || "there"}
        </h1>
      )}

      {isLoading ? (
        <div className="flex mt-5 gap-3 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-80 rounded-xl" />
          ))}
        </div>
      ) : !websites || websites.length === 0 ? (
        <div className="mt-5 h-full w-full flex flex-col items-center justify-start gap-3 rounded-xl p-6">
          <div className="flex flex-col text-xl mt-20 gap-5">
            Add Your Website To Start Tracking
            <button
              type="button"
              className="flex text-lg items-center justify-center gap-1 border py-2"
              onClick={() => setAddWebsiteDialog(true)}
            >
              Add New Website{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11 17v4h2v-8h8v-2h-8V3h-2v8H3v2h8z"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex mt-5 gap-3 flex-wrap">
          {websites.map((website) => {
            const latestTick = website.ticks?.[0]
            return (
              <CustomCard
                key={website.id}
                id={website.id}
                url={website.url}
                status={latestTick?.status ?? "Unknown"}
                responseMs={latestTick?.response_ms}
                lastCheckedAt={latestTick?.created_at}
              />
            )
          })}
          <button
            type="button"
            onClick={() => setAddWebsiteDialog(true)}
            className="h-40 w-80 rounded-xl border border-dashed border-primary/40 text-primary/80 flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 17v4h2v-8h8v-2h-8V3h-2v8H3v2h8z"></path>
            </svg>
            Add website
          </button>
        </div>
      )}
    </div>
  )
}

export default Home
