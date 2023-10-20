import { SupabaseService } from "../services";
import { type TICKER } from "../loans/loans.schema";
import { transferToken } from "../assets/assets.services";
import { userSpecificNotification } from "../notifications/notifications.services";

export const createLending = async (
    amount: number,
    ticker: TICKER,
    wallet_address: string,
    period: number,
    username: string
) => {
    const interest: number = 2;
    const { error } = await SupabaseService.getSupabase()
        .from("lending")
        .insert({
            amount: amount,
            ticker: ticker,
            wallet_address: wallet_address,
            period: period,
            username: username,
            interest: interest,
            maturity: amount + (interest / 100) * amount,
        });
    if (error) {
        console.error(error);
        throw error;
    }
    userSpecificNotification(
        wallet_address,
        "Lending Created",
        `A lending of ${amount} ${ticker} has been created for ${period} weeks.`
    );
    return;
};

export const completeLending = async (id: number) => {
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
    userSpecificNotification(
        data.wallet_address,
        "Lending Matured",
        `The lending of ${data.amount} ${data.ticker} has been matured.`
    );
    return hash;
};

export const fetchLending = async (username: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("lending")
        .select()
        .eq("username", username);
    if (error) {
        console.error(error);
        throw error;
    }
    return data;
};
