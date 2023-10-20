import {
    sendNotification,
    userSpecificNotification,
    createChannelSettings,
    optOutOfSettings,
    sendSettingsNotification,
} from "./notifications.services";
import type { Request, Response } from "express";
import { Router } from "express";

export const notificationRouter = Router();

const handleSendNotification = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const response = await sendNotification(title, description);

        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        console.log(err);
    }
};

const handleUserSpecificNotification = async (req: Request, res: Response) => {
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
    } catch (error) {
        console.log(error);
    }
};

const handleCreateChannelSettings = async (req: Request, res: Response) => {
    try {
        const response = await createChannelSettings();
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.log(error);
    }
};

const handleOptOutOfSettings = async (req: Request, res: Response) => {
    try {
        const { index, userId } = req.body;
        const response = await optOutOfSettings(index, userId);
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.log(error);
    }
};

const handleSendSettingsNotification = async (req: Request, res: Response) => {
    try {
        const { index } = req.body;
        const response = await sendSettingsNotification(index);
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.log(error);
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
