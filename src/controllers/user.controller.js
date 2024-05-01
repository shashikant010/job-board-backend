import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/users.model.js";

const registerUser = asyncHandler(async(req,res,next)=>{
    const {username,fullName,skills,email,password}=req.body;
    const user =await User.create({
        username,
        fullName,
        password,
        email,
        skills
})
res.send("ok")
})

export {registerUser}