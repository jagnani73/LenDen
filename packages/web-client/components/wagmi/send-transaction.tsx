import { SendTransactionProps } from "@/utils/types/wagmi.types";
import { parseEther } from "ethers";
import { useEffect } from "react";
import { useSendTransaction } from "wagmi";

const SendTransaction: React.FC<SendTransactionProps> = ({ to, value }) => {
  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    to: to,
    value: value,
  });

  useEffect(() => {
    sendTransaction();
  }, []);

  return <></>;
};

export default SendTransaction;
