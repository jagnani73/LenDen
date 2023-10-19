import { ethers } from "ethers";
import { ABI } from "./avax.schema";

export const transferNFTToAdmin = async (
    wallet: string,
    token_id: string,
    collection_address: string
) => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_AVAX);
    const signer = new ethers.Wallet(wallet, provider);
    const contract = new ethers.Contract(collection_address, ABI, signer);
    const txn = await contract.safeTransferFrom(
        signer.address,
        process.env.DEV_ADDRESS,
        token_id
    );

    await txn.wait();
    return txn.hash;
};

export const transferNFTToUser = async (
    wallet: string,
    token_id: string,
    collection_address: string
) => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_AVAX);
    const signer = new ethers.Wallet(process.env.DEV_PK!, provider);
    const contract = new ethers.Contract(collection_address, ABI, signer);
    const txn = await contract.safeTransferFrom(
        signer.address,
        wallet,
        token_id
    );

    await txn.wait();
    return txn.hash;
};

export const transferTokenToUser = async (amount: string, wallet: string) => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_AVAX);
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
};

export const transferTokenToAdmin = async (amount: string, wallet: string) => {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_AVAX);
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
};
