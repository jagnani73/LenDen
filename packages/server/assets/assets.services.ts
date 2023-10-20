import { ethers } from "ethers";
import { ABI } from "./assets.schema";
import { TICKER } from "../loans/loans.schema";
import { userSpecificNotification } from "../notifications/notifications.services";

export const transferNFT = async (
    wallet: string,
    collection_address: string,
    token_id: string,
    ticker: TICKER,
    mode: "collateral" | "repayment"
) => {
    const isPolygon = ticker === TICKER.MATIC;
    const provider = new ethers.providers.JsonRpcProvider(
        isPolygon
            ? process.env.RPC_ENDPOINT_POLYGON
            : process.env.RPC_ENDPOINT_AVAX
    );
    const signer =
        mode === "collateral"
            ? new ethers.Wallet(wallet, provider)
            : new ethers.Wallet(process.env.DEV_PK!, provider);
    const recipient = mode === "collateral" ? process.env.DEV_ADDRESS : wallet;
    const contract = new ethers.Contract(collection_address, ABI, signer);
    const txn = await contract.safeTransferFrom(
        signer.address,
        recipient,
        token_id
    );
    await txn.wait();
    userSpecificNotification(
        wallet,
        "NFT Transferred",
        `The NFT from Collection Address ${collection_address} with Token ID ${token_id} has been successfully transferred.`
    );
    return txn.hash;
};

export const transferToken = async (
    wallet: string,
    amount: string,
    ticker: TICKER,
    mode: "collateral" | "repayment"
) => {
    const provider = new ethers.providers.JsonRpcProvider(
        ticker === TICKER.MATIC
            ? process.env.RPC_ENDPOINT_POLYGON
            : process.env.RPC_ENDPOINT_AVAX
    );
    const transactionParams = {
        from: mode === "collateral" ? wallet : process.env.DEV_ADDRESS,
        to: mode === "collateral" ? process.env.DEV_ADDRESS : wallet,
        data: "0x",
        value: ethers.utils.parseEther(amount),
    };
    const signer = new ethers.Wallet(
        mode === "collateral" ? wallet : process.env.DEV_PK!,
        provider
    );
    const txn = await signer.sendTransaction(transactionParams);
    await txn.wait();
    userSpecificNotification(
        wallet,
        "Token Transferred",
        `The ${ticker} Token of amount ${amount} has been successfully transferred.`
    );
    return txn.hash;
};
