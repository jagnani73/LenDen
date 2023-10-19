import { sign } from "jsonwebtoken";
import { SupabaseService } from "../services";
import { type TICKER } from "../loans/loans.schema";
import { compare, hash } from "bcrypt";

export const userSignUp = async (
    username: string,
    password: string,
    wallet_addresses: Record<
        TICKER,
        { wallet_address: string; signature: string }
    >
) => {
    const hashed_password = await hash(password, 12);
    const { error } = await SupabaseService.getSupabase().from("users").insert({
        username: username,
        wallet_addresses: wallet_addresses,
        hashed_password: hashed_password,
    });
    if (error) {
        console.error(error);
        throw error;
    }
};

export const userAuthentication = async (
    username: string,
    password: string
) => {
    const { data: user, error } = await SupabaseService.getSupabase()
        .from("users")
        .select("username, hashed_password, wallet_addresses")
        .eq("username", username)
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    const authenticated = await compare(password, user.hashed_password);
    if (authenticated) {
        return user;
    } else {
        throw Error("invalid credentials");
    }
};

export const createJWToken = (
    wallet_addresses: Record<TICKER, string>,
    username: string
): string => {
    if (process.env.JWT_SECRET) {
        const token = sign(
            {
                wallet_addresses: wallet_addresses,
                username: username,
            },
            process.env.JWT_SECRET,
            {
                issuer: "admin",
                expiresIn: "24h",
            }
        );
        return token;
    } else {
        console.error("Missing env variables.");
        process.exit(1);
    }
};
