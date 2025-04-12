export type CoworkingSpace = {
  id: number
  name: string
  description: string
  icon: string
  metrics?: {
    wifiSpeed?: number
    noiseLevel?: number
    seatsAvailable?: number
    socketsAvailable?: boolean
  }
}

export const coworkingSpaces: CoworkingSpace[] = [
  {
    id: 0,
    name: "Lower Ground Coworking Space",
    description: "A quiet space perfect for focused work with high-speed internet.",
    icon: "building",
    metrics: {
      wifiSpeed: 85,
      noiseLevel: 20,
      seatsAvailable: 15,
      socketsAvailable: true,
    },
  },
  {
    id: 1,
    name: "First Floor Coworking Space",
    description: "Open plan area with collaborative zones and private booths.",
    icon: "layout-dashboard",
    metrics: {
      wifiSpeed: 75,
      noiseLevel: 60,
      seatsAvailable: 25,
      socketsAvailable: true,
    },
  },
  {
    id: 2,
    name: "Second Floor Coworking Space with Terrace",
    description: "Bright space with outdoor terrace, perfect for breaks.",
    icon: "palm-tree",
    metrics: {
      wifiSpeed: 70,
      noiseLevel: 45,
      seatsAvailable: 20,
      socketsAvailable: true,
    },
  },
  {
    id: 3,
    name: "Second Floor Coworking Space (left)",
    description: "Quiet zone with individual desks and meeting pods.",
    icon: "coffee",
    metrics: {
      wifiSpeed: 80,
      noiseLevel: 30,
      seatsAvailable: 12,
      socketsAvailable: true,
    },
  },
  {
    id: 4,
    name: "Third Floor Coworking Space",
    description: "Premium space with ergonomic furniture and panoramic views.",
    icon: "building-2",
    metrics: {
      wifiSpeed: 90,
      noiseLevel: 25,
      seatsAvailable: 10,
      socketsAvailable: true,
    },
  },
]
