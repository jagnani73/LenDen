import * as yup from "yup";
import { TICKER } from "../loans/loans.schema";

export const createLendingRequestSchema = yup
    .object({
        ticker: yup
            .string()
            .oneOf(Object.values(TICKER))
            .trim()
            .required("ticker is required"),
        amount: yup.number().required("amount is required"),
        wallet_address: yup
            .string()
            .trim()
            .required("wallet_address is required"),
        period: yup.number().required("period is required"),
        username: yup.string().trim().required("username is required"),
    })
    .strict();

export type CreateLendingRequest = yup.InferType<
    typeof createLendingRequestSchema
>;

export const completeLendingRequestSchema = yup
    .object({
        id: yup.number().required("id is required"),
    })
    .strict();

export type CompleteLendingRequest = yup.InferType<
    typeof completeLendingRequestSchema
>;

export const lendingRequestSchema = yup
    .object({
        username: yup.string().trim().required("username is required"),
    })
    .strict();

export type LendingRequest = yup.InferType<typeof lendingRequestSchema>;
