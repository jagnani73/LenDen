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
import { createJWToken, userAuthentication, userSignUp } from "./users.service";

export const usersRouter = Router();

const handleUserSignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, wallet_addresses, password } =
            req.body as UserSignUpRequest;
        await userSignUp(username, password, wallet_addresses);
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
        const { password, username } = req.body as UserSignInRequest;
        const user = await userAuthentication(username, password);
        if (user) {
            const token = createJWToken(user.wallet_addresses, user.username);
            res.json({
                success: true,
                token: token,
                wallet_addresses: user.wallet_addresses,
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
