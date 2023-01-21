import express from "express"
import { google, logOut, signin, signup } from '../controll/auth.js'
const router = express.Router();
import {verifyToken}  from '../verifytoken.js'

//create a user

router.post("/signup",signup)

// sign in
router.post("/signin",signin)

// google auth
router.post("/google",google)

//log out

router.post("/logout",logOut)



export default router;