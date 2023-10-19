import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { type BidRequest, bidRequestSchema } from "./bids.schema";
import { createBidItems, fetchBidItems } from "./bids.service";
import { validateQuery } from "../middlewares";

export const bidsRouter = Router();

const handleFetchBidsItems = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const items = await fetchBidItems();
        res.json({
            success: true,
            items: items,
        });
    } catch (err) {
        next(err);
    }
};

const handleCreateBid = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { loan_id, amount } = req.body as BidRequest;
        await createBidItems(loan_id, amount);
        res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
};

bidsRouter.get("/", handleFetchBidsItems);
bidsRouter.post("/", validateQuery("body", bidRequestSchema), handleCreateBid);
