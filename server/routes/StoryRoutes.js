import { Router } from "express";

import { checkUser, generateToken, getAllUsers, onBoardUser } from "../controllers/AuthController.js";
import { addStory,fetchStories } from "../controllers/StoryController.js";

const router = new Router();

router.post("/add-story", addStory);
router.get("/fetch-all-stories", fetchStories);


export default router;