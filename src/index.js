import app from "./app.js"
import {connectDB} from "./db/index.js"
import { User } from "./models/users.model.js"
import express from "express"



connectDB().then(app.listen(8000,()=>{
    console.log("app is listening on port 8000")
})
)

