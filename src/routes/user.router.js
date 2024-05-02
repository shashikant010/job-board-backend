
import { registerUser,loginUser, currentUser } from "../controllers/user.controller.js"


import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router =Router()

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)

router.route("/getcurrentuser").post(verifyJWT,currentUser)

export default router ;