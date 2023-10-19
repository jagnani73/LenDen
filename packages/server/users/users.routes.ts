import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import { validateQuery } from "../middlewares";
import {
    type UserSignUpRequest,
    userSignUpRequestSchema,
} from "./users.schema";
import { userSignUp } from "./users.service";

export const usersRouter = Router();

const handleUserSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { signature, username, wallet_address } =
            req.body as UserSignUpRequest;
        await userSignUp(username, wallet_address, signature);
        res.json({
            success: true,
        });
    } catch (err) {
        next(err);
    }
};

usersRouter.post(
    "/sign-up",
    validateQuery("body", userSignUpRequestSchema),
    handleUserSignUp
);
