"use client"

import { useEffect, useState } from "react"
import { getTopSpaces } from "@/lib/redis"
import { coworkingSpaces } from "@/lib/coworking-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, TrendingUp } from "lucide-react"
import Link from "next/link"

export function PopularSpaces() {
  const [topSpaces, setTopSpaces] = useState<{ id: number; views: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopSpaces = async () => {
      try {
        const spaces = await getTopSpaces(3)
        setTopSpaces(spaces)
      } catch (error) {
        console.error("Failed to fetch top spaces:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopSpaces()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#c62ef8]" />
          <h3 className="text-lg font-semibold">Popular Spaces</h3>
        </div>
        <div className="h-32 rounded-md bg-muted/50 animate-pulse"></div>
      </div>
    )
  }

  if (topSpaces.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#c62ef8]" />
          <h3 className="text-lg font-semibold">Popular Spaces</h3>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No data available yet</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-[#c62ef8]" />
        <h3 className="text-lg font-semibold">Popular Spaces</h3>
      </div>

      <div className="space-y-3">
        {topSpaces.map((item, index) => {
          const space = coworkingSpaces.find((s) => s.id === item.id)
          if (!space) return null

          return (
            <Link href={`/review/${space.id}`} key={space.id}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{space.name}</CardTitle>
                      <CardDescription className="text-xs truncate max-w-[200px]">{space.description}</CardDescription>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Eye className="h-3 w-3 mr-1" />
                      {item.views}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
