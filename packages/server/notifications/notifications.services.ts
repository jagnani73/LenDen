import { PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";

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
