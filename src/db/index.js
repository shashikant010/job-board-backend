import mongoose from "mongoose";

const connectDB = async()=>{
    
    try {
        const connection = await mongoose.connect(`mongodb://localhost:27017/jobBoard`)
        console.log("connected to mongodb successfuly : ",connection.connection.host)
    } catch (error) {
        console.log("MongoDB connection error : ",error)
    }
}

export {connectDB};