import express from "express";
import userRouter from "./routes/user.router.js"
import cors from "cors"


const app=express();

app.use(cors({
  origin:"*",
  credentials:true
}
))

app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
      });



  



app.use("/user",userRouter)

app.get("/",(req,res)=>{
  res.json({
      msg:"ok"
  })
})

    




export default app;