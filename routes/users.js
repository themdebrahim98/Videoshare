import express from "express";
import {
  deleteUSer,
  disLike,
  getUser,
  like,
  subUser,
  unSubUser,
  updateUSer,
} from "../controll/user.js";
import { verifyToken } from "../verifytoken.js";
const router = express.Router();

// like
router.put("/like/:id", verifyToken, like);
//update user
router.put("/update/:id", verifyToken, updateUSer);

// get user
router.get("/find/:id", getUser);

//delete user
router.delete("/delete/:id", verifyToken, deleteUSer);
// subscribe
router.put("/sub/:id", verifyToken, subUser);
// unsubscribe
router.put("/unsub/:id", verifyToken, unSubUser);

//dislike
router.put("/dislike/:id", verifyToken, disLike);

// comment
router.put("/comment/:videoId", verifyToken, subUser);

export default router;
