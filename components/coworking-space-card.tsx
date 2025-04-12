"use client"

import { useState, useEffect } from "react"
import {
  Building,
  LayoutDashboard,
  TreePalmIcon as PalmTree,
  Coffee,
  Building2,
  Wifi,
  Volume2,
  Users,
  Plug,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { CoworkingSpace } from "@/lib/coworking-data"
import { useRouter } from "next/navigation"
import { incrementSpaceViews, getSpaceViews } from "@/lib/redis"

export function CoworkingSpaceCard({ space }: { space: CoworkingSpace }) {
  const [open, setOpen] = useState(false)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Fetch the current view count when component mounts
    const fetchViewCount = async () => {
      try {
        const count = await getSpaceViews(space.id)
        setViewCount(count)
      } catch (error) {
        console.error("Failed to fetch view count:", error)
      }
    }

    fetchViewCount()
  }, [space.id])

  const handleCardClick = async () => {
    setOpen(true)

    // Increment view count when card is clicked
    try {
      const newCount = await incrementSpaceViews(space.id)
      setViewCount(newCount)
    } catch (error) {
      console.error("Failed to increment view count:", error)
    }
  }

  const getIcon = () => {
    switch (space.icon) {
      case "building":
        return <Building className="h-6 w-6" />
      case "layout-dashboard":
        return <LayoutDashboard className="h-6 w-6" />
      case "palm-tree":
        return <PalmTree className="h-6 w-6" />
      case "coffee":
        return <Coffee className="h-6 w-6" />
      case "building-2":
        return <Building2 className="h-6 w-6" />
      default:
        return <Building className="h-6 w-6" />
    }
  }

  return (
    <>
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-to-r from-[#c62ef8] to-[#21e3b6] text-white">{getIcon()}</div>
            <div>
              <CardTitle className="text-lg">{space.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">{space.description}</CardDescription>
          <div className="space-y-2">
            {space.metrics && (
              <Badge variant="outline" className="bg-gradient-to-r from-[#c62ef8]/10 to-[#21e3b6]/10">
                Has metrics
              </Badge>
            )}
          </div>
        </CardContent>
        {viewCount !== null && (
          <CardFooter className="pt-0">
            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              {viewCount} {viewCount === 1 ? "view" : "views"}
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{space.name}</DialogTitle>
            <DialogDescription>{space.description}</DialogDescription>
          </DialogHeader>

          {space.metrics ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-[#c62ef8]" />
                  <span className="text-sm font-medium">WiFi Speed</span>
                </div>
                <Progress value={space.metrics.wifiSpeed} className="h-2" />
                <span className="text-xs text-muted-foreground">{space.metrics.wifiSpeed}% of maximum speed</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-[#818dd3]" />
                  <span className="text-sm font-medium">Noise Level</span>
                </div>
                <Progress value={space.metrics.noiseLevel} className="h-2" />
                <span className="text-xs text-muted-foreground">{space.metrics.noiseLevel}% noise level</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#5eadc8]" />
                  <span className="text-sm font-medium">Crowdness</span>
                </div>
                <span className="text-sm">{space.metrics.crowdness} crowdness</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-[#21e3b6]" />
                  <span className="text-sm font-medium">Sockets Available</span>
                </div>
                <span className="text-sm">{space.metrics.socketsAvailable ? "Yes" : "No"}</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No metrics available yet. Be the first to review!
            </div>
          )}

          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-[#c62ef8] to-[#21e3b6] hover:from-[#d44ff9] hover:to-[#3eeac2]"
              onClick={() => {
                setOpen(false)
                router.push(`/review/${space.id}`)
              }}
            >
              Review this space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
