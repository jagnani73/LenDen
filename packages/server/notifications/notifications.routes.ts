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
    optSettings,
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

const handleOptSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { opted_settings, username } = req.body;
        const response = await optSettings(opted_settings, username);
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
notificationRouter.post("/settings/opted", handleOptSettings);
notificationRouter.post(
    "/settings/notification",
    handleSendSettingsNotification
);
