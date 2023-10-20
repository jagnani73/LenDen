import * as yup from "yup";

export const bidRequestSchema = yup
    .object()
    .shape({
        loan_id: yup.string().trim().required("loan_id is required"),
        amount: yup.number().required("amount is required"),
    })
    .strict();

export type BidRequest = yup.InferType<typeof bidRequestSchema>;

export const bidsRequestSchema = yup
    .object()
    .shape({
        loan_id: yup.string().trim().required("loan_id is required"),
    })
    .strict();

export type BidsRequest = yup.InferType<typeof bidsRequestSchema>;
