import mongoose , {Schema}from "mongoose"
import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

const userSchema=new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    skills:[
            {
                type:String,
            }
    ],
    jobs:[{
        type:Schema.Types.ObjectId,
        ref:"Job"
    }],

    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isEmployer:{
        type:Boolean,
    },
    organization:{
        type:String
    },
    refreshToken: {
        type: String
    }
},{
    timestamps:true
})


// userSchema.pre("save", async function (next) {
//     console.log(this.isModified("password"))
//     if(!this.isModified("password")){
//         console.log("saving something but password modified")
//         return next();} 

//     this.password = await bcrypt.hash(this.password, 10)
//     console.log("password hashed ", this.password)

//     next()
// })

// userSchema.methods.isPasswordCorrect = async function(password){
//     console.log(password,this.password)
//     return await bcrypt.compare(password, this.password)
// }

userSchema.methods.generateAccessToken= function(){
    return  jwt.sign({
        id:this._id,
        email:this.email,
        fullName:this.fullName,
        username:this.username
    },"SKYISHERE",{
        expiresIn:"1d"
    })
}
userSchema.methods.generateRefreshToken=function(){
    return  jwt.sign({
        _id:this._id,
    },"SKYISTHERE",{
        expiresIn:"10d"
    })
}

export const User=mongoose.model("User",userSchema)















//TODO : change access refresh token key to process.env