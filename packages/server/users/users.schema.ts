import * as yup from "yup";
import { TICKER } from "../loans/loans.schema";

export const userSignUpRequestSchema = yup.object({
    username: yup.string().trim().required("username is required"),
    password: yup.string().trim().required("password is required"),
    wallet_addresses: yup
        .object()
        .shape({
            [TICKER.MATIC]: yup.string().trim().required(),
            [TICKER.SOL]: yup.string().trim().required(),
        })
        .required("wallet_address is required"),
    signature: yup.string().trim().required("signature is required"),
});

export type UserSignUpRequest = yup.InferType<typeof userSignUpRequestSchema>;

export const userSignInRequestSchema = yup.object().shape({
    username: yup.string().trim().required("username is required"),
    password: yup.string().trim().required("password is required"),
});

export type UserSignInRequest = yup.InferType<typeof userSignInRequestSchema>;
