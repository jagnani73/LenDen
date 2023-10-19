import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import {
    transferNFT,
    transferToken
} from "./assets.services";

export const assetsRouter = Router();

const handleTransferNFTToAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { collection_address, token_id, wallet, chain } = req.body;
        const hash = await transferNFT(
            wallet,
            token_id,
            collection_address,
            chain,
            "collateral"
        );
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};
const handleTransferNFTToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { collection_address, token_id, wallet, chain } = req.body;
        const hash = await transferNFT(
            wallet,
            token_id,
            collection_address,
            chain,
            "repayment"
        );
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

const handleTransferTokenToAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, wallet, chain } = req.body;
        const hash = await transferToken(amount, wallet, chain, "collateral");
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

const handleTransferTokenToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, wallet, chain } = req.body;
        const hash = await transferToken(amount, wallet, chain, "repayment");
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

assetsRouter.post("/nft/transfer-to-admin", handleTransferNFTToAdmin);
assetsRouter.post("/nft/transfer-to-user", handleTransferNFTToUser);
assetsRouter.post("/token/transfer-to-admin", handleTransferTokenToAdmin);
assetsRouter.post("/token/transfer-to-user", handleTransferTokenToUser);
