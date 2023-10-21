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

export enum LOAN_TYPE {
    NFT = "nft",
    TOKEN = "token",
}

export enum INPUT_PERIOD_UNIT {
    WEEKS = "weeks",
}

export enum TICKER {
    AVAX = "AVAX",
    MATIC = "MATIC",
}

export enum TOKEN_ID {
    AVAX = 5805,
    MATIC = 3890,
}

export enum COVALENT_CHAIN_NAMES {
    AVAX = "avalanche-testnet",
    MATIC = "matic-mumbai",
}

export const loanEvaluateRequestSchema = yup
    .object()
    .shape({
        type: yup
            .string()
            .trim()
            .oneOf(Object.values(LOAN_TYPE))
            .required("type is required"),
        period: yup.number().oneOf([1, 2, 3]).required("period is required"),
        period_unit: yup
            .string()
            .oneOf(Object.values(INPUT_PERIOD_UNIT))
            .trim()
            .required("period_unit is required"),
        start_time: yup.string().trim().required("start_time is required"),
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
        input_amount: yup.number().when("type", {
            is: LOAN_TYPE.TOKEN,
            then: (schema) => schema.required("input_amount is required"),
            otherwise: (schema) => schema.strip(),
        }),
        mint_address: yup.string().when("type", {
            is: LOAN_TYPE.NFT,
            then: (schema) =>
                schema.trim().required("mint_address is required"),
            otherwise: (schema) => schema.strip(),
        }),
        token_id: yup.string().when("type", {
            is: LOAN_TYPE.NFT,
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
    })
    .strict();

export type LoanEvaluateRequest = yup.InferType<
    typeof loanEvaluateRequestSchema
>;

export const loanAcceptanceRequestSchema = yup
    .object()
    .shape({
        id: yup.string().trim().required("id is required"),
    })
    .strict();

export type LoanAcceptanceRequest = yup.InferType<
    typeof loanAcceptanceRequestSchema
>;

export const loansRequestSchema = yup
    .object()
    .shape({
        username: yup.string().trim().required("username is required"),
    })
    .strict();

export type LoansRequest = yup.InferType<typeof loansRequestSchema>;

export const loanRepaymentRequestSchema = yup
    .object()
    .shape({
        id: yup.string().trim().required("id is required"),
    })
    .strict();

export type LoanRepaymentRequest = yup.InferType<
    typeof loanRepaymentRequestSchema
>;
