export interface SendTransactionProps {
  to: string;
  value: bigint;
}

export interface ContractWrite {
  address: string;
  token_id: number;
  wallet_address: string;
}
