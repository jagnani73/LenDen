import { PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { SupabaseService } from "../services";
import { TICKER } from "../loans/loans.schema";

export const sendNotification = async (title: string, body: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_ENDPOINT_POLYGON!
    );
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const adminUser = await PushAPI.initialize(signer, { env: ENV.STAGING });

    const sendNotif = await adminUser.channel.send(["*"], {
        notification: {
            title,
            body,
        },
    });

    return sendNotif.data;
};

export const userSpecificNotification = async (
    wallet_address: string,
    title: string,
    body: string
) => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_ENDPOINT_POLYGON!
    );
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const adminUser = await PushAPI.initialize(signer, { env: ENV.STAGING });

    const sendNotif = await adminUser.channel.send([wallet_address], {
        notification: {
            title,
            body,
        },
    });

    return sendNotif;
};

export const createChannelSettings = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_ENDPOINT_POLYGON!
    );
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const adminUser = await PushAPI.initialize(signer, { env: ENV.STAGING });

    const setting = await adminUser.channel.setting([
        {
            description: "New Loan Option",
            type: 1,
            default: 1,
        },
        {
            description: "Warning Notification",
            type: 1,
            default: 1,
        },
        {
            description: "Success Payment",
            type: 1,
            default: 1,
        },
        {
            description: "Moved to Bidding",
            type: 1,
            default: 1,
        },
    ]);

    return setting.transactionHash;
};

export const optOutOfSettings = async (index: number, userId: string) => {
    const { data, error } = await SupabaseService.getSupabase()
        .from("users")
        .select("notification_settings")
        .eq("id", userId)
        .single();

    if (error) {
        console.log(error);
    } else {
        const existingSettings = data.notification_settings;

        if (existingSettings && Array.isArray(existingSettings)) {
            const indexToRemove = index;

            if (indexToRemove >= 0 && indexToRemove < existingSettings.length) {
                existingSettings.splice(indexToRemove, 1);
                const { data: updateData, error: updateError } =
                    await SupabaseService.getSupabase()
                        .from("users")
                        .update({ settings: existingSettings })
                        .eq("id", userId)
                        .select("notification_settings")
                        .single();

                if (updateError) {
                    console.log(error);
                } else {
                    return updateData.notification_settings;
                }
            } else {
                console.log("Index out of bounds.");
            }
        } else {
            console.log("Settings is not an array or does not exist.");
        }
    }
};

export const sendSettingsNotification = async (index: number) => {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_ENDPOINT_POLYGON!
    );
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const adminUser = await PushAPI.initialize(signer, { env: ENV.STAGING });

    const { data, error } = await SupabaseService.getSupabase()
        .from("users")
        .select("wallet_addresses")
        .eq("notification_settings:array:contains", index);

    if (error) {
        console.error(error);
    }
    if (data) {
        const recipients = data.map(
            (user) => user.wallet_addresses[TICKER.MATIC].wallet_address
        );

        let title = "";
        let description = "";
        if (index === 0) {
            title = "New Loan Option";
            description = "New loan option has been created";
        } else if (index === 1) {
            title = "Warning Notification";
            description = "Warning notification has been triggered";
        } else if (index === 2) {
            title = "Success Payment";
            description = "Success payment has been triggered";
        } else if (index === 3) {
            title = "Moved to Bidding";
            description = "Moved to bidding has been triggered";
        }

        const res = await adminUser.channel.send(recipients, {
            notification: {
                title: title,
                body: description,
            },
            payload: {
                title: title,
                body: description,
                index: {
                    index: index,
                },
            },
        });

        return res.data;
    }
};
