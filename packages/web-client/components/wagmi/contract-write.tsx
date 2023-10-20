import { ContractWrite } from "@/utils/types/wagmi.types";
import { useEffect } from "react";
import { useContractWrite, erc721ABI } from "wagmi";

const ContractWrite: React.FC<ContractWrite> = ({
  address,
  token_id,
  wallet_address,
}) => {
  console.log(address as `0x${string}`);
  const { write } = useContractWrite({
    address: address as `0x${string}`,
    abi: erc721ABI,
    functionName: "safeTransferFrom",
    args: [
      wallet_address as `0x${string}`,
      "0xeC2265da865A947647CE6175a4a2646318f6DCEb",
      token_id as unknown as bigint,
    ],
  });

  useEffect(() => {
    write();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default ContractWrite;
