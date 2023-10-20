import {
    Router,
    type Request,
    type Response,
    type NextFunction,
} from "express";
import {
    sendNotification,
    userSpecificNotification,
    createChannelSettings,
    optOutOfSettings,
    sendSettingsNotification,
} from "./notifications.services";

export const notificationRouter = Router();

const handleSendNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, description } = req.body;
        const response = await sendNotification(title, description);

        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

const handleUserSpecificNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { title, description, wallet_address } = req.body;
        const response = await userSpecificNotification(
            wallet_address,
            title,
            description
        );
        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

const handleCreateChannelSettings = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await createChannelSettings();
        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

const handleOptOutOfSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { index, userId } = req.body;
        const response = await optOutOfSettings(index, userId);
        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

const handleSendSettingsNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { index } = req.body;
        const response = await sendSettingsNotification(index);
        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        next(err);
    }
};

notificationRouter.post("/send", handleSendNotification);
notificationRouter.post("/send/user", handleUserSpecificNotification);
notificationRouter.post("/settings", handleCreateChannelSettings);
notificationRouter.post("/settings/opt-out", handleOptOutOfSettings);
notificationRouter.post(
    "/settings/notification",
    handleSendSettingsNotification
);
