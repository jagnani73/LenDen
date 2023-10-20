import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { validateQuery } from "../middlewares";
import {
    type CreateLendingRequest,
    createLendingRequestSchema,
    completeLendingRequestSchema,
    type CompleteLendingRequest,
    lendingRequestSchema,
    type LendingRequest,
} from "./lending.schema";
import {
    completeLending,
    createLending,
    fetchLending,
} from "./lending.service";

export const lendingRouter = Router();

const handleCreateLending = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, ticker, wallet_address, period, username } =
            req.body as CreateLendingRequest;
        await createLending(amount, ticker, wallet_address, period, username);
        res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
};

const handleCompleteLending = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.body as CompleteLendingRequest;
        const hash = await completeLending(id);
        res.json({
            success: true,
            transaction_hash: hash,
        });
    } catch (err) {
        next(err);
    }
};

const handleLending = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username } = req.params as LendingRequest;
        const lends = await fetchLending(username);
        res.json({
            success: true,
            lends: lends,
        });
    } catch (err) {
        next(err);
    }
};

lendingRouter.post(
    "/create",
    validateQuery("body", createLendingRequestSchema),
    handleCreateLending
);
lendingRouter.post(
    "/complete",
    validateQuery("body", completeLendingRequestSchema),
    handleCompleteLending
);
lendingRouter.get(
    "/:username",
    validateQuery("params", lendingRequestSchema),
    handleLending
);
