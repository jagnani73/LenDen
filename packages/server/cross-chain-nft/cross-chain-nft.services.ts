import { ethers } from "ethers";
import {
    ABI,
    scoreNftAddressAvax,
    scoreNftAddressPolygon,
} from "./cross-chain-nft.schema";
import { TICKER } from "../loans/loans.schema";
import { userSpecificNotification } from "../notifications/notifications.services";

export const mintNft = async (wallet_address: string, chain: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
        chain === TICKER.MATIC
            ? process.env.RPC_ENDPOINT_POLYGON
            : process.env.RPC_ENDPOINT_AVAX
    );
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const contract = new ethers.Contract(
        chain === TICKER.MATIC ? scoreNftAddressPolygon : scoreNftAddressAvax,
        ABI,
        signer
    );
    const txn = await contract.mint(wallet_address, [1], [1], "0x");
    await txn.wait();
    userSpecificNotification(
        wallet_address,
        "Reputation Increased!",
        `An NFT indicating your increase in reputation has been minted.`
    );
    return txn.hash;
};
