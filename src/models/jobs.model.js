import mongoose,{ Schema } from "mongoose";

const jobSchema = new Schema({
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
skillSet:[
    {
        type:String,
        required:true
    }
],
appliers:[
    {
        type:Schema.Types.ObjectId, 
        ref:"User"
    }
]
},{timestamps:true})

jobSchema.index({ title: 'text' });

export const Job = mongoose.model("Job",jobSchema)
