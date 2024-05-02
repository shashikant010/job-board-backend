import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/users.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessAndRefreshToken = async(userId)=>{
    try {
      console.log(userId  )
      const user = await User.findById(userId);
      console.log(user._id)
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
    
      user.refreshToken=refreshToken;
      user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}
    } catch (error) {
      console.log(error)
      throw new ApiError(500,"something went wrong while generting access and refresh token")
    }
   
  }



const registerUser = asyncHandler(async(req,res,next)=>{
    const {username,fullName,skills,email,password}=req.body;

    if([fullName,password,email,username].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"all fields are required")
      }
      
      const existedUser= await User.findOne({
        $or:[{username},{email}]
      })
      console.log(existedUser)
      
      if(existedUser){
        throw new ApiError(409,"User or email already exist")
      }
    

    const user =await User.create({
        username,
        fullName,
        password,
        email,
        skills
})

const createdUser= await User.findById(user._id).select("-password")

if(!createdUser){
  throw new ApiError(500,"something went wrong while creating the user");
}

return res.status(201).json(
  new ApiResponse(200,"User created successfully")
)

})


const loginUser = asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    if(!password && !email){
        throw new ApiError(400,"Email and password is required")
      }
    
      const user = await User.findOne({email})
    
      if(!user){
        throw new ApiError(404,"user not find")
      }
      
      if(password!==user.password){
        throw new ApiError(401,"password is wrong")
      }

      
        const {refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id);

        const loggedinUser=await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly:true,
            secure:true
        }

  return res
  .status(201)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(new ApiResponse(200,{user:loggedinUser,accessToken,refreshToken},"user logged in successfully"))
})

const currentUser = asyncHandler(
    async(req,res)=>{
        return res.status(200).json(
            new ApiResponse(200,req.user,"current user fetched successfully")
        )
    }
)


export {registerUser,loginUser,currentUser}