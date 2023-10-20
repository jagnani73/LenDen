import { SupabaseService } from "../services";
import { type TICKER } from "../loans/loans.schema";
import { transferToken } from "../assets/assets.services";

export const createLending = async (
    amount: number,
    ticker: TICKER,
    wallet_address: string
) => {
    const { error } = await SupabaseService.getSupabase()
        .from("lending")
        .insert({
            amount: amount,
            ticker: ticker,
            wallet_address: wallet_address,
        });
    if (error) {
        console.error(error);
        throw error;
    }
    const hash = transferToken(
        wallet_address,
        amount.toString(),
        ticker,
        "collateral"
    );
    return hash;
};

export const completeLending = async (id: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("lending")
        .update({
            status: "complete",
        })
        .eq("id", id)
        .select()
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    const hash = transferToken(
        data.wallet_address,
        (data.amount + (data.interest / 100) * data.amount).toString(),
        data.ticker,
        "repayment"
    );
    return hash;
};