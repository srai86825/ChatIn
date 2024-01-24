import { Router } from "express";
import {
  attemptPoll,
  createPoll,
  fetchFeed,
  fetchPolls,
} from "../controllers/FeedController.js";

const router = new Router();

router.get("/fetch-feed/:userId", fetchFeed);
router.post("/add-poll/:userId", createPoll);
router.patch("/attempt-poll/:userId", attemptPoll);
router.get("/fetch-polls", fetchPolls);

export default router;
