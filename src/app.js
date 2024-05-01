import express from "express";
import userRouter from "./routes/user.router.js"
import cors from "cors"


const app=express();

app.use(cors({
  origin:"*",
  credentials:true
}
))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use(express.json())

  
app.get("/",(req,res)=>{
    res.json({
        msg:"ok"
    })
})

app.post("/user",

userRouter
)

    




export default app;