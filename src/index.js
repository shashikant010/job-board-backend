import app from "./app.js"

app.listen(8000,()=>{
    console.log("app is listening on port 8000")
})

app.get("/",(req,res)=>{
    res.json({
        msg:"ok"
    })
})