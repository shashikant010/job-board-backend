
import { registerUser,loginUser, currentUser, postjob, getAllJobs, getitembyid, applyForJob, searchjob, sendOtp, removeJob } from "../controllers/user.controller.js"


import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { get } from "mongoose"

const router =Router()

router.route("/signup").post(registerUser)

router.route("/login").post(loginUser)

router.route("/getcurrentuser").post(verifyJWT,currentUser)

router.route("/postjob").post(verifyJWT,postjob)

router.route("/getalljobs").post(getAllJobs)

router.route("/getitem/:id").post(getitembyid)

router.route("/applyforjob").post(applyForJob)

router.route("/searchjob/:item").post(searchjob)

router.route("/sendOtp").post(sendOtp)

router.route("/removejob").post(removeJob)

export default router ;