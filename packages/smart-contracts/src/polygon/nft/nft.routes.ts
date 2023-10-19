import {transferToDev, transferToClient} from "./nft.services";
import { Router } from "express";
const router = Router();

router.post("/transferToDev", transferToDev);
router.post("/transferToClient", transferToClient);

export default router;