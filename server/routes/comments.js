import express from "express"
import { createComment, deleteComment, getcomment, updateComment } from '../controll/comment.js'
import { verifyToken } from "../verifytoken.js";
const router = express.Router();

router.post("/",verifyToken,createComment)

router.delete("/:id",verifyToken,deleteComment)

// router.put("/:id",verifyToken,updateComment)

router.get("/:id",getcomment)



export default router;