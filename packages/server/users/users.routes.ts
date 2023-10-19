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
    userSignInRequestSchema,
    type UserSignInRequest,
} from "./users.schema";
import { createJWToken, userExists, userSignUp } from "./users.service";

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

const handleUserSignIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { wallet_address } = req.body as UserSignInRequest;
        const user = await userExists(wallet_address);
        if (user) {
            const token = createJWToken(user.wallet_address, user.username);
            res.json({
                success: true,
                token: token,
            });
        }
    } catch (err) {
        next(err);
    }
};

usersRouter.post(
    "/sign-up",
    validateQuery("body", userSignUpRequestSchema),
    handleUserSignUp
);
usersRouter.post(
    "/sign-in",
    validateQuery("body", userSignInRequestSchema),
    handleUserSignIn
);
