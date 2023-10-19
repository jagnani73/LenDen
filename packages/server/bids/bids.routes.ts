import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { fetchBidItems } from "./bids.service";

export const bidsRouter = Router();

const handleFetchBidsItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await fetchBidItems();
        res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
};

bidsRouter.get("/items", handleFetchBidsItems);
