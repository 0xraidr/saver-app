import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { getSolBalance } from "../utils/solana";
import Transact from "./Transact";
// when ready to implement SaverApp Component below
// import SaverApp from "./SaverApp";
import WalletBalances from "./WalletBalances";

export const HomeView: FC = ({}) => {
  const [solBalance, setSolBalance] = useState<number>(0);
  const [refreshSol, refreshSolTrigger] = useState<boolean>(false);

  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      try {
        let balance = await getSolBalance(connection, publicKey);
        setSolBalance(balance);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [publicKey, connection, refreshSol]);

  return (
    <div>
      <Head>
        <title>SaverApp!</title>
        <meta name="description" content="idkidkidk" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Welcome to Scavv.</h1>
        <p>testing...</p>
        <WalletMultiButton />

        {connected && <WalletBalances solBalance={solBalance} />}

        <Transact />
      </main>
    </div>
  );
};
