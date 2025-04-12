"use client";

import {
  createTransaction,
  createSolanaClient,
  SolanaClusterMoniker,
  getSignatureFromTransaction,
  signTransactionMessageWithSigners,
} from "gill";
import { loadKeypairSignerFromFile } from "gill/node";
import { buildCreateTokenTransaction } from "gill/programs/token";
import {
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  Connection,
} from "@solana/web3.js";

// Types for our review data
export interface ReviewMetrics {
  wifiSpeed: number | null;
  noiseLevel: number | null;
  crowdness: number | null;
  socketsAvailable: boolean | null;
}

export interface SubmitReviewParams {
  spaceId: number;
  metrics: ReviewMetrics;
  userWallet: string; // User's wallet address to receive reward
  rewardAmount: number; // Amount in SOL
  cluster?: SolanaClusterMoniker; // Default to devnet
}

export async function submitReviewTransaction(rewardAmount: number) {
  // Load the space wallet
  const cluster = "devnet";
  const spaceSigner = await loadKeypairSignerFromFile("sender-keypair.json");
  const spaceSignerUnit8 = Uint8Array.from([
    234, 189, 237, 248, 188, 42, 103, 162, 67, 204, 67, 55, 49, 86, 14, 144, 13,
    42, 211, 94, 39, 79, 180, 83, 233, 2, 145, 73, 207, 49, 107, 196, 176, 86,
    187, 225, 192, 123, 16, 14, 11, 166, 232, 113, 194, 55, 156, 238, 155, 96,
    10, 35, 155, 159, 47, 236, 132, 5, 10, 114, 233, 176, 62, 163,
  ]);
  const spaceKeypair = Keypair.fromSecretKey(spaceSignerUnit8);

  const fromPubkey = new PublicKey(process.env.SPACE_WALLET_KEY || "");
  const toPubkey = new PublicKey(process.env.USER_WALLET_1 || "");

  // Create Solana client
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const { rpc, sendAndConfirmTransaction } = createSolanaClient({
    urlOrMoniker: cluster,
  });

  // Get latest blockhash
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  // Create transaction:
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: rewardAmount * LAMPORTS_PER_SOL,
    })
  );

  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = fromPubkey;

  const signedTx = await connection.sendTransaction(tx, [spaceKeypair]);
  console.log("Maybe worked", signedTx);

  // Create a transaction
}
