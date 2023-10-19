import transferToDev from "./nft.services";
import { Router } from "express";
const router = Router();

router.post("/transferNFT", transferToDev);

export default router;