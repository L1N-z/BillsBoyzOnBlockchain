import { Header } from "@/components/header"
import { CoworkingSpaceCard } from "@/components/coworking-space-card"
import { PopularSpaces } from "@/components/popular-spaces"
import { coworkingSpaces } from "@/lib/coworking-data"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Coworking Spaces</h2>
          <p className="text-muted-foreground mt-2">Select a coworking space to view details or submit a review</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coworkingSpaces.map((space) => (
                <CoworkingSpaceCard key={space.id} space={space} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <PopularSpaces />
          </div>
        </div>
      </main>
    </div>
  )
}
