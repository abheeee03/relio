"use client"
import { ChartBarInteractive } from "@/components/ChartComp";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteWebsite, getWebsiteData } from "@/lib/actions";
import { Ticks, WebsiteData } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteIcon, PauseIcon, RefreshCCWIcon, DeleteIconHandle, PauseIconHandle, RefreshCCWIconHandle } from "@/components/ui/animated-icons";

const ITEMS_PER_PAGE = 10;

function WebsiteDetails() {

    const { websiteID } = useParams();
    const router = useRouter();
    const [websiteData, setWebsiteData] = useState<null | WebsiteData>(null);
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
    const [loadingMore, setLoadingMore] = useState(false)
    const [secondsAgo, setSecondsAgo] = useState(0)

    const refreshIconRef = useRef<RefreshCCWIconHandle>(null)
    const pauseIconRef = useRef<PauseIconHandle>(null)
    const deleteIconRef = useRef<DeleteIconHandle>(null)

    const getData = async () => {
        setLoading(true)
        const webData = await getWebsiteData(websiteID as string);
        setWebsiteData(webData);
        setLoading(false)
    }

    useEffect(() => {
        getData();
    }, [websiteID])

    useEffect(() => {
        if (!websiteData?.ticks?.[0]?.created_at) return

        const calculateSecondsAgo = () => {
            const lastTickTime = new Date(websiteData.ticks[0].created_at).getTime()
            const now = Date.now()
            return Math.floor((now - lastTickTime) / 1000)
        }

        setSecondsAgo(calculateSecondsAgo())

        const interval = setInterval(() => {
            setSecondsAgo(calculateSecondsAgo())
        }, 1000)

        return () => clearInterval(interval)
    }, [websiteData?.ticks])

    const chartData = useMemo(() => {
        if (!websiteData?.ticks) return []
        return websiteData.ticks
            .slice(0, 50)
            .map(tick => ({
                date: tick.created_at,
                responseTime: parseInt(tick.response_ms) || 0,
                status: tick.status
            }))
            .reverse()
    }, [websiteData?.ticks])

    const displayedTicks = useMemo(() => {
        if (!websiteData?.ticks) return []
        return websiteData.ticks.slice(0, displayCount)
    }, [websiteData?.ticks, displayCount])

    const hasMore = useMemo(() => {
        if (!websiteData?.ticks) return false
        return displayCount < websiteData.ticks.length
    }, [websiteData?.ticks, displayCount])

    const incidentCount = useMemo(() => {
        if (!websiteData?.ticks) return 0
        return websiteData.ticks.filter(tick => tick.status === "Down").length
    }, [websiteData?.ticks])
    const startedMonitoringDate = useMemo(() => {
        if (!websiteData?.ticks || websiteData.ticks.length === 0) return null
        const oldestTick = websiteData.ticks[websiteData.ticks.length - 1]
        const date = new Date(oldestTick.created_at)
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
        })
    }, [websiteData?.ticks])

    const formatTimeAgo = useCallback((seconds: number) => {
        if (seconds < 60) {
            return { value: seconds, unit: 's' }
        } else if (seconds < 3600) {
            return { value: Math.floor(seconds / 60), unit: 'm' }
        } else if (seconds < 86400) {
            return { value: Math.floor(seconds / 3600), unit: 'h' }
        } else {
            return { value: Math.floor(seconds / 86400), unit: 'd' }
        }
    }, [])

    const handleLoadMore = async () => {
        setLoadingMore(true)
        await new Promise(resolve => setTimeout(resolve, 300))
        setDisplayCount(prev => prev + ITEMS_PER_PAGE)
        setLoadingMore(false)
    }
    const handleDelete = async () => {
        setDeleting(true)
        const result = await deleteWebsite(websiteID as string)
        setDeleting(false)
        if (result.success) {
            setDeleteDialogOpen(false)
            router.push('/websites')
        }
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    const timeAgo = formatTimeAgo(secondsAgo)

    return (
        <>
            {
                loading || !websiteData ? <div className="h-screen w-full flex gap-2 items-center justify-center">
                    <Spinner />
                    <p className="text-lg">
                        Please wait while we get data from server
                    </p>
                </div> : <div className='min-h-screen w-full flex flex-col items-start justify-start px-20 py-5'>
                    <div className="w-full flex flex-col gap-5">
                        <AnimatedLink href={`${websiteData.url}`} className="text-3xl w-fit flex items-center justify-center gap-3">
                            <span className={`h-3 w-3 rounded-full mt-1 ${websiteData.ticks[0]?.status === "Up" ? "bg-green-500" : "bg-red-500"}`} /> {websiteData.url.replace("https://", "")}
                        </AnimatedLink>
                        <div className="flex items-center gap-3">
                            <Button
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => setChecking(true)}
                                onMouseEnter={() => refreshIconRef.current?.startAnimation()}
                                onMouseLeave={() => refreshIconRef.current?.stopAnimation()}
                            >
                                <RefreshCCWIcon ref={refreshIconRef} size={16} />
                                Check
                            </Button>
                            <Button
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => setChecking(true)}
                                onMouseEnter={() => pauseIconRef.current?.startAnimation()}
                                onMouseLeave={() => pauseIconRef.current?.stopAnimation()}
                            >
                                <PauseIcon ref={pauseIconRef} size={16} />
                                Pause
                            </Button>
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        size={"sm"}
                                        onMouseEnter={() => deleteIconRef.current?.startAnimation()}
                                        onMouseLeave={() => deleteIconRef.current?.stopAnimation()}
                                    >
                                        <DeleteIcon ref={deleteIconRef} size={16} />
                                        Delete
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Website</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this website? This action cannot be undone
                                            and all monitoring data will be permanently removed.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                                            {deleting ? <><Spinner /> Deleting...</> : "Delete"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-start mt-10 gap-5">
                        <div className="flex w-full items-start justify-start gap-5">
                            <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
                                {
                                    !websiteData && loading ? <Skeleton className="w-full h-full" /> :
                                        <div className="w-full h-full px-6 py-5">
                                            <h4 className="text-lg">Started Monitoring At</h4>
                                            <div className="border h-2/3 rounded-lg mt-3 px-5 py-3 bg-muted/50">
                                                <h1 className="text-5xl font-semibold">
                                                    {startedMonitoringDate || "N/A"}
                                                </h1>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
                                {
                                    !websiteData && loading ? <Skeleton className="w-full h-full" /> :
                                        <div className="w-full h-full px-6 py-5">
                                            <h4 className="text-lg">Last Checked At</h4>
                                            <div className="border h-2/3 rounded-lg mt-3 px-5 py-1 bg-muted/50">
                                                <h1 className="text-6xl flex items-baseline gap-1 tabular-nums">
                                                    {timeAgo.value}{timeAgo.unit}
                                                    <span className="text-2xl text-muted-foreground">
                                                        ago
                                                    </span>
                                                </h1>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="rounded-xl w-full border-t-2 shadow-lg dark:shadow-foreground/20 dark:shadow-xs">
                                {
                                    !websiteData && loading ? <Skeleton className="w-full h-full" /> :
                                        <div className="w-full h-full px-6 py-5">
                                            <h4 className="text-lg">Incidents</h4>
                                            <div className="border h-2/3 rounded-lg mt-3 px-5 py-1 bg-muted/50">
                                                <h1 className={`text-6xl ${incidentCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {incidentCount}
                                                </h1>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>

                        <div className="w-full mt-6">
                            <ChartBarInteractive data={chartData} />
                        </div>

                        <div className="w-full h-full flex flex-col items-start justify-start mt-6">
                            <div className="w-full flex items-center justify-between">
                                <h1 className='text-xl font-medium'>Ping History</h1>
                                <span className="text-sm text-muted-foreground">
                                    Showing {displayedTicks.length} of {websiteData.ticks.length} records
                                </span>
                            </div>
                            <div className="mt-6 w-full">
                                <Table className='w-full'>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Region
                                            </TableHead>
                                            <TableHead>
                                                Response Time
                                            </TableHead>
                                            <TableHead>
                                                Timestamp
                                            </TableHead>
                                            <TableHead className='text-right'>
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            !displayedTicks || displayedTicks.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                        Nothing to show here...
                                                    </TableCell>
                                                </TableRow>
                                            ) : displayedTicks.map((t: Ticks) => (
                                                <TableRow className='w-full hover:bg-muted/50 transition-colors' key={t.id}>
                                                    <TableCell className='w-60'>
                                                        <span className="capitalize">{t.region.name}</span>
                                                    </TableCell>
                                                    <TableCell className='w-40'>
                                                        <span className={`font-medium`}>
                                                            {t.response_ms} ms
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className='w-60 text-muted-foreground'>
                                                        {formatTimestamp(t.created_at)}
                                                    </TableCell>
                                                    <TableCell className='text-right w-40'>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${t.status === "Up"
                                                            ? "bg-green-500/10 text-green-500"
                                                            : t.status === "Down"
                                                                ? "bg-red-500/10 text-red-500"
                                                                : "bg-yellow-500/10 text-yellow-500"
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === "Up"
                                                                ? "bg-green-500"
                                                                : t.status === "Down"
                                                                    ? "bg-red-500"
                                                                    : "bg-yellow-500"
                                                                }`} />
                                                            {t.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                                {hasMore && (
                                    <div className="flex justify-center mt-6">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleLoadMore}
                                            disabled={loadingMore}
                                            className="gap-2"
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <Spinner />
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4" />
                                                    Load More
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {!hasMore && displayedTicks.length > 0 && (
                                    <div className="flex justify-center mt-6 text-sm text-muted-foreground">
                                        — End of ping history —
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            }
        </>
    )
}

export default WebsiteDetails