"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { clusterApiUrl } from "@solana/web3.js";

// Create a context for wallet balance
type WalletContextType = {
  balance: number;
  updateBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType>({
  balance: 0,
  updateBalance: async () => {},
});

export const useWalletContext = () => useContext(WalletContext);

export function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [balance, setBalance] = useState(0);

  // For demo purposes, we're using devnet
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  // You can add more wallet adapters as needed
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new BackpackWalletAdapter(),
  ];

  const updateBalance = async () => {
    // In a real app, you would fetch the actual balance from the connected wallet
    // For demo purposes, we're just setting a random value
    setBalance(Math.floor(Math.random() * 100) / 10);
  };

  useEffect(() => {
    updateBalance();
  }, []);

  return (
    <WalletContext.Provider value={{ balance, updateBalance }}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </WalletContext.Provider>
  );
}
