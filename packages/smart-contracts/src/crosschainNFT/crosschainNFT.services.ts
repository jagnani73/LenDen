import { ABI, scoreNftAddressAvax, scoreNftAddressPolygon } from "./constants";
import { config as DotenvConfig } from "dotenv";
DotenvConfig();
import { ethers } from "ethers";

const mintNft = async (req: any, res: any) => {
    try {
        const { walletAddress, chain } = req.body;

        if (!walletAddress) {
            res.send({
                success: false,
                message: "Wallet address not provided",
            });
        }

        const provider = new ethers.JsonRpcProvider(
            chain === "polygon"
                ? process.env.RPC_ENDPOINT_POLYGON
                : process.env.RPC_ENDPOINT_AVAX
        );

        const signer = new ethers.Wallet(process.env.DEV_PK!, provider);

        const contract = new ethers.Contract(
            chain === "polygon" ? scoreNftAddressPolygon : scoreNftAddressAvax,
            ABI,
            signer
        );

        const txn = await contract.mint(walletAddress,[1],[1],"0x");

        await txn.wait();

        return res.json({
            success: true,
            message: "NFT minted successfully",
            transactionHash: txn.hash,
        });
    } catch (error: any) {
        console.log(error.message);
    }
};

export { mintNft };