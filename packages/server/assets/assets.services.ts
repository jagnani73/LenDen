import { ethers } from "ethers";
import { ABI } from "./polygon.schema";

export const transferNFT = async (
    wallet: string,
    token_id: string,
    collection_address: string,
    chain: string,
    mode: "collateral" | "repayment"
) => {
    const provider = new ethers.JsonRpcProvider(
        chain === "polygon"
            ? process.env.RPC_ENDPOINT_POLYGON
            : process.env.RPC_ENDPOINT_AVAX
    );
    if (mode === "collateral") {
        const signer = new ethers.Wallet(wallet, provider);
        const contract = new ethers.Contract(collection_address, ABI, signer);
        const txn = await contract.safeTransferFrom(
            signer.address,
            process.env.DEV_ADDRESS,
            token_id
        );
        await txn.wait();
        return txn.hash;
    } else if (mode === "repayment") {
        const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
        const contract = new ethers.Contract(collection_address, ABI, signer);
        const txn = await contract.safeTransferFrom(
            signer.address,
            wallet,
            token_id
        );
        await txn.wait();
        return txn.hash;
    }
};

export const transferToken = async (
    amount: string,
    wallet: string,
    chain: string,
    mode: "collateral" | "repayment"
) => {
    const provider = new ethers.JsonRpcProvider(
        chain === "polygon"
            ? process.env.RPC_ENDPOINT_POLYGON
            : process.env.RPC_ENDPOINT_AVAX
    );

    if (mode === "collateral") {
        const signer = new ethers.Wallet(wallet, provider);
        const transactionParams = {
            from: signer.address,
            to: process.env.DEV_ADDRESS,
            data: "0x",
            value: ethers.parseEther(amount),
        };
        const txn = await signer.sendTransaction(transactionParams);

        await txn.wait();
        return txn.hash;
    } else if (mode === "repayment") {
        const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
        const transactionParams = {
            from: process.env.DEV_ADDRESS,
            to: wallet,
            data: "0x",
            value: ethers.parseEther(amount),
        };
        const txn = await signer.sendTransaction(transactionParams);

        await txn.wait();
        return txn.hash;
    }
};
