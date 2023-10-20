import { LOAN_TYPE, TICKER } from "../constants/services.constants";

export interface Loan {
  id: string;
  start_time: string;
  type: LOAN_TYPE;
  period: number;
  period_unit: string;
  input_ticker: TICKER;
  output_ticker: TICKER;
  input_amount: number | null;
  mint_address: string | null;
  token_id: string | null;
  principal: number;
  interest: number;
  exchange_rate: number;
  status: string;
  input_wallet_address: string;
  output_wallet_address: string;
  username: string;
  warning_intensity: number;
  additional_interest: number;
  output_amount: number;
}

export interface Evaluation {
  id: string;
  period: number;
  period_unit: string;
  output_ticker: string;
  principal: number;
  interest: number;
  exchange_rate: number;
  output_amount: number;
}
