import express from "express";

const app = express();
app.use(express.json());


app.get("/heath", (req, res) => { 
    res.status(200).json({success:true,message:"Hellow there"})
})

export default app;