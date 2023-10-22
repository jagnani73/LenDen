import {
    LOAN_TYPE,
    TICKER,
    type LoanEvaluateRequest,
    TOKEN_ID,
    type CoinMarketCapPriceConversionResponse,
} from "./loans.schema";
import {
    CoinMarketCapService,
    CovalentService,
    SupabaseService,
} from "../services";
import { transferNFT, transferToken } from "../assets/assets.services";
import { mintNft } from "../cross-chain-nft/cross-chain-nft.services";
import { userSpecificNotification } from "../notifications/notifications.services";

export const evaluateLoanValue = async (input: LoanEvaluateRequest) => {
    const input_id =
        input.input_ticker === TICKER.AVAX ? TOKEN_ID.AVAX : TOKEN_ID.MATIC;
    const output_id =
        input.input_ticker === TICKER.MATIC ? TOKEN_ID.AVAX : TOKEN_ID.MATIC;

    let principal: number = 0,
        interest: number = 0,
        exchange_rate: number = 1,
        output_amount: number | null = null;

    switch (input.period) {
        case 1: {
            interest = 2;
            break;
        }
        case 2: {
            interest = 3;
            break;
        }
        case 3: {
            interest = 5;
            break;
        }
    }

    switch (input.type) {
        case LOAN_TYPE.TOKEN: {
            const response = await CoinMarketCapService.getService().get(
                "/v2/tools/price-conversion",
                {
                    params: {
                        amount: input.input_amount,
                        id: input_id,
                        convert_id: output_id,
                    },
                }
            );
            const data = response.data
                .data as CoinMarketCapPriceConversionResponse;
            exchange_rate = data.quote[output_id].price;
            output_amount = (input.input_amount as number) * exchange_rate;
            break;
        }
        case LOAN_TYPE.NFT: {
            await CovalentService.getCovalentClient().NftService.getNftMarketFloorPrice(
                "avalanche-testnet",
                input.mint_address as string,
                {
                    days: 1,
                    quoteCurrency: "USD",
                }
            );

            output_amount = Math.random();
        }
    }
    principal =
        (output_amount as number) +
        (interest / 100) * (output_amount as number);

    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .insert({
            type: input.type,
            period: input.period,
            period_unit: input.period_unit,
            input_ticker: input.input_ticker,
            output_ticker: input.output_ticker,
            input_amount: input.input_amount ?? null,
            output_amount: output_amount,
            mint_address: input.mint_address ?? null,
            token_id: input.token_id ?? null,
            principal: principal,
            interest: interest,
            exchange_rate: exchange_rate,
            input_wallet_address: input.input_wallet_address,
            output_wallet_address: input.output_wallet_address,
            username: input.username,
        })
        .select("id")
        .single();
    if (error) {
        console.error(error);
        throw error;
    }

    return {
        id: data.id,
        principal: principal,
        interest: interest,
        input_amount: input.input_amount,
        output_amount: output_amount,
        exchange_rate: exchange_rate,
    };
};

export const acceptLoan = async (id: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .update({
            status: "accepted",
        })
        .eq("id", id)
        .select()
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    let hash: string = "";
    hash = await transferToken(
        data.output_wallet_address,
        data.output_amount.toString(),
        data.output_ticker,
        "repayment"
    );
    userSpecificNotification(
        data.output_wallet_address,
        "Loan Taken",
        `A loan of ${data.output_amount} ${data.output_ticker} has been taken for ${data.period} weeks.`
    );
    return hash;
};

export const getLoansForUser = async (username: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .select()
        .eq("username", username)
        .neq("status", "evaluation")
        .order("start_time", { ascending: true });
    if (error) {
        console.error(error);
        throw error;
    }

    const loans = [];
    for (const loan of data) {
        const weeks_passed = Math.floor(
            (new Date().getTime() - new Date(loan.start_time).getTime()) /
                (1000 * 60 * 60 * 24 * 7)
        );
        const warning_intensity: number = Math.max(
            0,
            Math.min(4, weeks_passed - loan.period)
        );
        const additional_interest: number = Math.max(
            0,
            weeks_passed - loan.period
        );
        if (
            warning_intensity !== loan.warning_intensity ||
            additional_interest !== loan.additional_interest
        ) {
            const new_principal =
                loan.principal + (additional_interest / 100) * loan.principal;
            const { error } = await SupabaseService.getSupabase()
                .from("loans")
                .update({
                    warning_intensity: warning_intensity,
                    additional_interest: additional_interest,
                    principal: new_principal,
                })
                .eq("id", loan.id);
            if (error) {
                console.error(error);
                throw error;
            }
            loan.warning_intensity = warning_intensity;
            loan.additional_interest = additional_interest;
            loan.principal = new_principal;
            userSpecificNotification(
                loan.output_wallet_address,
                "Delayed Repayment of Loan",
                `The repayment of the loan of ${loan.output_amount} ${loan.output_ticker} has been delayed with warning level ${warning_intensity}. At level 4, you lose the ownership of the asset.`
            );
        }
        if (warning_intensity === 4) {
            const new_status =
                loan.type === LOAN_TYPE.NFT ? "bidding" : "allotted";
            const { error } = await SupabaseService.getSupabase()
                .from("loans")
                .update({
                    status: new_status,
                })
                .eq("id", loan.id);
            if (error) {
                console.error(error);
                throw error;
            }
            loan.status = new_status;
            userSpecificNotification(
                loan.output_wallet_address,
                "Asset Seized",
                `The asset has been seized due to non-repayment.`
            );
        }
        loans.push(loan);
    }
    return loans;
};

export const repaymentLoan = async (id: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .update({
            status: "repayed",
        })
        .eq("id", id)
        .select()
        .single();
    if (error) {
        console.error(error);
        throw error;
    }
    let hash: string = "";
    if (data.type === LOAN_TYPE.NFT) {
        hash = await transferNFT(
            data.input_wallet_address,
            data.mint_address,
            data.token_id,
            data.input_ticker,
            "repayment"
        );
    } else if (data.type === LOAN_TYPE.TOKEN) {
        hash = await transferToken(
            data.input_wallet_address,
            data.input_amount.toString(),
            data.input_ticker,
            "repayment"
        );
    }
    userSpecificNotification(
        data.output_wallet_address,
        "Loan Repayed!",
        `You have repayed the loan successfully. Your collateral has been transferred back to your wallet address.`
    );
    if (data.additional_interest === 0) {
        await mintNft(data.input_wallet_address, data.input_ticker);
    }

    return hash;
};
