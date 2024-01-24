import { Router } from "express";

import { addStory, fetchStories } from "../controllers/StoryController.js";

const router = new Router();

router.post("/add-story", addStory);
router.get("/fetch-all-stories/", fetchStories);
router.get("/fetch-all-stories/:userId", fetchStories);

export default router;
