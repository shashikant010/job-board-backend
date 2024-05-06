import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/users.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Job } from "../models/jobs.model.js";
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "shashikantyadav9718@gmail.com",
    pass: "mmpc msww zduo vtej",
  },
});


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
    const {username,fullName,skills,email,password,isEmployer,organization}=req.body;

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
        skills,isEmployer,organization
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

const postjob = asyncHandler(async(req,res)=>{
  const {title,skillSet,description}=req.body;
  if(!title || !skillSet || !description){
    throw new ApiError(401,"All fields are required")
  }
  const user=req.user;
  console.log(user)
  if(!user){
    throw new ApiError(400,"unAuthorized request please login")
  }

  const job = await Job.create({
    title,
    skillSet,
    description,
    owner:user
  })

  return res.status(200).json(
    new ApiResponse(200,job,"Job posted successfully")
  )
})


const getAllJobs = asyncHandler(async(req,res)=>{
    const job = await Job.find()
    return res.status(200).json(new ApiResponse(200,job,"job fetched successfully"))
})

const getitembyid=asyncHandler(async(req,res)=>{
  const {id}=req.params;

  const item=await User.findById(id);

  if(!item){
    item= await Job.findById(id);
  }
  return res.status(200).json(
    new ApiResponse(200,item,"item fetched")
  )
})

const applyForJob=asyncHandler(async(req,res)=>{
  const {jobid,userid}=req.body;
  const job = await Job.findById(jobid);
  const user = await User.findById(userid);

  job.appliers.map((item)=>{
    if(item.toString()===userid){
      throw new ApiError(409,"already Applied")
    }
  })

  const updatedjob = await Job.findById(jobid).updateOne({
    $push:{
      appliers:user
    }
  })

  console.log(user.email)
  let mailOptions ={
    from: "shashikantyadav9718@gmail.com",
    to: user.email,
    subject: `Heyy you applied succefully for ${job.title}`,
    text: "Congratulations"
  }

  const info = await transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      console.log("error while sending mail")
    }
    else{
      console.log("mail sent successfully")
    }
  })

  return res.status(200).json(new ApiResponse(200,job,"applied successfully"))
})

const searchjob=asyncHandler(async(req,res)=>{

  const {item}=req.params;

  await Job.createIndexes({ title: "text" , plot: "text" })

  const result = await Job.find( { $text: { $search: item } })
  

  res.status(200).json(new ApiResponse(200,result,"jobs searched successfully"))
})

export {registerUser,loginUser,currentUser,postjob,getAllJobs,getitembyid,applyForJob,searchjob}