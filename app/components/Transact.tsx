import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { FC, useState } from "react";
import { deposit, withdraw } from "../utils/instructions";
import { generateExplorerUrl } from "../utils/solana";
import { useWorkspace } from "./WorkspaceProvider";
import { getSolBalance } from "../utils/solana";

const Transact = () => {
  const workspace = useWorkspace();
  const { connection } = useConnection();
  const walletAdapter = useWallet();

  const saverAppProgram = workspace.saverAppProgram;

  const transaction = new Transaction();

  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);

  async function depFunds(amount: number) {
    if (!saverAppProgram) throw new Error("No Program Found");
    if (!walletAdapter.publicKey || !walletAdapter)
      throw new Error("No PubKey Found");

    let txInstructions = await deposit(
      saverAppProgram,
      walletAdapter.publicKey,
      amount
    );
    transaction.add(txInstructions);

    let latestBlockhash = await connection.getLatestBlockhash("confirmed");
    console.log(
      "   ✅ - Fetched latest blockhash. Last Valid Height:",
      latestBlockhash.lastValidBlockHeight
    );

    let signature = await walletAdapter.sendTransaction(
      transaction,
      connection
    );

    let confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    if (confirmation.value.err)
      throw new Error("Error: Could not confirm transaction");

    console.log("   ✅ - Success!", generateExplorerUrl(signature));
  }

  async function withdrawFunds(amount: number) {
    if (!saverAppProgram) throw new Error("No Program Found");
    if (!walletAdapter.publicKey || !walletAdapter)
      throw new Error("No PubKey Found");

    let txInstructions = await withdraw(
      saverAppProgram,
      walletAdapter.publicKey,
      amount
    );
    transaction.add(txInstructions);

    let latestBlockhash = await connection.getLatestBlockhash("confirmed");
    console.log(
      "   ✅ - Fetched latest blockhash. Last Valid Height:",
      latestBlockhash.lastValidBlockHeight
    );

    let signature = await walletAdapter.sendTransaction(
      transaction,
      connection
    );

    let confirmation = await connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    });

    if (confirmation.value.err)
      throw new Error("Error: Could not confirm transaction");

    console.log("   ✅ - Success!", generateExplorerUrl(signature));
  }

  return (
    <div>
      <h1>Transact!</h1>
      <div>
        <div>
          <input
            type="number"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <button onClick={() => depFunds(depositAmount)}>Deposit</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(+e.target.value)}
          />
          <button onClick={() => withdrawFunds(withdrawAmount)}>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transact;
