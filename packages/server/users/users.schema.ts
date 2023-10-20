import * as yup from "yup";
import { TICKER } from "../loans/loans.schema";

export const userSignUpRequestSchema = yup
    .object({
        username: yup.string().trim().required("username is required"),
        password: yup.string().trim().required("password is required"),
        wallet_addresses: yup
            .object()
            .shape({
                [TICKER.MATIC]: yup.object().shape({
                    wallet_address: yup.string().trim().required(),
                    signature: yup.string().trim().required(),
                }),
                [TICKER.AVAX]: yup.object().shape({
                    wallet_address: yup.string().trim().required(),
                    signature: yup.string().trim().required(),
                }),
            })
            .required("wallet_address is required"),
    })
    .strict();

export type UserSignUpRequest = yup.InferType<typeof userSignUpRequestSchema>;

export const userSignInRequestSchema = yup
    .object()
    .shape({
        username: yup.string().trim().required("username is required"),
        password: yup.string().trim().required("password is required"),
    })
    .strict();

export type UserSignInRequest = yup.InferType<typeof userSignInRequestSchema>;
