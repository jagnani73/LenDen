import { mintNft } from "./cross-chain-nft.services";
import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";

export const crossChainNFTRouter = Router();

const handleCrossChainNFTMint = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { wallet_address, chain } = req.body;
        const hash = await mintNft(wallet_address, chain);
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

crossChainNFTRouter.post("/mint", handleCrossChainNFTMint);
