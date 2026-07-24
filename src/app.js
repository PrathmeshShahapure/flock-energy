import express from "express";
import meterRoutes from "./routes/meter.routes.js";

const app = express();
app.use(express.json());

app.use("/api/meters", meterRoutes);

app.get("/heath", (req, res) => { 
    res.status(200).json({success:true,message:"Hellow there"})
})

export default app;