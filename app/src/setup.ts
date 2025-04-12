import { createSolanaClient } from "gill";
 
const { rpc, rpcSubscriptions, sendAndConfirmTransaction } = createSolanaClient(
  {
    urlOrMoniker: "mainnet",
  },
);

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();


