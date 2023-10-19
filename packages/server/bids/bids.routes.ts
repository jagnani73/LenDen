import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import {
    type BidRequest,
    bidRequestSchema,
    bidsRequestSchema,
    type BidsRequest,
} from "./bids.schema";
import { createBidItems, fetchBidItems, fetchBids } from "./bids.service";
import { validateQuery } from "../middlewares";

export const bidsRouter = Router();

const handleFetchBidsItems = async (
    _req: Request,
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

const handleFetchBids = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { loan_id } = req.body as BidsRequest;
        const bids = await fetchBids(loan_id);
        res.json({
            success: true,
            bids: bids,
        });
    } catch (err) {
        next(err);
    }
};

bidsRouter.get("/", handleFetchBidsItems);
bidsRouter.post("/", validateQuery("body", bidRequestSchema), handleCreateBid);
bidsRouter.get(
    "/:loan_id",
    validateQuery("body", bidsRequestSchema),
    handleFetchBids
);
