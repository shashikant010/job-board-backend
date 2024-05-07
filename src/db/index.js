import mongoose from "mongoose";

const connectDB = async()=>{
    
    try {
        const connection = await mongoose.connect(`mongodb+srv://shashikant:sky9718@cluster0.lbiebv5.mongodb.net/jobBoard`)
        console.log("connected to mongodb successfuly : ",connection.connection.host)
    } catch (error) {
        console.log("MongoDB connection error : ",error)
    }
}

export {connectDB};