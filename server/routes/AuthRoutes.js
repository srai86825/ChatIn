import { Router } from "express";

import { checkUser, generateToken, getAllUsers, onBoardUser } from "../controllers/AuthController.js";

const router = new Router();

router.post("/check-user", checkUser);
router.post("/onboard", onBoardUser);
router.get("/get-all-users", getAllUsers);
router.get("/generate-token/:userId",generateToken);

export default router;
