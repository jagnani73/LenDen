import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import {
    transferNFTToUser,
    transferNFTToAdmin,
    transferTokenToUser,
    transferTokenToAdmin,
} from "./avax.service";

export const avaxRouter = Router();

const handleTransferNFTToAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { collection_address, token_id, wallet } = req.body;
        const hash = await transferNFTToAdmin(
            wallet,
            token_id,
            collection_address
        );
        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: hash,
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
        const { collection_address, token_id, wallet } = req.body;
        const hash = await transferNFTToUser(
            wallet,
            token_id,
            collection_address
        );
        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: hash,
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
        const { amount, wallet } = req.body;
        const hash = await transferTokenToAdmin(amount, wallet);
        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: hash,
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
        const { amount, wallet } = req.body;
        const hash = await transferTokenToUser(amount, wallet);
        res.json({
            success: true,
            message: "Transfer successful",
            transactionHash: hash,
        });
    } catch (err) {
        next(err);
    }
};

avaxRouter.post("/nft/transfer-to-admin", handleTransferNFTToAdmin);
avaxRouter.post("/nft/transfer-to-user", handleTransferNFTToUser);
avaxRouter.post("/token/transfer-to-admin", handleTransferTokenToAdmin);
avaxRouter.post("/token/transfer-to-user", handleTransferTokenToUser);
