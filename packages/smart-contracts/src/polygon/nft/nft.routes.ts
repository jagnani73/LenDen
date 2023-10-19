import transferToDev from "./nft.services";
import { Router } from "express";
const router = Router();

router.post("/transferToDev", transferToDev);


export default router;