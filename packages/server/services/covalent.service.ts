import { CovalentClient } from "@covalenthq/client-sdk";

export class CovalentService {
    private static client: CovalentClient;

    public static initCovalentClient() {
        if (process.env.COVALENT_API) {
            this.client = new CovalentClient(process.env.COVALENT_API);
            console.info("CovalentService initiated successfully!");
        } else {
            console.error("Missing env variables.");
            process.exit(1);
        }
    }

    public static getCovalentClient() {
        if (this.client) {
            return this.client;
        } else {
            this.initCovalentClient();
            return this.client;
        }
    }
}
