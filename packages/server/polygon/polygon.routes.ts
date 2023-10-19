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
} from "./polygon.services";

export const polygonRouter = Router();

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
        const { collection_address, token_id, wallet } = req.body;
        const hash = await transferNFTToUser(
            wallet,
            token_id,
            collection_address
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
        const { amount, wallet } = req.body;
        const hash = await transferTokenToAdmin(amount, wallet);
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
        const { amount, wallet } = req.body;
        const hash = await transferTokenToUser(amount, wallet);
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

polygonRouter.post("/nft/transfer-to-admin", handleTransferNFTToAdmin);
polygonRouter.post("/nft/transfer-to-user", handleTransferNFTToUser);
polygonRouter.post("/token/transfer-to-admin", handleTransferTokenToAdmin);
polygonRouter.post("/token/transfer-to-user", handleTransferTokenToUser);
