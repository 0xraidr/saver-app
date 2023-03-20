import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { SaverApp } from "./saver_app";
import { Program } from "@project-serum/anchor";
import BN from "bn.js";
import { getSolBalance } from "./solana";

// export async function initialize (
//     saverAppProgram: Program<SaverApp>,
//     userPubkey: PublicKey,
//     amount: number
// ): Promise< > {

// }

export interface PiggyBankBalance {}

export async function deposit(
  saverAppProgram: Program<SaverApp>,
  userPubkey: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const [piggyBank] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), userPubkey.toBuffer()],
    saverAppProgram.programId
  );

  const tx = await saverAppProgram.methods
    .deposit(new BN(amount * LAMPORTS_PER_SOL))
    .accounts({
      signer: userPubkey,
      escrow: piggyBank,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  console.log(
    "Your transaction signature",
    // when running locally
    // `https://explorer.solana.com/tx/${tx}?cluster=custom&custom_url=http://localhost:8899`
    `https://explorer.solana.com/tx/${tx}?cluster=devnet`
  );
  return tx;
}

export async function withdraw(
  saverAppProgram: Program<SaverApp>,
  userPubkey: PublicKey,
  amount: number
): Promise<TransactionInstruction> {
  const [piggyBank] = PublicKey.findProgramAddressSync(
    [Buffer.from("escrow"), userPubkey.toBuffer()],
    saverAppProgram.programId
  );
  const tx = await saverAppProgram.methods
    .withdraw(new BN(amount * LAMPORTS_PER_SOL))
    .accounts({
      signer: userPubkey,
      escrow: piggyBank,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  console.log(
    "Your transaction signature",
    // when running locally
    // `https://explorer.solana.com/tx/${tx}?cluster=custom&custom_url=http://localhost:8899`
    `https://explorer.solana.com/tx/${tx}?cluster=devnet`
  );
  return tx;
}
