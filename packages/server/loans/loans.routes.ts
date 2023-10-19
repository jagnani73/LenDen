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
    loansRequestSchema,
    type LoansRequest,
    type LoanAcceptanceRequest,
    loanAcceptanceRequestSchema,
} from "./loans.schema";
import {
    acceptLoan,
    evaluateLoanValue,
    getLoansForUser,
} from "./loans.service";

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

const handleLoanAcceptance = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.body as LoanAcceptanceRequest;
        await acceptLoan(id);
        res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
};

const handleFetchLoans = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username } = req.params as LoansRequest;
        const loans = await getLoansForUser(username);
        res.json({
            success: true,
            loans: loans,
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
loansRouter.post(
    "/accept",
    validateQuery("body", loanAcceptanceRequestSchema),
    handleLoanAcceptance
);
loansRouter.get(
    "/:username",
    validateQuery("params", loansRequestSchema),
    handleFetchLoans
);
