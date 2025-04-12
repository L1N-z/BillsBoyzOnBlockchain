import { ThemeToggle } from "./theme-toggle"
import { UserProfile } from "./user-profile"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#c62ef8] via-[#818dd3] to-[#21e3b6] text-transparent bg-clip-text">
            Bill's Boys on Blockchain
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
