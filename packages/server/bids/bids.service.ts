import { SupabaseService } from "../services";

export const fetchBidItems = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .select("")
        .eq("status", "bidding");
    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
