import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { validateQuery } from "../middlewares";
import {
    type LoanEvaluateRequest,
    loanEvaluateRequestSchema,
} from "./loans.schema";
import { evaluateLoanValue } from "./loans.service";

export const loansRouter = Router();

const handleLoanEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.body as LoanEvaluateRequest;
        const { id, interest, principal } = await evaluateLoanValue(data);
        res.json({
            success: true,
            evaluation: {
                id: id,
                interest: interest,
                principal: principal,
                output_ticker: data.output_ticker,
                period: data.period,
                period_unit: data.period_unit,
            },
        });
    } catch (err) {
        next(err);
    }
};

loansRouter.post(
    "/evaluate",
    validateQuery("body", loanEvaluateRequestSchema),
    handleLoanEvaluation
);
