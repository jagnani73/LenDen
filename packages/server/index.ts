import express, { type Express, type Request, type Response } from "express";
import { config as DotenvConfig } from "dotenv";
import {
    CoinMarketCapService,
    CovalentService,
    SupabaseService,
} from "./services";
import { usersRouter } from "./users/users.routes";
import { type PostgrestError } from "@supabase/supabase-js";
import { loansRouter } from "./loans/loans.routes";
import { bidsRouter } from "./bids/bids.routes";
import { assetsRouter } from "./assets/assets.routes";
import { lendingRouter } from "./lending/lending.routes";
import { crossChainNFTRouter } from "./cross-chain-nft/cross-chain-nft.routes";
import { notificationRouter } from "./notifications/notifications.routes";
import cors from "cors";

DotenvConfig();
const app: Express = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/healthcheck", (_req: Request, res: Response) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/loans", loansRouter);
app.use("/api/v1/bids", bidsRouter);
app.use("/api/v1/assets", assetsRouter);
app.use("/api/v1/lending", lendingRouter);
app.use("/api/v1/cross-chain-nft", crossChainNFTRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("*", (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
    });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: Error | PostgrestError, _req: Request, res: Response) => {
    if (err) {
        console.error("Server Error");
        console.error(new Date().toISOString());
        console.error(err);
        res.status(500).json({
            success: false,
            message: err,
        });
    }
});

Promise.all([
    CoinMarketCapService.initService(),
    CovalentService.initCovalentClient(),
    SupabaseService.initSupabase(),
])
    .then(() => {
        const port: number = 8080;
        app.listen(port, () => {
            console.info("Server listening on Port:", port);
        });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

process.on("SIGINT", () => process.exit(0));
process.on("SIGHUP", () => process.exit(0));
