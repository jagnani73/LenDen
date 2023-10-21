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
    bidItemSchema,
    type BidItemRequest,
} from "./bids.schema";
import { createBid, fetchBidItem, fetchBids } from "./bids.service";
import { validateQuery } from "../middlewares";

export const bidsRouter = Router();

const handleFetchBidsItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params as BidItemRequest;
        const { nft, item } = await fetchBidItem(id);
        res.json({
            success: true,
            item: item,
            nft: nft,
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
        const { loan_id, amount, wallet_address } = req.body as BidRequest;
        await createBid(loan_id, amount, wallet_address);
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
        const { loan_id } = req.params as BidsRequest;
        const bids = await fetchBids(loan_id);
        res.json({
            success: true,
            bids: bids,
        });
    } catch (err) {
        next(err);
    }
};

bidsRouter.post("/", validateQuery("body", bidRequestSchema), handleCreateBid);
bidsRouter.get(
    "/loan/:id",
    validateQuery("params", bidItemSchema),
    handleFetchBidsItem
);
bidsRouter.get(
    "/:loan_id",
    validateQuery("params", bidsRequestSchema),
    handleFetchBids
);
