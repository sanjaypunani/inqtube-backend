import express from "express";
const router = express();
import baseController from "../controllers/base-controller";

router.get("/", baseController.index);
router.get("/live-streams", baseController.getLiveStreams);

export default router;
