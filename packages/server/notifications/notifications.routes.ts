import {
    sendNotification,
    userSpecificNotification,
    createChannelSettings,
} from "./notifications.services";
import { Router } from "express";

export const notificationRouter = Router();

const handleSendNotification = async (req: any, res: any) => {
    try {
        const { title, body } = req.body;
        const response = await sendNotification(title, body);

        res.json({
            success: true,
            data: response,
        });
    } catch (err) {
        console.log(err);
    }
};

const handleUserSpecificNotification = async (req: any, res: any) => {
    try {
        const { title, body, wallet_address } = req.body;
        const response = await userSpecificNotification(
            wallet_address,
            title,
            body
        );
        res.json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.log(error);
    }
};

const handleCreateChannelSettings = async (req: any, res: any) => {
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

notificationRouter.post("/send", handleSendNotification);
notificationRouter.post("/send/user", handleUserSpecificNotification);
notificationRouter.post("/settings", handleCreateChannelSettings);
