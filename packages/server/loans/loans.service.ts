import {
    INPUT_TYPE,
    TICKER,
    type LoanEvaluateRequest,
    TOKEN_ID,
    type CoinMarketCapPriceConversionResponse,
} from "./loans.schema";
import { CoinMarketCapService, SupabaseService } from "../services";

export const evaluateLoanValue = async (input: LoanEvaluateRequest) => {
    const input_id =
        input.input_ticker === TICKER.SOL ? TOKEN_ID.SOLANA : TOKEN_ID.MATIC;
    const output_id =
        input.input_ticker === TICKER.MATIC ? TOKEN_ID.SOLANA : TOKEN_ID.MATIC;

    let principal: number = 0,
        interest: number = 0,
        exchange_rate: number = 1;

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
        case INPUT_TYPE.TOKEN: {
            const response = await CoinMarketCapService.getService().get(
                "/v2/tools/price-conversion",
                {
                    params: {
                        amount: input.amount,
                        id: input_id,
                        convert_id: output_id,
                    },
                }
            );
            const data = response.data
                .data as CoinMarketCapPriceConversionResponse;
            exchange_rate = data.quote[output_id].price;
            principal = exchange_rate + (interest / 2 / 100) * exchange_rate;
            break;
        }
    }

    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .insert({
            type: input.type,
            period: input.period,
            period_unit: input.period_unit,
            input_ticker: input.input_ticker,
            output_ticker: input.output_ticker,
            amount: input.amount ?? null,
            mint_address: input.mint_address ?? null,
            token_id: input.token_id ?? null,
            principal: principal,
            interest: interest,
            exchange_rate: exchange_rate,
            input_wallet_address: input.input_wallet_address,
            output_wallet_address: input.output_wallet_address,
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
    };
};

export const acceptLoan = async (id: string) => {
    const { error } = await SupabaseService.getSupabase()
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
};

export const getLoansForUser = async (username: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("loans")
        .select()
        .eq("username", username);
    if (error) {
        console.error(error);
        throw error;
    }
    return data;
};
