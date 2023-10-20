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
} from "./lending.schema";
import { completeLending, createLending } from "./lending.service";

export const lendingRouter = Router();

const handleCreateLending = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { amount, ticker, wallet_address } =
            req.body as CreateLendingRequest;
        await createLending(amount, ticker, wallet_address);
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
