import { FC } from "react";

interface WalletBalancesProps {
  solBalance: number;
  piggyBankBalance: number;
}

const WalletBalances: FC<WalletBalancesProps> = (
  props: WalletBalancesProps
) => {
  return (
    <p className="text: bg-pink-500">
      Wallet Balance: <code>◎{props.solBalance}</code> <br />
      PiggyBank Balance: <code>◎{props.piggyBankBalance}</code>
    </p>
  );
};

export default WalletBalances;
