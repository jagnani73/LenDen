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
