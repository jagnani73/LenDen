import express, { type Express, type Request, type Response } from "express";
import { config as DotenvConfig } from "dotenv";

DotenvConfig();
const app: Express = express();
app.use(express.json());

app.get("/api/v1/healthcheck", (_req: Request, res: Response) => {
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.use("*", (_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
    });
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: Error | any, _req: Request, res: Response) => {
    if (err?.errorCode) {
        console.error("Server Error");
        console.error(err);
        res.status(err.errorCode).json({
            success: false,
            message: `${err.name}: ${err.message}`,
        });
    } else {
        console.error("Unknown Error");
        console.error(new Date().toISOString());
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

Promise.all([])
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
