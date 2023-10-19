import {
    INPUT_TYPE,
    TICKER,
    type LoanEvaluateRequest,
    TOKEN_ID,
    type CoinMarketCapPriceConversionResponse,
} from "./loans.schema";
import { CoinMarketCapService } from "../services";

export const evaluateLoanValue = async (input: LoanEvaluateRequest) => {
    const input_id =
        input.input_ticker === TICKER.SOL ? TOKEN_ID.SOLANA : TOKEN_ID.MATIC;
    const output_id =
        input.input_ticker === TICKER.MATIC ? TOKEN_ID.SOLANA : TOKEN_ID.MATIC;

    let principal: number = 0,
        interest: number = 0;

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
            const exchange_rate = data.quote[output_id].price;
            principal = exchange_rate + (interest / 2 / 100) * exchange_rate;
            break;
        }
    }

    return {
        principal: principal,
        interest: interest,
    };
};
