"use client"

import { useState } from "react"
import { Wifi, Volume2, Users, Plug, HelpCircle, RotateCcw } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type MetricType = "wifi" | "noise" | "crowdness" | "sockets"

type MetricProps = {
  type: MetricType
  value: number | boolean | null
  onChange: (value: number | boolean) => void
}

export function ReviewMetric({ type, value, onChange }: MetricProps) {
  const [hasValue, setHasValue] = useState(value !== null)

  const getIcon = () => {
    switch (type) {
      case "wifi":
        return <Wifi className="h-5 w-5 text-[#c62ef8]" />
      case "noise":
        return <Volume2 className="h-5 w-5 text-[#818dd3]" />
      case "crowdness":
        return <Users className="h-5 w-5 text-[#5eadc8]" />
      case "sockets":
        return <Plug className="h-5 w-5 text-[#21e3b6]" />
    }
  }

  const getTitle = () => {
    switch (type) {
      case "wifi":
        return "WiFi Speed"
      case "noise":
        return "Noise Level"
      case "crowdness":
        return "Crowdness"
      case "sockets":
        return "Sockets Available"
    }
  }

  const getTooltip = () => {
    switch (type) {
      case "wifi":
        return "Rate the WiFi speed from slow to fast"
      case "noise":
        return "Rate the noise level from quiet to loud"
      case "crowdness":
        return "How crowded it feels at the venue"
      case "sockets":
        return "Are there power sockets available for devices?"
    }
  }

  const handleReset = () => {
    setHasValue(false)
    onChange(type === "sockets" ? false : 0)
  }

  const renderInput = () => {
    if (!hasValue) {
      return (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setHasValue(true)
            onChange(type === "sockets" ? true : type === "crowdness" ? 1 : 50)
          }}
        >
          Add rating
        </Button>
      )
    }

    switch (type) {
      case "wifi":
      case "noise":
        return (
          <div className="space-y-2 w-full">
            <Slider
              value={[value as number]}
              min={0}
              max={100}
              step={1}
              onValueChange={(vals) => onChange(vals[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{type === "wifi" ? "Slow" : "Quiet"}</span>
              <span>{type === "wifi" ? "Fast" : "Loud"}</span>
            </div>
          </div>
        )
      case "crowdness":
        return (
          <div className="space-y-2 w-full">
            <Slider
              value={[value as number]}
              min={0}
              max={10}
              step={1}
              onValueChange={(vals) => onChange(vals[0])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{"Empty"}</span>
              <span>{"Very crowded"}</span>
            </div>
          </div>
        )
      case "sockets":
        return <Switch checked={value as boolean} onCheckedChange={onChange} />
    }
  }

  return (
    <div className={`p-4 rounded-lg border ${hasValue ? "bg-muted/50" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <Label className="text-base font-medium">{getTitle()}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getTooltip()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {hasValue && (
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">{renderInput()}</div>
    </div>
  )
}
