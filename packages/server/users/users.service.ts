import { sign } from "jsonwebtoken";
import { SupabaseService } from "../services";

export const userSignUp = async (
    username: string,
    wallet_address: string,
    signature: string
) => {
    const { error } = await SupabaseService.getSupabase().from("users").insert({
        username: username,
        wallet_address: wallet_address,
        signature: signature,
    });
    if (error) {
        console.error(error);
        throw error;
    }
};

export const userExists = async (wallet_address: string) => {
    const { data: user, error } = await SupabaseService.getSupabase()
        .from("users")
        .select("wallet_address, username")
        .eq("wallet_address", wallet_address)
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    return user as { wallet_address: string; username: string };
};

export const createJWToken = (
    wallet_address: string,
    username: string
): string => {
    if (process.env.JWT_SECRET) {
        const token = sign(
            {
                wallet_address: wallet_address,
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
