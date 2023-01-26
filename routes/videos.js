import express from "express";
import {
  addVideo,
  channelVideos,
  deleteVideo,
  getVideo,
  getVideoByTag,
  randomVideo,
  searchVideo,
  subVideo,
  trendingVideo,
  updateVideo,
  viewVideo,
} from "../controll/videos.js";
import { verifyToken } from "../verifytoken.js";
const router = express.Router();

//creare video
router.post("/", verifyToken, addVideo);
//get video
router.get("/find/:id", getVideo);
//update video
router.put("/:videoId", updateVideo);
//delete video
router.delete("/:videoId", verifyToken, deleteVideo);
//trending video
router.get("/trend", trendingVideo);
//random video
router.get("/random", randomVideo);
// views video
router.put("/view/:videoId", verifyToken, viewVideo);
// search video
router.get("/search", searchVideo);
//tags video
router.get("/tags", getVideoByTag);
//subscribed user video
router.get("/sub", verifyToken, subVideo);
//channel's all video
router.get("/allvideos", verifyToken, channelVideos);

export default router;
