import { SupabaseService } from "../services";

export const fetchBidItems = async () => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .select("*, bids(*)")
        .eq("status", "bidding");

    if (error) {
        console.error(error);
        throw error;
    }
    data.forEach((loan_item) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loan_item.bids = loan_item.bids.reduce((highest: any, current: any) => {
            return current.amount > highest.amount ? current : highest;
        }, loan_item.bids[0]);
    });

    return data;
};

export const createBidItems = async (loan_id: string, amount: number) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("bids")
        .insert({
            loan_id: loan_id,
            amount: amount,
        });
    if (error) {
        console.error(error);
        throw error;
    }

    return data;
};
