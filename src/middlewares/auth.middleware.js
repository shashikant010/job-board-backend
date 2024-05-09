import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import asyncHandler from "../utils/asyncHandler.js";


export const verifyJWT = asyncHandler(async(req,_,next)=>{

try {
    const token = req.accessToken || req.body.accessToken;
    
    if(!token){
        throw new ApiError(401,"unAuthorized user")
    }
    
    const decodedToken=jwt.verify(token,"SKYISHERE");
    console.log(decodedToken)
    
    const user = await User.findById(decodedToken.id).select("-password ")
    
    if(!user){
        throw new ApiError(401,"invalid token")
    }
    
    req.user=user;
    next()
} catch (error) {
    throw new ApiError(401,"invalid access token")
}

})