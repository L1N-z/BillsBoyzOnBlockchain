"use client"
import { User } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletContext } from "./wallet-context-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export function UserProfile() {
  const { connected, publicKey, disconnect } = useWallet()
  const { balance } = useWalletContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {connected ? (
            <>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Wallet Address</span>
                <span className="text-xs font-medium truncate max-w-[200px]">{publicKey?.toBase58()}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Balance</span>
                <span className="font-medium">{balance} SOL</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => disconnect()}>Disconnect Wallet</DropdownMenuItem>
            </>
          ) : (
            <div className="px-2 py-1.5">
              <WalletMultiButton className="wallet-adapter-button-trigger" />
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
