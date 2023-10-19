import * as yup from "yup";

export const userSignUpRequestSchema = yup.object({
    username: yup.string().trim().required("username is required"),
    wallet_address: yup.string().trim().required("wallet_address is required"),
    signature: yup.string().trim().required("signature is required"),
});

export type UserSignUpRequest = yup.InferType<typeof userSignUpRequestSchema>;

export const userSignInRequestSchema = yup.object({
    wallet_address: yup.string().trim().required("wallet_address is required"),
});

export type UserSignInRequest = yup.InferType<typeof userSignInRequestSchema>;
