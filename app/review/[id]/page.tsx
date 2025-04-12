"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { ReviewMetric } from "@/components/review-metric"
import { Button } from "@/components/ui/button"
import { coworkingSpaces } from "@/lib/coworking-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useWalletContext } from "@/components/wallet-context-provider"
import { storeReview } from "@/lib/redis"

type ReviewMetrics = {
  wifiSpeed: number | null
  noiseLevel: number | null
  crowdness: number | null
  socketsAvailable: boolean | null
}

export default function ReviewPage({ params }: { params: { id: string } }) {
  const spaceId = Number.parseInt(params.id)
  const space = coworkingSpaces.find((s) => s.id === spaceId)
  const router = useRouter()
  const { toast } = useToast()
  const { updateBalance } = useWalletContext()

  const [metrics, setMetrics] = useState<ReviewMetrics>({
    wifiSpeed: null,
    noiseLevel: null,
    crowdness: null,
    socketsAvailable: null,
  })

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reviewId, setReviewId] = useState<string | null>(null)

  if (!space) {
    return <div>Space not found</div>
  }

  const handleMetricChange = (metric: keyof ReviewMetrics, value: number | boolean) => {
    setMetrics((prev) => ({
      ...prev,
      [metric]: value,
    }))
  }

  const getRewardAmount = () => {
    // Calculate reward based on number of metrics provided
    const filledMetrics = Object.values(metrics).filter((m) => m !== null).length
    return filledMetrics * 0.05
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Store the review in Redis
      const id = await storeReview(spaceId, {
        wifiSpeed: metrics.wifiSpeed,
        noiseLevel: metrics.noiseLevel,
        crowdness: metrics.crowdness,
        socketsAvailable: metrics.socketsAvailable,
      })

      setReviewId(id)

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitting(false)
      setSubmitted(true)

      // Close modal after delay
      setTimeout(() => {
        setConfirmOpen(false)
        router.push("/")

        // Show toast after navigation
        setTimeout(() => {
          updateBalance()
          toast({
            title: "Review submitted successfully!",
            description: `You've received ${getRewardAmount().toFixed(2)} SOL for your review.`,
            duration: 4000,
          })
        }, 500)
      }, 1500)
    } catch (error) {
      console.error("Failed to submit review:", error)
      setSubmitting(false)
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

  const filledMetricsCount = Object.values(metrics).filter((m) => m !== null).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
          Back to spaces
        </Button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{space.name}</h2>
          <p className="text-muted-foreground mt-2">Submit a review for this coworking space</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          <ReviewMetric
            type="wifi"
            value={metrics.wifiSpeed}
            onChange={(val) => handleMetricChange("wifiSpeed", val as number)}
          />

          <ReviewMetric
            type="noise"
            value={metrics.noiseLevel}
            onChange={(val) => handleMetricChange("noiseLevel", val as number)}
          />

          <ReviewMetric
            type="crowdness"
            value={metrics.crowdness}
            onChange={(val) => handleMetricChange("crowdness", val as number)}
          />

          <ReviewMetric
            type="sockets"
            value={metrics.socketsAvailable}
            onChange={(val) => handleMetricChange("socketsAvailable", val as boolean)}
          />

          <div className="pt-6 border-t">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  You will receive{" "}
                  <span className="font-medium text-foreground">{getRewardAmount().toFixed(2)} SOL</span> for this
                  review
                </p>
                {filledMetricsCount === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Fill in at least one metric to earn SOL</p>
                )}
              </div>

              <Button
                className="bg-gradient-to-r from-[#c62ef8] to-[#21e3b6] hover:from-[#d44ff9] hover:to-[#3eeac2]"
                disabled={filledMetricsCount === 0}
                onClick={() => setConfirmOpen(true)}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{submitted ? "Review Submitted!" : "Confirm Review"}</DialogTitle>
            <DialogDescription>
              {submitted
                ? "Thank you for your contribution!"
                : "Please confirm that the information you provided is accurate to the best of your knowledge."}
            </DialogDescription>
          </DialogHeader>

          {!submitted && (
            <div className="space-y-4 py-4">
              {metrics.wifiSpeed !== null && (
                <div className="flex justify-between">
                  <span className="text-sm">WiFi Speed:</span>
                  <span className="text-sm font-medium">{metrics.wifiSpeed}%</span>
                </div>
              )}

              {metrics.noiseLevel !== null && (
                <div className="flex justify-between">
                  <span className="text-sm">Noise Level:</span>
                  <span className="text-sm font-medium">{metrics.noiseLevel}%</span>
                </div>
              )}

              {metrics.crowdness !== null && (
                <div className="flex justify-between">
                  <span className="text-sm">Crowdness:</span>
                  <span className="text-sm font-medium">{metrics.crowdness}</span>
                </div>
              )}

              {metrics.socketsAvailable !== null && (
                <div className="flex justify-between">
                  <span className="text-sm">Sockets Available:</span>
                  <span className="text-sm font-medium">{metrics.socketsAvailable ? "Yes" : "No"}</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {submitted ? (
              <div className="w-full flex justify-center">
                <div className="animate-bounce bg-gradient-to-r from-[#c62ef8] to-[#21e3b6] p-2 rounded-full">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-[#c62ef8] to-[#21e3b6] hover:from-[#d44ff9] hover:to-[#3eeac2]"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm and Submit"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
