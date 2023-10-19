import { transferToClient, transferToDev } from "./token.services";
import { Router } from "express";

const router = Router();

router.post("/transferToDev", transferToDev);
router.post("/transferToClient", transferToClient);

export default router;