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
    for (const loan_item of data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        loan_item.bids = loan_item.bids.reduce((highest: any, current: any) => {
            return current.amount > highest.amount ? current : highest;
        }, loan_item.bids[0]);
        const weeks_passed = Math.floor(
            (new Date(loan_item.bids.created_at).getTime() -
                new Date(loan_item.start_time).getTime()) /
                (1000 * 60 * 60 * 24 * 7)
        );
        if (weeks_passed > 1) {
            const { error } = await SupabaseService.getSupabase()
                .from("loans")
                .update({
                    status: "allotted",
                })
                .eq("id", loan_item.id);
            if (error) {
                console.error(error);
                throw error;
            }
        }
        loan_item.status = "allotted";
    }

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

export const fetchBids = async (loan_id: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("bids")
        .select()
        .eq("loan_id", loan_id)
        .order("amount", { ascending: false });
    if (error) {
        console.error(error);
        throw error;
    }
    return data;
};
