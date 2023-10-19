import * as yup from "yup";

export interface CoinMarketCapPriceConversionResponse {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
        [key: string]: {
            price: number;
            last_updated: string;
        };
    };
}

export enum INPUT_TYPE {
    NFT = "nft",
    TOKEN = "token",
}

export enum INPUT_PERIOD_UNIT {
    WEEKS = "weeks",
}

export enum TICKER {
    SOL = "SOL",
    MATIC = "MATIC",
}

export enum TOKEN_ID {
    SOLANA = 5426,
    MATIC = 3890,
}

export const loanEvaluateRequestSchema = yup.object().shape({
    type: yup
        .string()
        .trim()
        .oneOf(Object.values(INPUT_TYPE))
        .required("type is required"),
    period: yup.number().oneOf([1, 2, 3]).required("period is required"),
    period_unit: yup
        .string()
        .oneOf(Object.values(INPUT_PERIOD_UNIT))
        .trim()
        .required("period_unit is required"),
    start_time: yup.date().required("start_time is required"),
    username: yup.string().trim().required("username is required"),
    input_ticker: yup
        .string()
        .oneOf(Object.values(TICKER))
        .trim()
        .required("input_ticker is required"),
    output_ticker: yup
        .string()
        .oneOf(Object.values(TICKER))
        .trim()
        .required("output_ticker is required"),
    amount: yup.number().when("type", {
        is: INPUT_TYPE.TOKEN,
        then: (schema) => schema.required("amount is required"),
        otherwise: (schema) => schema.strip(),
    }),
    mint_address: yup.string().when("type", {
        is: INPUT_TYPE.NFT,
        then: (schema) => schema.trim().required("mint_address is required"),
        otherwise: (schema) => schema.strip(),
    }),
    token_id: yup.string().when("type", {
        is: INPUT_TYPE.NFT,
        then: (schema) => schema.trim().required("token_id is required"),
        otherwise: (schema) => schema.strip(),
    }),
    input_wallet_address: yup
        .string()
        .trim()
        .required("input_wallet_address is required"),
    output_wallet_address: yup
        .string()
        .trim()
        .required("output_wallet_address is required"),
});

export type LoanEvaluateRequest = yup.InferType<
    typeof loanEvaluateRequestSchema
>;

export const loanAcceptanceRequestSchema = yup.object().shape({
    id: yup.string().trim().required("id is required"),
});

export type LoanAcceptanceRequest = yup.InferType<
    typeof loanAcceptanceRequestSchema
>;

export const loansRequestSchema = yup.object().shape({
    username: yup.string().trim().required("username is required"),
});

export type LoansRequest = yup.InferType<typeof loansRequestSchema>;

export const loanRepaymentRequestSchema = yup.object().shape({
    id: yup.string().trim().required("id is required"),
});

export type LoanRepaymentRequest = yup.InferType<
    typeof loanRepaymentRequestSchema
>;
