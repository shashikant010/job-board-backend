
import { registerUser,loginUser, currentUser, postjob, getAllJobs } from "../controllers/user.controller.js"


import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { get } from "mongoose"

const router =Router()

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)

router.route("/getcurrentuser").post(verifyJWT,currentUser)

router.route("/postjob").post(verifyJWT,postjob)

router.route("/getalljobs").post(getAllJobs)

export default router ;