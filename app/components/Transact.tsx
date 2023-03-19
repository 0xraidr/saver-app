import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { FC, useState } from "react";
import { deposit } from "../utils/instructions";
import { generateExplorerUrl } from "../utils/solana";
import { useWorkspace } from "./WorkspaceProvider";
import { workspace } from "@project-serum/anchor";

const Transact = () => {
  const workspace = useWorkspace();
  const { connection } = useConnection();
  const walletAdapter = useWallet();

  const saverAppProgram = workspace.saverAppProgram;

  const transaction = new Transaction();

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

  return (
    <div>
      <h1>Transact!</h1>
      <div>
        <button
          onClick={() => {
            depFunds(1);
          }}
        >
          Click Here to deposit 1 SOL!
        </button>
      </div>
    </div>
  );
};

export default Transact;
