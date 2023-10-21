import { COVALENT_CHAIN_NAMES } from "../loans/loans.schema";
import { sendNotification } from "../notifications/notifications.services";
import { CovalentService, SupabaseService } from "../services";

export const fetchBidItem = async (id: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .select()
        .eq("id", id)
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    const { data: nftData } =
        await CovalentService.getCovalentClient().NftService.getNftMetadataForGivenTokenIdForContract(
            COVALENT_CHAIN_NAMES[
                data.input_ticker as keyof typeof COVALENT_CHAIN_NAMES
            ],
            data.mint_address,
            data.token_id,
            {
                noMetadata: true,
                withUncached: true,
            }
        );
    return {
        item: data,
        nft: nftData.items[0].nft_data.external_data.image_1024,
    };
};

export const createBid = async (
    loan_id: string,
    amount: number,
    wallet_address: string
) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("bids")
        .insert({
            loan_id: loan_id,
            amount: amount,
            wallet_address: wallet_address,
        });
    if (error) {
        console.error(error);
        throw error;
    }
    sendNotification(
        "Bid Created",
        `A bid has been created for the Loan ID ${loan_id}.`
    );
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

    if (
        data.length &&
        Math.floor(
            (new Date().getTime() - new Date(data[0].created_at).getTime()) /
                (1000 * 60 * 60 * 24 * 7)
        ) >= 1
    ) {
        const new_status: string = "allotted";
        const { error } = await SupabaseService.getSupabase()
            .from("loans")
            .update({
                status: new_status,
            })
            .eq("id", data[0].loan_id);
        if (error) {
            console.error(error);
            throw error;
        }
        data[0].status = new_status;
        sendNotification(
            "Item Allotted",
            `The item with the Loan ID ${loan_id} has been allotted.`
        );
    }
    return data;
};
