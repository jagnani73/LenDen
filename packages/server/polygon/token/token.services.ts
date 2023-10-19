import { ethers } from "ethers";
import { config as DotenvConfig } from "dotenv";
DotenvConfig();

const transferToDev = async (req: any, res: any) => {
    try {
        const { amount, wallet } = req.body;

        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_ENDPOINT_POLYGON
        );

        const signer = new ethers.Wallet(wallet, provider);

        const transactionParams = {
            from: signer.address,
            to: process.env.DEV_ADDRESS,
            data: "0x",
            value: ethers.parseEther(amount),
        };

        const txn = await signer.sendTransaction(transactionParams);

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
        const { amount, wallet } = req.body;

        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_ENDPOINT_POLYGON
        );

        const signer = new ethers.Wallet(process.env.DEV_PK!, provider);

        const transactionParams = {
            from: process.env.DEV_ADDRESS,
            to: wallet,
            data: "0x",
            value: ethers.parseEther(amount),
        };

        const txn = await signer.sendTransaction(transactionParams);

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
