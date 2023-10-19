import Axios, { type AxiosInstance } from "axios";

export class CoinMarketCapService {
    private static apiInstance: AxiosInstance;

    public static initService() {
        try {
            if (process.env.COIN_MARKET_CAP_KEY) {
                this.apiInstance = Axios.create({
                    baseURL: "https://pro-api.coinmarketcap.com",
                    headers: {
                        "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_CAP_KEY,
                    },
                });
                console.info("CoinMarketCapService initiated successfully!");
            } else {
                console.error("Missing env variables.");
                process.exit(1);
            }
        } catch (err) {
            console.error("CoinMarketCapService not initialized:", err);
            process.exit(1);
        }
    }

    public static getService() {
        if (!this.apiInstance) {
            this.initService();
        }
        return this.apiInstance;
    }
}
