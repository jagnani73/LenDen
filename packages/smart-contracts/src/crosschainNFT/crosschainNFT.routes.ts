import { mintNft } from "./crosschainNFT.services";

import { Router } from "express";

const router = Router();

router.post("/mintNft", mintNft);

export default router;
