import { ethers } from "ethers";
import { config as DotenvConfig } from "dotenv";
import { ABI } from "./constants";
DotenvConfig();

const transferToDev = async (req: any, res: any) => {
    try {
        const { collectionAddress, tokenId, wallet } = req.body;

        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_ENDPOINT_POLYGON
        );

        const signer = new ethers.Wallet(wallet, provider);

        const contract = new ethers.Contract(collectionAddress, ABI, signer);

        const txn = await contract.safeTransferFrom(
            signer.address,
            process.env.DEV_ADDRESS,
            tokenId
        );

        await txn.wait();

        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: txn.hash,
        });
    } catch (error: any) {
        console.log(error.message);
        res.send({
            success: false,
            message: error.message,
        });
    }
};

const transferToClient = async (req: any, res: any) => {
    try {
        const { collectionAddress, tokenId, wallet } = req.body;

        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_ENDPOINT_POLYGON
        );

        const signer = new ethers.Wallet(process.env.DEV_PK!, provider);

        const contract = new ethers.Contract(collectionAddress, ABI, signer);

        const txn = await contract.safeTransferFrom(
            signer.address,
            wallet,
            tokenId
        );

        await txn.wait();

        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: txn.hash,
        });
    } catch (error: any) {
        console.log(error.message);
        res.send({
            success: false,
            message: error.message,
        });
    }
};

export { transferToDev, transferToClient };
