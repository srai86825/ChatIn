import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  getInitialUsersWithMessages,
  getMessages,
} from "../controllers/MessageController.js";

import multer from "multer";
const router = new Router();


const uploadImage = multer({
  dest: "uploads/images",
});
const uploadAudio = multer({
  dest: "uploads/recordings",
});

router.get("/get-initial-users/:userId",getInitialUsersWithMessages);
router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to", getMessages);
router.use("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);


export default router;
